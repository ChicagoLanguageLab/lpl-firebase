/** Construct an instance of the BasicExperiment class.
  * @constructor
  * @param {Object} params - The experiment parameters from URL data and/or your data.json file.
  */
function VmRecallExperiment(params) {

  /** Hold the trials, instructions, etc. that make up the experiment.
   * @type {Array<object>}
   */
  var timeline = [];

  /** The current subject.
   * @type {object}
   * @param {string} id - The subject's Worker ID or SONA subject number.
  */
  var subject = { //NOTE: Add more subject parameters here if needed.
    id: params.workerId
  }

  /** Return the subject's ID.
   * @returns {string} - The subject's Worker ID or SONA subject number.
  */
  this.getSubjectId = function() {
    return subject.id;
  }

  /** Return the experiment timeline.
   * @returns {array} - The experiment timeline.
  */
  this.getTimeline = function() {
    return timeline;
  }

  /** Add data to jsPsych's internal representation of the experiment. Can be called at any time.
  */
  this.addPropertiesTojsPsych = function () {
    jsPsych.data.addProperties({
      workerId: subject.id
    });
  }

  /** Initialize and append the default preamble to the timeline. This includes a generic intro page, consent form, and demographic questionnaire. Values for some of these are altered via the JSON file.
  */
  var initPreamble = function() {
    var preamble = params.preamble;

    preamble.consent_check.conditional_function = function() {
      var data = jsPsych.data.getLastTrialData();
      return !data.consented;
    }

    timeline = timeline.concat([preamble.intro, preamble.consent, preamble.consent_check, preamble.demographics, preamble.post_demographics]);
  }

  var initTrials = function() {
    var urlParams = jsPsych.data.urlVariables();

    var temp = _.chain(urlParams)
  		.omit(['workerId'])
  		.map(function(value, key, list) {
  			var i = key.replace('q', '');

        trials = []

        var data = value.split('_');
        var trial = params.trials[data[0]][data[1]];
        var timing = parseInt(data[2]) * 100;

        trials.push({
          type: "button-response",
          is_html: true,
          stimulus: '<p class="large text-center">' + trial.subject + "</p>",
          choices: ['>'],
          data: {
            trial_number: i,
            item_number: data[0],
            condition: data[1],
            pause_length: timing,
            stimulus: trial.subject
          },
          timing_post_trial: 0
        });

        trials.push({
          type: "button-response",
          is_html: true,
          stimulus: '<p class="large text-center">' + trial.verb + "</p>",
          choices: ['>'],
          data: {
            trial_number: i,
            item_number: data[0],
            condition: data[1],
            pause_length: timing,
            stimulus: trial.verb
          },
          timing_post_trial: 0
        });

        trials.push({
          type: "button-response",
          is_html: true,
          stimulus: '<p class="large text-center">' + trial.object + "</p>",
          choices: ['>'],
          data: {
            trial_number: i,
            item_number: data[0],
            condition: data[1],
            pause_length: timing,
            stimulus: trial.object
          },
          timing_post_trial: timing
        });

        trials.push({
          type: "vm-recall",
          data: {
            trial_number: i,
            item_number: data[0],
            condition: data[1],
            pause_length: timing
          },
          on_finish: function() {
            var data = jsPsych.data.getLastTrialData();
            if(data.trial_number == 32 || data.trial_number % 8 == 0) {
              saveData(jsPsych.data.dataAsCSV(), dataRef);
              if(data.trial_number == 32) {
                addWorker(subject.id, 'vm-recall');
              }
            }
          }
        });

        return ({
          type: "button-response",
          timeline: trials
        });
      }).value();

    timeline = timeline.concat(temp);

    // Return a code for the HIT
    // NOTE: No need to change this unless you want to remove it or add a prefix to the code.
    timeline.push({
      type: 'text',
      cont_key: [''],
      text: function(){
          var code = 'RE' + jsPsych.randomization.randomID(10);

          jsPsych.data.addProperties({
            code: code
          });

          return '<p class="lead">You have finished the experiment! Your responses have been saved.</p>' +
                  '<p>Your survey code is <b>' + code + '</b>. Please enter this code into your HIT. ' +
                  `You may then close this window.</p><p>If you have any questions or concerns,
                    please do not hesitate to contact the lab at
                    <a href='mailto:uchicagolanglab@gmail.com'>uchicagolanglab@gmail.com</a>.
                  </p>`;
      }
    });
  }

  /** Build the experiment.
  */
  this.createTimeline = function() {
    initPreamble();
    initTrials();
  }
};
