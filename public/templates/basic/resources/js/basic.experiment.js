/** Construct an instance of the BasicExperiment class.
  * @constructor
  * @param {Object} params - The experiment parameters from URL data and/or your data.json file.
  */
function BasicExperiment(params) {

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
    var sampleTextTrial = {
      "type": "text",
      "is_html": true,
      "text": "<p>Hello world! This is a sample text trial. Press SPACE to continue.</p>",
      "cont_key": [' ']
    }
    timeline.push(sampleTextTrial);

    var sampleSingleStimTrial = {
      "type": "single-stim",
      "is_html": true,
      "stimulus": "<p>Hello world! This is a sample single-stim trial.</p>",
      "prompt": "<p>Press SPACE to continue, if you're fast enough.</p>",
      "response_ends_trial": true,
      "timing_response": 3000,
      "choices": [' '],
      // NOTE: Add this function to your last trial before the code screen and uncomment its contents.
      on_finish: function() {
        //saveData(jsPsych.data.dataAsCSV(), dataRef);

        // NOTE: Change this string to the same string you used in main.js
        //addWorker(params.workerId, "SAMPLE");
      }
    }
    timeline.push(sampleSingleStimTrial);

    // Return a code for the HIT
    // NOTE: No need to change this unless you want to remove it or add a prefix to the code.
    timeline.push({
      type: 'text',
      cont_key: [''],
      text: function(){
          var code = 'TURK' + jsPsych.randomization.randomID(10);

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
