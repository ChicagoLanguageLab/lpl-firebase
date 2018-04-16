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

    timeline = timeline.concat([/*preamble.intro, preamble.consent, preamble.consent_check, preamble.demographics, preamble.demographics_check,*/ preamble.post_demographics]);
  }

  /** Initialize trials.
   */
  var initTrials = function(is_practice) {

    var factors = is_practice ? params.practice_factors : params.factors;

    var items = is_practice ? params.practice_items : params.items;
    var person = is_practice ? params.practice_person : params.person;
    var people = is_practice ? params.practice_people : params.people;

    if(is_practice) {
      var items = _.chain(items)
        .zip(params.practice_adjectives)
        .zip(params.practice_answers)
        .map(function(item) {
          item = _.flatten(item);
          return({
            object: item[0],
            adjective: item[1],
            is_true: item[2]
        });
      }).value();
    }

    var factors = jsPsych.randomization.shuffle(jsPsych.randomization.factorial(factors, 2));
    var trials = jsPsych.randomization.shuffle(
      _.chain(items)
      .zip(person)
      .zip(people)
      .map(function(item, i) {

        item.unshift(i);
        item = _.flatten(item);

        if(factors[i].polarity != undefined) {
          if(factors[i].stimulus === 'item'    && factors[i].polarity === 'positive' ||
             factors[i].stimulus === 'nothing' && factors[i].polarity === 'negative') {
               factors[i].is_true = true;
          } else {
           factors[i].is_true = false;
          }
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

      if(is_practice) {
        context.push(header + trial.item.object + '_contextL'  + footer);
        context.push(header + trial.item.object + '_contextR'  + footer);
        context.push(header + trial.item.object + '_contextC'  + footer);
      } else {
        for(var x = 0; x < trial.context; x++) {
          context.push(header + trial.item + '_context' + (x + 1) + '_item' + footer);
        }
        for(var x = 0; x < 3 - trial.context; x++) {
         context.push(header + trial.item + '_context' + (x + 1)  + '_nothing' + footer);
        }
        context = jsPsych.randomization.shuffle(context);
      }

      timeline.push({
        type: 'single-stim',
        is_html: true,
        stimulus: '<p class="text-center">' + _.reduce(context, function(memo, str){ return memo + ' ' + str; }, '') + '</p>',
        timeline: [
          {prompt: '<p class="text-center large"><strong>Look at these ' + trial.people + '!</strong></p><p class="text-center"><i>Please wait .</i></p>'},
          {prompt: '<p class="text-center large"><strong>Look at these ' + trial.people + '!</strong></p><p class="text-center"><i>Please wait . .</i></p>'},
          {prompt: '<p class="text-center large"><strong>Look at these ' + trial.people + '!</strong></p><p class="text-center"><i>Please wait . . .</i></p>'}
        ],
        timing_response: 1000,
        response_ends_trial: false,
        choices: [],
        timing_post_trial: 0
      });

      var prompt;
      var stimulus;
      var loop_function = undefined;
      var data = {}
      if(is_practice) {
        prompt = '<p class="text-center large"><strong>' + trial.person + params.strings.positive + trial.item.adjective + trial.item.object + '.</p>';
        stimulus = '<p class="text-center">' + header + trial.item.object + '_' + trial.stimulus + footer + '</p>',
        loop_function = function() {
          var data = jsPsych.data.getLastTrialData();
          console.log(data);
          return !data.correct;
        }
        data.is_true = trial.item.is_true;
      } else {
        prompt = '<p class="text-center">' + trial.person + params.strings[trial.polarity] + trial.item + '.</p>';
        stimulus = '<p class="text-center">' + header + trial.item + '_' + trial.stimulus + footer + '</p>';
        data.is_true = trial.is_true;
      }

      data.is_practice = is_practice;

      timeline.push({
        type: 'button-response',
        timeline: [{
          is_html: true,
          stimulus: stimulus,
          prompt: prompt,
          choices: ['True', 'False'],
          data: data,
          on_finish: function() {
            var data = jsPsych.data.getLastTrialData();
            if(data.button_pressed == 'True' && data.is_true || data.button_pressed == 'False' && !data.is_true) {
              jsPsych.data.addDataToLastTrial({correct: 1});
            } else {
              jsPsych.data.addDataToLastTrial({correct: 0});
              if(data.is_practice) {
                alert("Oops! Try again!");
              }
            }
          },
          timing_post_trial: 0
        }],
        loop_function: loop_function
      });

    });
  }

  this.createTimeline = function() {

    // Add preamble
    // NOTE: Comment out for faster testing.
    initPreamble();

    timeline.push({
      type: 'text',
      text: '<p class="lead"><strong>Practice Questions:</strong></p><p>First you will have a chance to practice. Remember, first you will see three pictures, which you should focus on for three seconds. Then you will see a picture and a sentence about that picture. You must decide as quickly as possible whether the sentence is true or false. Press Q for FALSE and P for TRUE.</p><p>Press the <strong>space bar</strong> to continue.</p>',
      cont_key: [' ']
    });

    // Build the practice sequence
    initTrials(true);

    timeline.push({
      type: 'text',
      text: '<p class="lead">This is the end of the practice questions.</p><p>Remember, during the game we will be recording how quickly you respond, so please respond as quickly and accurately as possible.</p><p>Please press the <strong>space bar</strong> to begin the matching game!',
      cont_key: [' ']
    });

    // Build the experiment trials
    initTrials(false);

  }

};
