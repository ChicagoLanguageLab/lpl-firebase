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

    timeline = timeline.concat([preamble.intro, preamble.consent, preamble.consent_check, preamble.demographics, preamble.demographics_check, preamble.instructions, preamble.practice_start]);
  }

  /** This function handles setting up the experimental trials.
    * Here, it just pushes two sample trials onto the timeline.
    * In a more complex experiment, you might use it to call various helper functions.
  */
  var initTrials = function(is_practice) {

    var blocks = is_practice ? params.practice_blocks : params.blocks;

    _.each(jsPsych.randomization.shuffle(blocks), function(block) {
      _.each(jsPsych.randomization.shuffle(block.trials), function(trial) {

        var trial_timeline = [];

        trial_timeline.push({
          "type": "html-keyboard-response",
          "prompt": '<p class="text-center">Press the spacebar to hear the sentence.</p>',
          "stimulus": '<p class="text-center"><i>Get ready...</i></p><br><br>'
        });

        trial_timeline.push({
          "type": "audio-keyboard-button-response",
          "prompt": '<p class="text-center"><i>Listen...</i></p><br><br><p class="text-center">On a scale from 1 to 7, where 1 is the least natural and 7 is the most natural, please rate the sentence you just heard.</p><br>',
          "stimulus": trial.audio,
          "keys": ['1','2','3','4','5','6','7'],
          "min_height": "50px",
          "min_width": "100px",
          "buttons": ['1<br>(very unnatural)','2','3','4','5','6','7<br>(very natural)'],
          "button_data": ['1','2','3','4','5','6','7']
        });

        timeline.push({
          "type": "html-keyboard-response",
          "timeline": trial_timeline
        });
      });
    });
  }

  /** Build the experiment.
  */
  this.createTimeline = function() {
    initPreamble();
    initTrials(true);

    timeline.push({
      "type": "instructions",
      "button_label_next": "Begin survey",
      "show_clickable_nav": true,
      "allow_backward": false,
      "pages": ["<p>You have finished the practice section. What follows is the real survey. We will periodically ask various questions to make sure you are paying attention. When you are ready to begin, please <strong>click the button below</strong>.</p>"]
    });

    initTrials(false);
  }
  };
