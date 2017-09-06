/** adaptation.experiment.js
 * @fileoverview Constructor for the AdaptationExperiment class.
 */

/** Construct an instance of the AdaptationExperiment class.
  * @constructor
  * @param {Object} params - The experiment parameters.
  */
function AdaptationExperiment(params, prefabs) {

  /** The stimuli used in the experiment. The flower trials always come last.
   * @type {Array<object>}
   */
  var stimuli = jsPsych.randomization.shuffle(params.stimuli);
  stimuli.push({
        name: 'flower',
        adjective: '',
        ambiguous_point: 4
  });

  /** The trials that make up the experiment.
   * @type {Array<object>}
   */
  var timeline = []

  /** The trials that occur before the main experiment.
   * @type {Array<object>}
   */
  var pre_experiment = prefabs.pre_experiment_block;

  /** The trials that occur after the main experiment.
   * @type {Array<object>}
   */
  var post_experiment = prefabs.final_block;

  /** The subject completing the experiment.
   * @type {object}
   * @property {string} id - The subject's Worker ID.
   * @property {string} code - The subject's completion code.
  */
  var subject = {
    id: '',
    code: 'TURK' + jsPsych.randomization.randomID(10)
  };
  subject.id = params.workerId ? params.workerId : '';

  /** The subject completing the experiment.
   * @type {object}
   * @property {string} condition - The experimental condition.
   * @property {string} subcondition - The experimental subcondition.
   * @property {string} voice - The experimental voice.
  */
  var data = {
    condition: params.condition,
    subcondition: params.subcondition,
    voice: params.voice
  };

  // Some text in the exposure section depends on whether or not the voice is synthesized
  var exp_instr_body;
  var exp_aud_test;
  if(data.voice === 'z') {
    exp_aud_test = prefabs.audio_test.synth;
    exp_instr_body = params.exposure.instructions.synth;
  } else {
    exp_aud_test = prefabs.audio_test.human;
    exp_instr_body = params.exposure.instructions.human;
  }

  /** Data for the exposure phase.
   * @type {Object}
   * @property {Object} instructions - The number of unique audio clips in the exposure phase.
   * @property {Object} audio_test - The audio test trial to display.
   * @property {Object} end_block - The end block to display.
   * @property {Array<String>} colors - The colors to be used during the exposure phase.
   * @property {Number} num_audio - The number of unique audio clips in the exposure phase.
   * @property {Number} reps - The number of times to repeat each audio clip in the exposure phase.
  */
  var exposure = {
    instructions: {
        type: 'text',
        text: params.exposure.instructions.header + exp_instr_body + params.exposure.instructions.footer,
        cont_key: [' ']
    },
    audio_test: exp_aud_test,
    audio: {
      header: prefabs.audio_header,
      footer: prefabs.audio_footer
    },
    end_block: prefabs.end_block,
    colors: jsPsych.randomization.shuffle(params.exposure.colors),
    num_audio: params.exposure.num_audio,
    reps: params.exposure.reps
  }

  /** Data for the posttest trials.
   * @type {Object}
   * @property {Array<String>} colors - The colors to be used for posttest trials.
   * @property {Array<Number>} locations - The points in the exposure phase at which to insert posttest trials.
  */
  var posttest = {
    colors: jsPsych.randomization.shuffle(params.posttest.colors),
    locations: params.posttest.locations
  }

  /** Data for the attention trials.
   * @type {Object}
   * @property {Array<String>} colors - The colors to be used for attention trials.
   * @property {Array<Number>} locations - The points in the exposure phase at which to insert attention trials.
  */
  var attention = {
    colors: params.attention.colors,
    locations: params.attention.locations
  }

  /** Data for the calibration phase.
   * @private
   * @type {Object}
   * @property {Array<String>} colors - The colors used during the calibration phase.
   * @property {Array<Number>} distribution - The number of times to repeat each scale point during calibration.
   * @property {Number} max_scalepos - The highest possible scale point.
  */
  var calibration = {
    instructions: prefabs.calibration_instructions,
    colors: exposure.colors.concat(posttest.colors),
    distribution: params.calibration.distribution,
    max_scalepos: params.calibration.max_scalepos
  }

  /** Return the subject's ID.
   * @returns {String}
   */
  this.getSubjectId = function() {
    return subject.id;
  }

  /** Return the experimental condition.
   * @returns {String}
   */
  this.getCondition = function() {
    return data.condition;
  }

  /** Return the experimental subcondition.
   * @returns {String}
   */
  this.getSubcondition = function() {
    return data.subcondition;
  }

  /** Return the experimental voice..
   * @returns {String}
   */
  this.getVoice = function() {
    return data.voice;
  }

  /** Return the timeline.
   * @returns {String}
   */
  this.getTimeline = function() {
    return timeline;
  }

  /** Add experimental data to jsPsych's data object.
   * @function
   */
  this.addPropertiesTojsPsych = function () {
    jsPsych.data.addProperties({
      workerId: subject.id,
      code: subject.code,
      condition: data.condition,
      subcondition: data.subcondition,
      voice: data.voice
    });
  };

  /** Generate all trials that cannot be pre-constructed.
   * @function
   */
  this.createTimeline = function() {

    timeline = timeline.concat(pre_experiment);

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
    timeline = timeline.concat(experiment_blocks);

    // Add on the final block
    timeline.push(post_experiment);
  }

  /** Generate a set of calibration blocks.
    * @param {Boolean} is_post   - If this is a post-calibration block, true. Else false.
    * @returns {Array<Object>}
   */
  this.makeCalibrationBlocks = function(is_post) {
      var calibration_blocks = [];

      _.each(stimuli, function(stimulus) {
        calibration_blocks.push(this.makeCalibrationBlock(is_post, stimulus));
      }, this);

      return calibration_blocks;
  }

  /** Generate a block of calibration trials.
   *
   * @param {Boolean} is_post   - If this is a post-calibration block, true. Else false.
   * @param {Object} stimulus - Index stimulus to use for this block.
   * @returns {Attay<Object>}
   */
  this.makeCalibrationBlock = function(is_post, stimulus) {
    var trials = [];
    var block_type = is_post? 'post-calibration' : 'calibration';

    for (var i = 1; i < calibration.max_scalepos + 1; i++) {
        var full_trials = this.makeCalibrationTrials(stimulus, i);
        trials = trials.concat(AdaptationUtils.sampleTrials(full_trials, calibration.distribution[i - 1]));
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
      text: `<p class="lead">You have finished this section.</p>
             <p>You can take a short break now if you want to.
                Please press the <strong>space bar</strong> when you are ready to continue.
             </p>`
    };

    if(is_post) {
      if(stimulus.name === 'flower') {
        wrap_up.on_finish =  function() {
          saveData(jsPsych.data.dataAsCSV(), dataRef);
          addWorker(workerId, 'adaptation-study');
        }
      } else {
        wrap_up.on_finish =  function() {
          saveData(jsPsych.data.dataAsCSV(), dataRef);
        }
      }
    } else {
      wrap_up.on_finish = function() {
        saveData(jsPsych.data.dataAsCSV(), dataRef);
        var prev_stim = jsPsych.data.getLastTrialData().stimulus
        if(prev_stim !== 'flower') {
          var ambiguous_point = AdaptationUtils.calculateAmbiguousPoint(prev_stim);
          AdaptationUtils.addAmbiguousPointToData(prev_stim, ambiguous_point);
        }
      }
    }

    return ({
      type: 'text',
      timing_post_trial: 1000,
      timeline: [
        calibration.instructions,
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
        exposure.instructions,
        exposure.audio_test,
        exposure_posttest_trials,
        exposure.end_block
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

  /** Generate the full set of possible calibration trials for a given stimulus/scale position combination.
   *
   * @param {Object} stimulus - The stimulus to use when generating trials.
   * @param {Number} scale_pos  - The scale position to use when generating trials.
   * @returns {Array<Object>}
   */
  this.makeCalibrationTrials = function(stimulus, scale_pos) {

    var trials = []

    var key_instr = '<p class="text-center text-center">Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>';
    var int_text = data.subcondition === 'too'? ' too ' : ' ';

    var trial_data = {
      scalepos: scale_pos,
      stimulus: stimulus.name
    }

    var prompt;
    if(stimulus.name === 'flower')
      prompt = '<p class="text-center text-center">Does this flower have exactly four (4) petals?</p>' + key_instr;
    else
      prompt = '<p class="text-center text-center">Is this ' + stimulus.name + int_text + stimulus.adjective + '?</p>' + key_instr;

    for (var i = 0; i < calibration.colors.length; i++) {

      var stim_url = '../static/images/adaptation/' + calibration.colors[i] + stimulus.name + scale_pos + '.jpg';

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

      if(_.contains(posttest.locations, i + 1)) {
          interleaved_trials.push(posttest_trials.shift());
      }
      if(_.contains(attention.locations, i + 1)) {
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
        color: exposure.colors[color_index],
        condition: data.condition,
        subcondition: data.subcondition
      }
    }

    var stim_function = function() {
      var trial_data  = jsPsych.currentTrial().data;
      trial_data.scalepos = AdaptationUtils.calculateExposureScalepos(trial_data.condition, trial_data.subcondition, trial_data.stim_object);
      return '../static/images/adaptation/' + trial_data.color + trial_data.stim_object + trial_data.scalepos + '.jpg';
    };

    if(stimulus.name !== 'flower') {

      trial.stimulus = stim_function;
      trial.prompt = exposure.audio.footer + stimulus.name + '_' + data.subcondition + statement + data.voice + exposure.audio.footer;

    } else {

      trial.stimulus = '../static/images/adaptation/flower4' + exposure.colors[color_index] + '.jpg';
      trial.prompt = exposure.audio.header + 'flower' + statement + data.voice + exposure.audio.footer;
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
    for(var x = 0; x < exposure.num_audio; x++) {
      for(var y = 0; y < exposure.reps; y++) {
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
      _.each(stimuli, function(stimulus) {
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
    var trials = [];
    var num_trials = attention.locations.length;

    var colors = jsPsych.randomization.sample(attention.colors, num_trials, true);
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
    for(var i = 0; i < stimuli.length; i++) {
      blocks.push(this.makeAttentionBlock());
    }
    return blocks;
  }

  /**
    * Create a regular post-test trial.
    * @param {Object} stimulus - The stimulus used in this trial.
    * @param {Number} scale_adjustment - The amount by which to adjust the scale position of the stimulus.
    * @param {String} color - The color used for the stimulus.
    * @returns {Object}
  */
  this.makePosttestObjectTrial = function(stimulus, scale_adjustment, color) {
    var trial = {}

    var audio_header = '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/';
    var audio_footer = '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>';
    var subcondition = data.subcondition === 'too'? 'too' : '';

    var stim_function = function() {
      var prev_trial_data = jsPsych.data.getLastTrialData();
      var trial_data = jsPsych.currentTrial().data;
      var corrected_ambiguous_point = AdaptationUtils.adjustAmbiguousPoint(prev_trial_data[trial_data.stim_obj + 'CorrectedAmbiguousPoint'], trial_data.adjustment);

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
      prompt: audio_header + stimulus.name + '_question' + subcondition + data.voice + audio_footer,
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
      prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/flowerquestion' + data.voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>',
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
    * @param {Object} stimulus - The stimulus to use.
    * @returns {Array<Object>}
  */
  this.makePosttestBlock = function(stimulus) {
    var trials = [];
    for(var z = 0; z < posttest.locations.length; z++) {

        var ptest_timeline = [];
        var reshuffled_colors = jsPsych.randomization.shuffle(posttest.colors);

        // If we're not doing flowers, each segment contains three trials
        if(stimulus.name !== 'flower') {
            for(var y = -1; y < 2; y++) {
              ptest_timeline.push(this.makePosttestObjectTrial(stimulus, y, reshuffled_colors[y + 1]));
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
    for(var x = 0; x < stimuli.length; x++) {
        blocks.push(this.makePosttestBlock(x));
    }
    return blocks;
  }
}
