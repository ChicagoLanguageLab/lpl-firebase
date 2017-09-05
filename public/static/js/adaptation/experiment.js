// experiment.js
// Defines the experiment object.

/** Construct an instance of the AdaptationExperiment class.
  * @constructor
  * @param {Object} params - The experiment parameters.
  */
function AdaptationExperiment(params) {

  /** The stimuli used in the experiment.
   * @type {Array<object>}
   */
  this.stimuli = jsPsych.randomization.shuffle(params.stimuli);

  /** The trials that make up the experiment.
   * @type {Array<object>}
   */
  this.timeline = [];

  /** The subject completing the experiment.
   * @type {object}
   * @property {string} id - The subject's Worker ID.
   * @property {string} code - The subject's completion code.
  */
  this.subject = {
    id: '',
    code: 'TURK' + jsPsych.randomization.randomID(10)
  };
  this.subject.id = params.workerId ? params.workerId : '';

  /** The condition assigned to the experiment.
   * @type {string}
   */
  this.condition = params.condition ? params.condition : 'ambiguous';

  /** The subcondition assigned to the experiment.
    * @type {string}
    */
  this.subcondition = params.subcondition ? params.subcondition : 'pos';

  /** The voice used in the experiment.
    * @type {string}
    */
  this.voice = params.voice ? params.voice : 'en';

  /** Static jsPsych trials.
    * @type {Array<object>}
    */
  this.prefabs = prefabs;

  /** Data for the exposure phase.
   * @type {Object}
   * @property {Array<String>} colors - The colors to be used during the exposure phase.
   * @property {Number} num_audio - The number of unique audio clips in the exposure phase.
   * @property {Number} reps - The number of times to repeat each audio clip in the exposure phase.
  */
  this.exposure = {
    colors: jsPsych.randomization.shuffle(params.exposure.colors),
    num_audio: params.exposure.num_audio,
    reps: params.exposure.reps
  }

  /** Data for the posttest trials.
   * @type {Object}
   * @property {Array<String>} colors - The colors to be used for posttest trials.
   * @property {Array<Number>} locations - The points in the exposure phase at which to insert posttest trials.
  */
  this.posttest = {
    colors: jsPsych.randomization.shuffle(params.posttest.colors),
    locations: params.posttest.locations
  }

  /** Data for the attention trials.
   * @type {Object}
   * @property {Array<String>} colors - The colors to be used for attention trials.
   * @property {Array<Number>} locations - The points in the exposure phase at which to insert attention trials.
  */
  this.attention = {
    colors: params.attention.colors,
    locations: params.attention.locations
  }

  /** Data for the calibration phase.
   * @type {Object}
   * @property {Array<String>} colors - The colors used during the calibration phase.
   * @property {Array<Number>} distribution - The number of times to repeat each scale point during calibration.
   * @property {Number} max_scalepos - The highest possible scale point.
  */
  this.calibration = {
    colors: this.exposure.colors.concat(this.posttest.colors),
    distribution: params.calibration.distribution,
    max_scalepos: params.calibration.max_scalepos
  }

  /**
   * Add experimental data to jsPsych's data object.
   * @function
   */
  this.addPropertiesTojsPsych = function () {
    jsPsych.data.addProperties({
      workerId: this.subject.id,
      code: this.subject.code,
      condition: this.condition,
      subcondition: this.subcondition,
      voice: this.voice
    });
  };

  /**
   * Generate all trials that cannot be pre-constructed.
   * @function
   */
  this.createTimeline = function() {

    // The flower blocks must always come last
    this.stimuli.push({
          name: 'flower',
          adjective: '',
          ambiguous_point: 4
    });

    // Some text depends on whether or not the voice is synthesized
    // Create a prefab with the appropriate text
    var exposure_variable_text;
    switch(this.voice) {
      case 'z':
        this.prefabs.audio_test_block = audio_test_prefabs.synth;
        exposure_variable_text = 'You will also listen to sentences recorded using a speech synthesizer we are testing. ';
        break;
      default:
        this.prefabs.audio_test_block = audio_test_prefabs.human;
        exposure_variable_text = 'You will also hear a verbal description of each image. ';
    }
    this.prefabs.exposure_instructions = {
        type: 'text',
        text: exposure_instructions.header + exposure_variable_text + exposure_instructions.footer,
        cont_key: [' ']
    }

    // Add the pre-experiment block to the timeline
    //this.timeline = this.timeline.concat(this.prefabs.pre_experiment_block);

    // Generate the three main phases of the experiment
    var calibration_blocks = this.makeCalibrationBlocks(false);
    var exposure_blocks = this.makeExposurePosttestBlocks();
    var post_calibration_blocks = this.makeCalibrationBlocks(true);

    // Create sets of [calibration, exposure, post_calibration] for each object
    // The resulting array is flattened so that it can be easily added to the timeline
    var experiment_blocks = _.flatten(
      _.zip(calibration_blocks, exposure_blocks, post_calibration_blocks)
    );

    // Concat the flattened experiment blocks
    this.timeline = this.timeline.concat(experiment_blocks);

    // Add on the final block
    this.timeline.push(this.prefabs.final_block);

    console.log(this.timeline);
  }

  /** Generate a set of calibration blocks.
    * @param {Boolean} is_post   - If this is a post-calibration block, true. Else false.
    * @returns {Array<Object>}
   */
  this.makeCalibrationBlocks = function(is_post) {
      var calibration_blocks = [];

      for(i = 0; i < this.stimuli.length; i++) {
          calibration_blocks.push(this.makeCalibrationBlock(is_post, i));
      }
      return calibration_blocks;
  }

  /** Generate a block of calibration trials.
   *
   * @param {Boolean} is_post   - If this is a post-calibration block, true. Else false.
   * @param {Number} stim_index - Index of the stimulus to use for this block.
   * @returns {Attay<Object>}
   */
  this.makeCalibrationBlock = function(is_post, stim_index) {
    var trials = [];
    var block_type = is_post? 'post-calibration' : 'calibration';

    for (var i = 1; i < this.calibration.max_scalepos + 1; i++) {
        var full_trials = this.makeCalibrationTrials(stim_index, i);
        trials = trials.concat(sampleTrials(full_trials, this.calibration.distribution[i - 1]));
    }
    trials = jsPsych.randomization.shuffle(trials);

    var calibration_block = {
      type: 'single-stim',
      choices: ['F', 'J'],
      timeline: trials,
      on_finish: function(data){
          var has_prop = 0;
          if(data.key_press == '70')
              has_prop = 1;
          jsPsych.data.addDataToLastTrial({has_prop: has_prop});
      }
    }

    var wrap_up = {
      type: 'text',
      cont_key: [' '],
      on_finish: function() {
        saveData(jsPsych.data.dataAsCSV(), dataRef);
      }
    };

    if(!is_post) {
      wrap_up.text = function() {
        var prev_stim = jsPsych.data.getLastTrialData().stimulus
        if(prev_stim !== 'flower') {
          var ambiguous_point = calculateAmbiguousPoint(prev_stim);
          addAmbiguousPointToData(prev_stim, ambiguous_point);
        }
        return `<p class="lead">You have finished this section.</p>
                <p>You can take a short break now if you want to.
                   Please press the <strong>space bar</strong> when you are ready to continue.
                </p>`;
      }
    }
    else {
      wrap_up.text = `<p class="lead">You have finished this section.</p>
                      <p>You can take a short break now if you want to.
                         Please press the <strong>space bar</strong> when you are ready to continue.
                      </p>`;
      if(stim_index == this.stimuli.length - 1) {
        wrap_up.on_finish =  function() {
          saveData(jsPsych.data.dataAsCSV(), dataRef);
          addWorker(workerId, 'adaptation-study');
        }
      }
    }

    return ({
      type: 'text',
      timing_post_trial: 1000,
      timeline: [
        this.prefabs.calibration_instructions,
        calibration_block,
        wrap_up
      ],
      data: {
        subtype: block_type
      }
    });
  }

  /** Generate a block of exposure-posttest trials.
   *
   * @param {Array<Object>} exposure_trials - An array of exposure trials.
   * @param {Array<Object>} attention_trials - An array of attention trials.
   * @param {Array<Object>} posttest_trials - An array of post-test trials.
   * @returns {Object}
   */
  this.makeExposurePosttestBlock = function(exposure_trials, attention_trials, posttest_trials) {
    var exposure_posttest_trials = this.interleaveTrials(exposure_trials, attention_trials, posttest_trials);

    return ({
      type: 'single-stim',
      timeline: [
        this.prefabs.exposure_instructions,
        this.prefabs.audio_test_block,
        exposure_posttest_trials,
        this.prefabs.end_block
      ],
      timing_post_trial: 1000
    });
  }

  /** Generate a block of exposure-posttest trials.
   *
   * @returns {Attay<Object>}
   */
  this.makeExposurePosttestBlocks = function() {

    var exposure_blocks  = this.makeExposureBlocks();
    var attention_blocks = this.makeAttentionBlocks(4);
    var posttest_blocks  = this.makePosttestBlocks();

    var eap_blocks = _.zip(exposure_blocks, attention_blocks, posttest_blocks);
    var exp_posttest_blocks = _.map(eap_blocks, function(block_set) {
      return this.makeExposurePosttestBlock(block_set[0], block_set[1], block_set[2]);
    }, this);

    return exp_posttest_blocks;
  }

  /**
   * Generates the full set of possible calibration trials for a given stimulus/scale position combination.
   *
   * @param {Number} stim_index - The index of the stimulus to use when generating trials.
   * @param {Number} scale_pos  - The scale position to use when generating trials.
   * @returns {Array<Object>}
   */
  this.makeCalibrationTrials = function(stim_index, scale_pos) {

    var trials = []

    var cur_stim = this.stimuli[stim_index];
    var key_instr = '<p class="text-center text-center">Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>';
    var int_text = this.subcondition === 'too'? ' too ' : ' ';

    var trial_data = {
      scalepos: scale_pos,
      stimulus: cur_stim.name
    }

    var prompt;
    if(cur_stim.name === 'flower')
      prompt = '<p class="text-center text-center">Does this flower have exactly four (4) petals?</p>' + key_instr;
    else
      prompt = '<p class="text-center text-center">Is this ' + cur_stim.name + int_text + cur_stim.adjective + '?</p>' + key_instr;

    for (var i = 0; i < this.calibration.colors.length; i++) {

      var stim_url = '../static/images/adaptation/' + this.calibration.colors[i] + cur_stim.name + scale_pos + '.jpg';

      trials.push({
        stimulus: stim_url,
        prompt: prompt,
        data: trial_data
      });
    }

    return trials;

  }

  /** Create the exposure phase by interleaving the expsure trials with the attention and post-test trials.
    *
    * @param {Array<Object>} exposure_trials - An array of exposure trials.
    * @param {Array<Object>} attention_trials - An array of attention trials.
    * @param {Array<Object>} posttest_trials - An array of post-test trials.
    * @returns {Object}
    */
  this.interleaveTrials = function(exposure_trials, attention_trials, posttest_trials) {
    var interleaved_trials = [];

    for(var i = 0; i < exposure_trials.length; i++) {
      interleaved_trials.push(exposure_trials.shift());

      if(_.contains(this.posttest.locations, i + 1)) {
          interleaved_trials.push(posttest_trials.shift());
      }
      if(_.contains(this.attention.locations, i + 1)) {
          interleaved_trials.push(attention_trials.shift());
      }
    }
    return ({timeline: interleaved_trials});
  }

  /** Create a single exposure trial.
    *
    * @param {Number} statement_index - The index of the corresponding audio statement.
    * @param {Number} trial_index - The index of this trial.
    * @param {Number} stimulus - The stimulus used in this trial.
    * @returns {Object}
    */
  this.makeExposureTrial = function(statement_index, trial_index, stimulus) {

    var color_index = statement_index;

    var statement;
    var timing;

    if(statement_index == 0 && trial_index == 0) {
        statement = 5;
        timing = 7500;
    } else {
       statement = statement_index + 1;
       timing = 4500;
    }

    var trial = {
      type: 'single-stim',
      response_ends_trial: false,
      timing_response: timing,
      choices: [],
      data: {
        subtype: 'exposure',
        stim_object: stimulus.name,
        color: this.exposure.colors[color_index],
        condition: this.condition,
        subcondition: this.subcondition
      }
    }

    var stim_function = function() {
      var trial_data  = jsPsych.currentTrial().data;
      trial_data.scalepos = calculateExposureScalepos(trial_data.condition, trial_data.subcondition, trial_data.stim_object);
      return '../static/images/adaptation/' + trial_data.color + trial_data.stim_object + trial_data.scalepos + '.jpg';
    };

    if(stimulus.name !== 'flower') {

      trial.stimulus = stim_function;
      trial.prompt = audio_header + stimulus.name + '_' + this.subcondition + statement + this.voice + audio_footer;

    } else {

      trial.stimulus = '../static/images/adaptation/flower4' + this.exposure.colors[color_index] + '.jpg';
      trial.prompt = audio_header + 'flower' + statement + this.voice + audio_footer;
      trial.data.scalepos = 4;

    }

    return trial;
  }

  /** Create a block of exposure trials.
    *
    * @param {Object} stimulus - The stimulus used in this block.
    * @returns {Array<Object>}
   */
  this.makeExposureBlock = function(stimulus) {
    var trials = [];
    for(var x = 0; x < this.exposure.num_audio; x++) {
      for(var y = 0; y < this.exposure.reps; y++) {
        trials.push(this.makeExposureTrial(x, y, stimulus));
      }
    }
    return trials;
  }

  /** Create a set of exposure blocks.
    *
    * @returns {Array<Array>}
   */
  this.makeExposureBlocks = function() {
      var blocks = [];
      _.each(this.stimuli, function(stimulus) {
        blocks.push(this.makeExposureBlock(stimulus));
      }, this);
      return blocks;
  }

  /**
    * Create a single attention trial.
    * @param {String} attn_color - The color of the stimulus.
    * @returns {Object}
  */
  this.makeAttentionTrial = function(attn_color) {
    var trial = {
      type: 'single-stim',
      choices: ['R', 'B'],
      is_html: true
    };

    var presentation_slide = {
      stimulus: '<p class="text-center center-screen"><span style="font-size: 24pt; color:' + attn_color + ';"><b>+</b></span></p>',
      response_ends_trial: false,
      timing_response: 500,
      data: {
        subtype: 'attention-stimulus'
      }
    };

    var response_slide = {
      stimulus: '<p></p>',
      prompt: '<p class="text-center center-screen">What was the color of the "+" you just saw?<br/>Press <b>R</b> for <b>red</b> and <b>B</b> for <b>blue</b>.</p>',
      data: {
        'color': attn_color,
        subtype: 'attention-response'
      },
      on_finish: function() {
        var data = jsPsych.data.getLastTrialData();
        var key = data.key_press;
        var respCorrect;
        if((key == '82' && data.color == 'red') || (key == '66' && data.color == 'blue')) {
            respCorrect = 1
        }
        else {
            respCorrect = 0
        }
        jsPsych.data.addDataToLastTrial({correct: respCorrect});
      }
    };

    trial.timeline = [presentation_slide, response_slide];
    return trial;
  }

  /**
    * Create a block of attention trials.
    * @returns {Array<Object>}
  */
  this.makeAttentionBlock = function() {
    var trials = []
    var num_trials = this.attention.locations.length;

    var colors = jsPsych.randomization.sample(this.attention.colors, num_trials, true);
    for(var i = 0; i < num_trials; i++) {
      trials.push(this.makeAttentionTrial(colors[i]));
    }
    return trials;
  }

  /**
    * Create a set of attention blocks.
    * @returns {Array<Array>}
  */
  this.makeAttentionBlocks = function() {
    var blocks = []
    for(var i = 0; i < this.stimuli.length; i++) {
      blocks.push(this.makeAttentionBlock());
    }
    return blocks;
  }

  /**
    * Create a regular post-test trial.
    * @param {Number} stim_index - The index of the stimulus used in this trial.
    * @param {Number} scale_adjustment - The amount by which to adjust the scale position of the stimulus.
    * @param {String} color - The color used for the stimulus.
    * @returns {Object}
  */
  this.makePosttestObjectTrial = function(stim_index, scale_adjustment, color) {
    var trial = {}
    var stimulus = this.stimuli[stim_index];

    var audio_header = '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/';
    var audio_footer = '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>';
    var subcondition = this.subcondition === 'too'? 'too' : '';

    var stim_function = function() {
      var prev_trial_data = jsPsych.data.getLastTrialData();
      var trial_data = jsPsych.currentTrial().data;
      var corrected_ambiguous_point = adjustAmbiguousPoint(prev_trial_data[trial_data.stim_obj + 'CorrectedAmbiguousPoint'], trial_data.adjustment);

      trial_data.scalepos = corrected_ambiguous_point;
      console.log(trial_data);

      return '../static/images/adaptation/' + trial_data.color + trial_data.stim_obj + corrected_ambiguous_point + '.jpg';
    };

    var presentation_trial = {
      stimulus: stim_function,
      data: {
        subtype: 'posttest-stimulus',
        adjustment: scale_adjustment,
        stim_obj: stimulus.name,
        'color': color
      },
      prompt: audio_header + stimulus.name + '_question' + subcondition + this.voice + audio_footer,
      timing_post_trial: 0,
      response_ends_trial: false,
      timing_response: 3000,
      choices: []
    }

    var response_trial = {
      stimulus: stim_function,
      prompt: '<br/><p class="text-center">Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
      response_ends_trial: true,
      choices: ['F', 'J'],
      data: {
        subtype: 'posttest-response',
        adjustment: scale_adjustment,
        stim_obj: stimulus.name,
        'color': color
      },
      on_finish: function(data) {
          var has_prop = 0;
          if(data.key_press == '70')
              has_prop = 1;
          jsPsych.data.addDataToLastTrial({has_prop: has_prop});
      }
    }

    trial.type = 'single-stim';
    trial.timeline = [ presentation_trial, response_trial ];

    return trial;
  }

  /**
    * Create a post-test flower trial.
    * @param {Array<String>} colors - The colors to sample from.
    * @returns {Object}
  */
  this.makePosttestFlowerTrial = function(colors) {

    // Get a random number of petals and random color
    var num_petals = jsPsych.randomization.sample([1,2,3,4,5], 1, false);
    var color = jsPsych.randomization.sample(colors, 1, false);

    var presentation_trial = {
      stimulus: '../static/images/adaptation/' + color + 'flower' + num_petals + '.jpg',
      prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/flowerquestion' + this.voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>',
      data: {
        scalepos: (num_petals + 1),
        stim_obj: 'flower',
        subtype: 'posttest-stimulus'
      },
      timing_post_trial: 0,
      response_ends_trial: false,
      timing_response: 3000
    };

    var response_trial = {
      stimulus: '../static/images/adaptation/' + color + 'flower' + num_petals + '.jpg',
      prompt: '<br/><p class="text-center">Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
      data: {
          scalepos: (num_petals + 1),
          stim_obj: 'flower',
          subtype: 'posttest-response'
      },
      choices: ['F', 'J'],
      on_finish: function(data) {
          var has_prop = 0;
          if(data.key_press == '70')
              has_prop = 1;
          jsPsych.data.addDataToLastTrial({has_prop: has_prop});
      }
    };

    var trial = {};
    trial.type = 'single-stim';
    trial.timeline = [presentation_trial, response_trial];

    return trial;
  }

  /**
    * Create a block of post-test trials.
    * @param {Number} stim_index - The index of the stimulus to use.
    * @returns {Array<Object>}
  */
  this.makePosttestBlock = function(stim_index) {
    var trials = [];
    for(var z = 0; z < this.posttest.locations.length; z++) {

        var ptest_timeline = [];
        var reshuffled_colors = jsPsych.randomization.shuffle(this.posttest.colors);

        // If we're not doing flowers, each segment contains three trials
        if(this.stimuli[stim_index] !== 'flower') {
            for(var y = -1; y < 2; y++) {
              ptest_timeline.push(this.makePosttestObjectTrial(stim_index, y, reshuffled_colors[y + 1]));
            }
        }
        else { // For flowers, just do one random posttest
          ptest_timeline.push(this.makePosttestFlowerTrial(reshuffled_colors));
        }

        // Now we push the trials to a segment
        trials.push({
            type: "single-stim",
            timeline: ptest_timeline
        });
    }
    return trials;
  }

  /**
    * Create a set of post-test blocks.
    * @returns {Array<Array>}
  */
  this.makePosttestBlocks = function() {
    var blocks = [];
    for(var x = 0; x < this.stimuli.length; x++) {
        blocks.push(this.makePosttestBlock(x));
    }
    return blocks;
  }
}

