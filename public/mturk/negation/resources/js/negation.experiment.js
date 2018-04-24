function NegationExperiment(params) {

  /** Hold experimental trials.
   * @type {Array<object>}
   */
  var timeline = [];

  // Variables that affect the layout of the experiment
  var version = params.version;
  var condition = params.condition == undefined ? 'N/A' : params.condition;
  var color_condition = params.color_condition;

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

    var factors = {}
    var trials;
    var shapes;
    var reps = 1;

    // Retrive the correct set of factors based on version.
    if(is_practice) {
      switch(version) {
        case 'question-yn':
        case 'question-rb':
          if(condition === 'bysubj') {
            factors = params.conditioned_practice_factors[condition];
          } else {
            factors = params.question_practice_factors;
          }
          break;
        case '2display':
          factors = params.twod_practice_factors;
          break;
        default:
          factors = params.practice_factors
      }
    } else {
      if(version.includes('question')) {
        if(condition == 'withinsubj') {
          factors.distribution = params.factors.distribution;
          factors.polarity = params.factors.polarity;
          factors.is_true = params.factors.is_true;
          reps = 2;
        } else {
          factors.ratio = [params.factors.distribution[condition]];
          factors.polarity = params.factors.polarity;
          factors.color = params.factors.color;
          factors.is_true = params.factors.is_true;
        }

        // Randomize options for the pre-TF question
        if(version === "question-rb") { // "What color will it be?"
          params.choices = jsPsych.randomization.shuffle(['Red', 'Blue']);
        } else if(version === "question-yn") { // "Will it be red (blue)?"
          params.choices = ['Yes', 'No'];
        }

      } else if(version === '2display') {
        factors.distribution = params.factors.distribution;
        factors.polarity = params.factors.polarity;
        factors.is_true = params.factors.is_true;
        if(params.condition != '1shape') {
          factors.coloring = params.factors.coloring;
        }
      } else {
        factors.distribution = params.factors.distribution;
        factors.polarity = params.factors.polarity;
        factors.is_true = params.factors.is_true;
        factors.coloring = params.factors.coloring;
      }
    }

    trials =  jsPsych.randomization.factorial(factors, reps);

    if(!is_practice) {
      if(condition !== '1shape') {
        _.each(params.factors.distribution, function(dist) {
          dist.shape_factors = jsPsych.randomization.shuffle(jsPsych.randomization.factorial(params.shape_factors[params.color_condition]));
      });
      } else {
        _.each(params.factors.distribution, function(dist) {
          var a = jsPsych.randomization.shuffle(["triangle", "circle", "square", "star"]);
          var b = jsPsych.randomization.shuffle(["red", "blue", "red", "blue"]);
          dist.shape_factors = _.map(_.zip(a,b), function(c) {
            return ({shape: c[0], color: c[1]});
          });
      });
      }
    }

    // Create trials and add to timeline
    timeline = timeline.concat(createTrials(trials, params, is_practice));

  }

  this.createTimeline = function() {

    // Add preamble
    // NOTE: Comment out for faster testing.
    initPreamble();

    // Build the practice sequence
    initTrials(true);

    timeline.push({
      type: 'instructions',
      pages: ['<p class="lead">This is the end of the practice questions.</p><p>Remember, during the experiment we will be recording how quickly you respond, so please respond as quickly and accurately as possible.</p><p>Please <strong>click the button below</strong> to begin!'],
      key_forward: " ",
      "button_label_next": "Begin experiment",
      "show_clickable_nav": true,
      "allow_backward": false
    });

    // Build the experiment trials
    initTrials(false);

  }

};
