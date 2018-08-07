/** Construct an instance of the Experiment class.
  * @constructor
  * @param {Object} params - The experiment parameters from URL data and/or your data.json file.
  */
function Experiment(params) {

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
      var data = jsPsych.data.getLastTrialData().values()[0];
      return !data.consented;
    }

    // Check that the participant entered a valid age.
    preamble.demographics_check.conditional_function = function() {
      var data = jsPsych.data.getLastTrialData().values()[0];
      if(parseInt(data.age) < 18) return true;
      return false;
    }

    timeline = timeline.concat([preamble.intro, preamble.consent, preamble.consent_check, preamble.demographics, preamble.demographics_check, preamble.post_demographics]);
  }

  /** This function handles setting up the experimental trials.
    * Here, it just pushes two sample trials onto the timeline.
    * In a more complex experiment, you might use it to call various helper functions.
  */
  var initTrials = function() {

    _.each(jsPsych.randomization.shuffle(params.blocks), function(block) {
      _.each(jsPsych.randomization.shuffle(block.trials), function(trial) {
        console.log(trial);

        var trial_timeline = [];

        trial_timeline.push({
          "type": "html-keyboard-response",
          "prompt": '<p class="text-center"><i>Press the spacebar to hear the sentence.</i></p>',
          "stimulus": '<p class="text-center"><i>Get ready...</i></p><br><p class="text-center very-large">' + trial.sentence + '</p><br><br>'
        });

        trial_timeline.push({
          "type": "audio-keyboard-button-response",
          "prompt": '<p class="text-center" style="color: #f3f3f3">Get ready...</p><br><p class="text-center very-large">' + trial.sentence + '</p><br><br><p class="text-center">In the sentence you just heard, was the word <b>' + trial.word + '</b>...</p><br>',
          "stimulus": trial.audio,
          "keys": ['1','2','3','4','5','6','7'],
          "min_height": "50px",
          "min_width": "100px",
          "buttons": ['1<br>(very de-emphasized)','2','3','4','5','6','7<br>(very emphasized)'],
          "button_data": ['1','2','3','4','5','6','7']
        });

        timeline.push({
          "type": "html-keyboard-response",
          "timeline": trial_timeline
        });
      });

      timeline.push({
        "type": "image-keyboard-button-response",
        "prompt": '<br><br><p class="text-center large">What color is this dot?</p><p class="text-center">Use the buttons below or your keyboard to respond.</p><br>',
        "stimulus": 'resources/images/green.png',
        "keys": ['r','o','y','g','b','i','v'],
        "min_height": "50px",
        "min_width": "100px",
        "buttons": ['red (R)','orange (O)','yellow (Y)','green (G)','blue (B)','indigo (I)','violet (V)'],
        "button_data": ['red','orange','yellow','green','blue','indigo','violet']
      });
    });
  }

  /** Build the experiment.
  */
  this.createTimeline = function() {
    //initPreamble();
    initTrials();
  }
};