/** Sample trials from a set of trials.
 *
 * @param {Array<object>} trials - An array of trials to cample from.
 * @param {Number} sample_size - The number of trials to sample.
 * @returns {Array<object>}
 */
function sampleTrials(trials, sample_size) {
  return jsPsych.randomization.sample(trials, sample_size, true);
}

/** Calculate the most ambiguous scale point for a given stimulus.
 *
 * @param {String} stimulus - Name of the stimulus to check.
 * @returns {Number}
 */
 function calculateAmbiguousPoint(stimulus) {
  lr = new LogReg(5, 1);
  lr.init([1,2,3,4,5]);

  var trials = jsPsych.data.getLastTimelineData();

  _.each(trials, function(trial) {
    try {
      lr.addObs(trial.scalepos - 1, trial.has_prop);
    }
    catch (e) {
      xint = 3;
      return;
    }
  });

  lr.fit();

  var xint = this.lr.xint();
  if(xint == null || isNaN(xint)) {
    xint = 3;
  }

  var best = 10000;
  var ambiguous_point = -1;
  for (var j=0; j<6; j++) {
    var dif = Math.abs(xint-j);
    if (dif < best) {
        best = dif;
        ambiguous_point = j;
    }
  }

  return ambiguous_point;
}

/** Adjust the ambiguous point as needed.
 *
 * @param {number} ambiguous_point - The original ambiguous point.
 */
