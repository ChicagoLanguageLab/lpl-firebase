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
      var data = {};

      if(is_practice) {
        context.push(header + trial.item.object + '_contextL'  + footer);
        data.context1 = trial.item.object + '_contextL'
        context.push(header + trial.item.object + '_contextR'  + footer);
        data.context2 = trial.item.object + '_contextR'
        context.push(header + trial.item.object + '_contextC'  + footer);
        data.context3 = trial.item.object + '_contextC'
      } else {
        var j = 1;
        for(var x = 0; x < trial.context; x++) {
          context.push(header + trial.item + '_context' + (x + 1) + '_item' + footer);
          data[context + j] = trial.item + '_context' + (x + 1) + '_item';
          j++;
        }
        for(var x = 0; x < 3 - trial.context; x++) {
         context.push(header + trial.item + '_context' + (x + 1)  + '_nothing' + footer);
         data[context + j] = trial.item + '_context' + (x + 1) + '_item';
         j++;
        }
        context = jsPsych.randomization.shuffle(context);
      }

      data.stimulus = "";

      timeline.push({
        type: 'html-keyboard-response',
        is_html: true,
        stimulus: '<p class="text-center">' + _.reduce(context, function(memo, str){ return memo + ' ' + str; }, '') + '</p>',
        timeline: [
          {prompt: '<p class="text-center large"><strong>Look at these ' + trial.people + '!</strong></p><p class="text-center"><i>Please wait .</i></p>', post_trial_gap: 0},
          {prompt: '<p class="text-center large"><strong>Look at these ' + trial.people + '!</strong></p><p class="text-center"><i>Please wait . .</i></p>', post_trial_gap: 0},
          {prompt: '<p class="text-center large"><strong>Look at these ' + trial.people + '!</strong></p><p class="text-center"><i>Please wait . . .</i></p>', post_trial_gap: 0}
        ],
        trial_duration: 1000,
        data: data,
        response_ends_trial: false,
        choices: [],
      });

      var prompt;
      var stimulus;
      var loop_function = undefined;
      data = {};

      if(is_practice) {

        prompt = '<p class="text-center large"><strong>' + trial.person + params.strings.positive + 'a ' + trial.item.adjective + trial.item.object + '.</p>';
        stimulus = '<p class="text-center">' + header + trial.item.object + '_' + trial.stimulus + footer + '</p>',

        data.target_item = trial.item.object;
        data.target_adjective = trial.item.adjective;
        data.target_condition = trial.stimulus;
        data.stimulus = trial.item.object + '_' + trial.stimulus;

        loop_function = function() {
          var data = jsPsych.data.getLastTrialData().values()[0];
          return !data.correct;
        }
        data.is_true = trial.item.is_true;

      } else {
        prompt = '<p class="text-center">' + trial.person + params.strings[trial.polarity] + trial.item + '.</p>';
        stimulus = '<p class="text-center">' + header + trial.item + '_' + trial.stimulus + footer + '</p>';

        data.target_item = trial.item.object;
        data.target_condition = trial.stimulus;
        data.stimulus = trial.item + '_' + trial.stimulus;
        data.is_true = trial.is_true;
        data.ratio = 'ratio' + trial.ratio;
      }

      data.is_practice = is_practice;
      data.trial_num = i + 1;

      timeline.push({
        type: 'html-button-response',
        timeline: [{
          stimulus: stimulus + prompt,
          choices: ['True', 'False'],
          data: data,
          on_finish: function() {
            var data = jsPsych.data.getLastTrialData().values()[0];
            if(data.button_pressed === "0" && data.is_true || data.button_pressed === "1" && !data.is_true) {
              jsPsych.data.addDataToLastTrial({correct: 1});
            } else {
              jsPsych.data.addDataToLastTrial({correct: 0});
              if(data.is_practice) {
                alert("Oops! Try again!");
              }
            }
            console.log(data.trial_num);
            if(data.trial_num % 8 == 0 || data.trial_num == 32) {
              saveData(jsPsych.data.get().csv(), dataRef);
            }
          },
          post_trial_gap: 0
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
      type: 'instructions',
      pages: ['<p class="lead"><strong>Practice Questions:</strong></p><p>First you will have a chance to practice. Remember, first you will see three pictures, which you should focus on for three seconds. Then you will see a picture and a sentence about that picture. You must decide as quickly as possible whether the sentence is true or false.</p><p>Please <strong>click the button below</strong> to continue.</p>'],
      key_forward: " ",
      "button_label_next": "Begin practice",
      "show_clickable_nav": true,
      "allow_backward": false
    });

    // Build the practice sequence
    initTrials(true);

    timeline.push({
      type: 'instructions',
      pages: ['<p class="lead">This is the end of the practice questions.</p><p>Remember, during the game we will be recording how quickly you respond, so please respond as quickly and accurately as possible.</p><p>Please <strong>click the button below</strong> to begin the matching game!'],
      key_forward: " ",
      "button_label_next": "Begin experiment",
      "show_clickable_nav": true,
      "allow_backward": false
    });

    // Build the experiment trials
    initTrials(false);

  }

};
