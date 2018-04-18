function NegationExperiment(params) {

  /** Hold experimental trials.
   * @type {Array<object>}
   */
  var timeline = [];

  // Variables that affect the layout of the experiment
  var version = params.version;
  var condition = params.condition == undefined ? 'N/A' : params.condition;
  var color_condition = params.color_condition;

  // "Question" versions use a different stimuli layout
  if(version.includes('question')) {

    _.each(params.question_blocked_factors.distribution, function(dist) {
      dist.shapes = jsPsych.randomization.shuffle(dist.shapes);
    });

    // Randomize options for the pre-TF question
    if(version === "question-rb") { // "What color will it be?"
      params.choices = jsPsych.randomization.shuffle(['Red', 'Blue']);
    } else if(version === "question-yn") { // "Will it be red (blue)?"
      params.choices = ['Yes', 'No'];
    }

  }

  // Add experimental variables to jsPsych's data object.
  this.addPropertiesTojsPsych = function () {
    jsPsych.data.addProperties({
      workerId: params.workerId,
      version: version,
      condition: condition,
      color_condition: color_condition
    });
  }

  /** Return the subject's ID.
   * @returns {String}
   */
  this.getSubjectId = function() {
    return params.workerId;
  }

  /** Return the timeline.
   * @returns {Array<Obejct>}
   */
  this.getTimeline = function() {
    return timeline;
  }

  /** Add the standard preamble (welcome, consent, demographics, intro) to the timeline.
   *  Preamble input data can be edited in negation.data.json.
   */
  var initPreamble = function() {
    var preamble = params.preamble;

    // NOTE: Functions cannot be included in JSON files - must be appended here instead.

    /* This function checks whether or not the subject consented to the experiment.
     * jsPsych uses the return value (true/false) to determine whether or not to
     * display the conditional trial. True -> display the trial. False -> continue
     * the experiment.
    */
    preamble.consent_check.conditional_function = function() {
      var data = jsPsych.data.getLastTrialData().values()[0];
      return !data.consented;
    }

    // Check that the participant entered a valid age.
    preamble.demographics_check.conditional_function = function() {
      var data = jsPsych.data.getLastTrialData().values()[0];
      console.log(data);
      if(parseInt(data.age) < 18) return true;
      return false;
    }

    timeline = timeline.concat([preamble.intro, preamble.consent, preamble.consent_check, preamble.demographics, preamble.demographics_check, preamble.post_demographics]);
  }

  /** Initialize trials.
   */
  var initTrials = function(is_practice) {

    var factors;
    var trials;
    var shapes;

    // Retrive the correct set of factors based on version.
    if(is_practice) {
      if(version.includes('question')) {
        if(condition != 'N/A') {
          factors = params.conditioned_practice_factors[condition];
        } else {
          factors = params.question_practice_factors;
        }
      } else {
        factors = params.practice_factors;
      }
    } else {
      if(version.includes('question')) {
        if(condition != 'N/A') {
          factors = params.conditioned_factors[condition];
        } else {
          factors = params.question_blocked_factors;
        }
      } else {
        factors = params.blocked_factors;
      }
    }

    trials =  _.sortBy(jsPsych.randomization.factorial(factors, 1), 'color');

    // "Question" trial factors include the shapes.
    if(version.includes('question')) {
      if(condition != 'N/A' && !is_practice) {
        shapes = params.conditioned_shapes.concat(params.conditioned_shapes);
      }
      else {
        shapes = [];
      }
    } else { // In older versions, the shapes are balanced and randomized separately.
      shapes = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.shape_factors[color_condition], 1), trials.length, true);
    }

    // Combine trials data and shapes
    trials = jsPsych.randomization.shuffle(_.zip(trials, shapes));

    // Create trials and add to timeline
    timeline = timeline.concat(createTrials(trials, params, is_practice));

  }

  this.createTimeline = function() {

    // Add preamble
    // NOTE: Comment out for faster testing.
    initPreamble();

    // Build the practice sequence
    initTrials(true);
    if(!version.includes("question")) {
      block.push({
        type: 'instructions',
        "key_forward": " ",
        "show_clickable_nav": true,
        "allow_backward": false,
        "button_label_next": "Begin experiment",
        text: '<p class="text-center">You have finished the practice section!</p><p class="text-center">To repeat, if the content of the sentence is compatible with what the images show, then it is "True"; otherwise it is "False".</p><p class="text-center">The real experiment will now begin. Please <strong>click the button below</strong> to continue.</p>'
      });
    }

    // Build the experiment trials
    initTrials(false);

  }

};