function tweakAmbiguousPoint(ambiguous_point) {
  if(ambiguous_point <= 1)
    return 2;
  if(ambiguous_point >= 5)
    return 4;
  return ambiguous_point;
}

/** Add the subject's ambiguous point and tweaked ambiguous point to jsPsych's data.
 *
 * @param {String} stim_name - The name of the stimulus.
 * @param {Number} ambiguous_point - The base ambiguous point for this stimulus.
 */
function addAmbiguousPointToData(stim_name, ambiguous_point) {
  var ambig_prop = {};
  var tweaked_ambiguous_point = tweakAmbiguousPoint(ambiguous_point);

  ambig_prop[stim_name + 'CorrectedAmbiguousPoint'] = tweaked_ambiguous_point;
  ambig_prop[stim_name + 'OriginalAmbiguousPoint'] = ambiguous_point;

  jsPsych.data.addProperties(ambig_prop);
}

/**
  * Calculate the scale position to use in an exposure trial.
  * @param {String} condition - The experimental condition.
  * @param {String} subcondition - The experimental subcondition.
  * @param {String} stimulus - The name of the stimulus.
  * @returns {Array<Object>}
*/
function calculateExposureScalepos(condition, subcondition, stimulus) {
  if(condition === 'ambiguous') {
    return jsPsych.data.getLastTrialData()[stimulus + 'CorrectedAmbiguousPoint'];
  }

  if(condition === 'prototypical' && subcondition == 'neg') {
    return 1;
  }

  return 5;
}

/**
  * Adjust the ambiguous point a given amount.
  * @param {Number} ambiguous_point - The ambiguous point.
  * @param {Number} scale_adjustment - The amount to adjust the ambiguous point by.
  * @returns {Array<Object>}
*/
function adjustAmbiguousPoint(ambiguous_point, scale_adjustment) {
  if(ambiguous_point + scale_adjustment > 1 && ambiguous_point + scale_adjustment < 5)
    return ambiguous_point + scale_adjustment;
  else if(ambiguous_point + scale_adjustment <= 1)
    return 2;

  return 4;
}
