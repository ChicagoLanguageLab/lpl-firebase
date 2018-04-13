function NegationExperiment(params) {

  /** Hold experimental trials.
   * @type {Array<object>}
   */
  var timeline = [];

  // Variables that affect the layout of the experiment
  var version = params.version;
  var condition = params.condition;

  // Add experimental variables to jsPsych's data object.
  this.addPropertiesTojsPsych = function () {
    jsPsych.data.addProperties({
      workerId: params.workerId,
      version: version,
      condition: condition
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
      var data = jsPsych.data.getLastTrialData();
      return !data.consented;
    }

    // Check that the participant entered a valid age.
    preamble.demographics_check.conditional_function = function() {
      var data = jsPsych.data.getLastTrialData();
      console.log(data);
      if(parseInt(data.age) < 18) return true;
      return false;
    }

    timeline = timeline.concat([preamble.intro, preamble.consent, preamble.consent_check, preamble.demographics, preamble.demographics_check, preamble.post_demographics]);
  }

  /** Initialize trials.
   */
  var initTrials = function(is_practice) {

    if(is_practice) {

    } else {
      var factors = jsPsych.randomization.shuffle(jsPsych.randomization.factorial(params.factors, 2));
      var trials = jsPsych.randomization.shuffle(
        _.chain(params.items)
        .zip(params.person)
        .zip(params.people)
        .map(function(item, i) {

          item.unshift(i);
          item = _.flatten(item);

          if(factors[i].stimulus === 'item'    && factors[i].polarity === 'positive' ||
             factors[i].stimulus === 'nothing' && factors[i].polarity === 'negative') {
             factors[i].is_true = true;
          } else {
             factors[i].is_true = false;
          }

          return(_.extend({
              trial_id: item[0],
              item: item[1],
              person: item[2],
              people: item[3]
            }, factors[i]));

        }).value()
      );

      _.each(trials, function(trial, i) {

        var context = [];
        var header = '<img src="resources/images/';
        var footer = '.jpg"></img>';

        for(var x = 0; x < trial.context; x++) {
          context.push(header + trial.item + '_context' + (x + 1) + '_item' + footer);
        }
        for(var x = 0; x < 3 - trial.context; x++) {
         context.push(header + trial.item + '_context' + (x + 1)  + '_nothing' + footer);
        }
        context = jsPsych.randomization.shuffle(context);

        timeline.push({
          type: 'single-stim',
          is_html: true,
          stimulus: '<p class="text-center">' + _.reduce(context, function(memo, str){ return memo + ' ' + str; }, '') + '</p>',
          prompt: '<p class="text-center">Look at these ' + trial.people + '!</p>',
          timing_response: 3000,
          response_ends_trial: false,
          choices: []
        });

        timeline.push({
          type: 'button-response',
          is_html: true,
          stimulus: '<p class="text-center">' + header + trial.item + '_' + trial.stimulus + footer + '</p>',
          prompt: '<p class="text-center">' + trial.person + params.strings[trial.polarity] + trial.item + '.</p>',
          choices: ['True', 'False']
        });

      });
    }

  }

  this.createTimeline = function() {

    // Add preamble
    // NOTE: Comment out for faster testing.
    //initPreamble();

    // Build the practice sequence
    initTrials(true);

    // Build the experiment trials
    initTrials(false);

  }

};
