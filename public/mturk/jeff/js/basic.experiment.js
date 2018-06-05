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

  /** Initialize and append the default preamble to the timeline.
    * This includes a generic intro page, consent form, and demographic questionnaire.
    * Values for some of these are altered via the JSON file.
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
      if(parseInt(data.age) < 18) return false;
      return true;
    }

    // Add the preamble to the timeline
    timeline = timeline.concat([preamble.intro, preamble.consent, preamble.consent_check, preamble.demographics, preamble.demographics_check, preamble.post_demographics]);
  }

  /** This function handles setting up the experimental trials.
    * Here, it just pushes two sample trials onto the timeline.
    * In a more complex experiment, you might use it to call various helper functions.
  */
  var initTrials = function() {

    // A trial consisting only of text.
    // To use HTML, the "is_html" flag must be set.
    // "cont_key" defines the keys to be used to progress to the next trial.
    var sampleTextTrial = {
      "type": "text",
      "is_html": true,
      "text": "<p>Hello world! This is a sample text trial. Press SPACE to continue.</p>",
      "cont_key": [' ']
    }
    timeline.push(sampleTextTrial);

    /* A trial consisting of a stimulus and optional prompt.
     * To use HTML/text/etc., the "is_html" flag must be set.
     * Without it, this trial type will expect an image.
     * "choices" defines the keys to be used for responding.
     * "timing_response" is the number of miliseconds to display the trial.
     * "response_ends_trial" signals that a key press can end the trial regardless of "timing_response".
    */
    var sampleSingleStimTrial = {
      "type": "single-stim",
      "is_html": true,
      "stimulus": "<p>Hello world! This is a sample single-stim trial.</p>",
      "prompt": "<p>Press SPACE to continue, if you're fast enough.</p>",
      "response_ends_trial": true,
      "timing_response": 3000,
      "choices": [' '],
      // NOTE: Add this function to your last trial and uncomment its contents.
      // This saves the experimental data and logs the worker so that they cannot do the same experiment twice.
      on_finish: function() {
        //saveData(jsPsych.data.dataAsCSV(), dataRef);

        // NOTE: Change this string to the same string you used in main.js
        //addWorker(params.workerId, "SAMPLE");
      }
    }
    timeline.push(sampleSingleStimTrial);
  }

  /** Build the experiment.
  */
  this.createTimeline = function() {
    initPreamble();
    initTrials();
  }
};
