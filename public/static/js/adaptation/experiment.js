// static/js/experiment.js
// Defines the experiment object.

/** Construct an instance of the Experiment class.
  * @constructor
  * @param {obect} params - A collection of parameters.
  */
function Experiment(params) {

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
    id: params.workerId,
    code: 'TURK' + jsPsych.randomization.randomID(10)
  };

  /** The condition assigned to the experiment.
   * @type {string}
   */
  this.condition = params.condition;

  /** The subcondition assigned to the experiment.
    * @type {string}
    */
  this.subcondition = params.subcondition;

  /** The voice used in the experiment.
    * @type {string}
    */
  this.voice = params.voice;

  /** Static jsPsych trials. These remain the same across instances of the experiment.
    * @type {Array<object>}
    */
  this.prefabs = prefabs;

  /** The colors to be used during the exposure phase.
   * @type {Array<string>}
   */
  this.exposure_colors = params.exposure_colors;

  /** The colors to be used during the posttest phase.
   * @type {Array<string>}
   */
  this.posttest_colors = params.posttest_colors;

  /** The colors used in the calibration phase.
   * The union of exposure_colors and posttest_colors.
   * @type {Array<string>}
   */
  this.calibration_colors = this.exposure_colors.concat(this.posttest_colors);

  /** The highest possible scale point.
   * @type {number}
   */
  this.max_scalepos = params.max_scalepos;

  /** The number of times to repeat each scale point.
   * @type {Array<number>}
   */
  this.trial_distribution = params.trial_distribution;

  /** The points during the exposure phase at which to insert post-test trials.
    * @type {Array<number>}
    */
  this.posttest_points = params.posttest_points;

  /** The points during the exposure phase at which to insert attention trials.
    * @type {Array<number>}
    */
  this.attention_points = params.attention_points;

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

    // Add the pre-experiment block to the timeline
    this.timeline.push(this.prefabs.pre_experiment_block);

    // Generate the three main phases of the experiment
    var calibration_blocks = this.makeCalibrationBlocks(false);
    var exposure_blocks = makeExposurePosttestBlocks(this);
    var post_calibration_blocks = this.makeCalibrationBlocks(true);

    // Prepare end blocks
    // If there are n stimuli, there are n-1 reps of end_block followed by 1 end_block_last
    var end_blocks = [];
    for(var x = 0; x < this.stimuli.length - 1; x++) {
       end_blocks.push(this.prefabs.end_block);
    }
    end_blocks.push(this.prefabs.end_block_last);

    // Create sets of [calibration, exposure, post_calibration, end_block] for each object
    // The resulting array is flattened so that it can be easily added to the timeline
    var experiment_blocks = _.flatten(
      _.zip(calibration_blocks, exposure_blocks, post_calibration_blocks, end_blocks)
    );

    // Concat the flattened experiement blocks
    this.timeline = this.timeline.concat(experiment_blocks);
    console.log(this.timeline);

    // Add on the final block
    this.timeline.push(this.prefabs.final_block);
  }

  /** Generate a set of calibration blocks.
   * @param {object} experiment - An instance of the experiment.
   * @param {boolean} is_post   - If this is a post-calibration block, true. Else false.
   * @returns {Array<object>}
   */
  this.makeCalibrationPhase = function(is_post) {
      var calibration_blocks = [];

      for(i = 0; i < this.stimuli.length; i++) {
          calibration_blocks.push(this.makeCalibrationBlock(is_post, i));
      }
      return calibration_blocks;
  }

  /** Generate a block of calibration trials.
   *
   * @param {object} experiment - An instance of the experiment.
   * @param {boolean} is_post   - If this is a post-calibration block, true. Else false.
   * @param {number} stim_index - Index of the stimulus to use for this block.
   */
  this.makeCalibrationBlock = function(is_post, stim_index) {
    var trials = [];
    var block_type = is_post? 'post-calibration' : 'calibration';

    for (var i = 1; i < this.max_scalepos + 1; i++) {
        var full_trials = makeTrialSet(this, stim_index, i);
        trials = trials.concat(sampleTrials(full_trials, this.trial_distribution[i - 1]));
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
      text: function() {
          var prev_stim = jsPsych.data.getLastTrialData().stimulus
          if(prev_stim !== 'flower')
              var ambiguous_point = calculateAmbiguousPoint(prev_stim);
              addAmbiguousPointToData(this, prev_stim, ambiguous_point);
          return '<p class="lead">You have finished this section.</p><p>You can take a short break now if you want to. Please press the <strong>space bar</strong> when you are ready to continue.</p>';
      },
      on_finish: function(){
          saveData(jsPsych.data.dataAsCSV(), dataRef);
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

function addAmbiguousPointToData(experiment, stim_name, ambiguous_point) {
  var ambig_prop = {};
  var tweaked_ambiguous_point = tweakAmbiguousPoint(ambiguous_point);

  ambig_prop[stim_name + '_ambiguous_point'] = tweaked_ambiguous_point;
  ambig_prop[stim_name + '_original_ambiguous_point'] = ambiguous_point;

  var stim_obj = _.find(experiment.stimuli, function(stimulus){ return stimulus.name === stim_name; });
  stim_obj.ambiguous_point = tweaked_ambiguous_point;
  stim_obj.original_ambiguous_point = ambiguous_point;

  jsPsych.data.addProperties(ambig_prop);
}

/**
 * Generates the full set of possible trials for a single stimulus/scale position combination.
 *
 * @param {object} experiment - An instance of the experiment.
 * @param {number} stim_index - The index of the stimulus to use when generating trials.
 * @param {number} scale_pos  - The scale position to use when generating trials.
 */
function makeTrialSet(experiment, stim_index, scale_pos) {

  var trials = []

  var cur_stim = experiment.stimuli[stim_index];
  var key_instr = '<p class="text-center text-center">Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>';
  var int_text = experiment.subcondition === 'too'? ' too ' : ' ';

  var trial_data = {
    scalepos: scale_pos,
    stimulus: cur_stim.name
  }

  var prompt;
  if(cur_stim.name === 'flower')
    prompt = '<p class="text-center text-center">Does this flower have exactly four (4) petals?</p>' + key_instr;
  else
    prompt = '<p class="text-center text-center">Is this ' + cur_stim.name + int_text + cur_stim.adjective + '?</p>' + key_instr;

  for (var i = 0; i < experiment.calibration_colors.length; i++) {

    var stim_url = '../static/images/adaptation/' + experiment.calibration_colors[i] + cur_stim.name + scale_pos + '.jpg';

    trials.push({
      stimulus: stim_url,
      prompt: prompt,
      data: trial_data
    });
  }

  return trials;

}

function interleaveTrials(experiment, exposure_trials, attention_trials, posttest_trials) {
  var interleaved_trials = [];

  for(var i = 0; i < exposure_trials.length; i++) {
    interleaved_trials.push(exposure_trials.shift());

    if(_.contains(experiment.posttest_points, i + 1)) {
        interleaved_trials.push(posttest_trials.shift());
    }
    if(_.contains(experiment.attention_points, i + 1)) {
        interleaved_trials.push(attention_trials.shift());
    }
  }
  return ({timeline: interleaved_trials});
}

function makeExposurePosttestBlock(experiment, exposure_trials, attention_trials, posttest_trials) {
  var exposure_posttest_trials = interleaveTrials(experiment, exposure_trials, attention_trials, posttest_trials);

  return ({
    type: 'single-stim',
    timeline: [
      experiment.prefabs.exposure_instructions,
      experiment.prefabs.audio_test_block,
      exposure_posttest_trials,
      experiment.prefabs.end_block
    ],
    timing_post_trial: 1000
  });
}

function makeExposurePosttestBlocks(experiment) {

  var exposure_blocks  = makeExposureBlocks(experiment);
  var attention_blocks = makeAttentionBlocks(experiment, 4);
  var posttest_blocks  = makePosttestBlocks(experiment);

  exp_post_blocks = [];

  for(var x = 0; x < exposure_blocks.length; x++) {
      exp_post_blocks.push(makeExposurePosttestBlock(experiment, exposure_blocks[x], attention_blocks[x], posttest_blocks[x]));
  }

  console.log(exp_post_blocks)

  return exp_post_blocks;

}

function calculateExposureScalepos(condition, subcondition, stimulus) {
  if(condition === 'ambiguous') {
    return stimulus.ambiguous_point;
  }

  if(condition === 'prototypical' && subcondition == 'neg') {
    return 1;
  }

  return 5;
}

function makeExposureTrial(experiment, statement_index, trial_index, stim_index) {

  var stimulus = experiment.stimuli[stim_index];
  var color_index = statement_index;

  var audio_header = '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/';
  var audio_footer = '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio>';

  var statement;
  var timing;

  if(statement_index == 0 && trial_index == 0) {
      statement_index = 5;
      timing = 7500;
  } else {
     statement_index = statement_index + 1;
     timing = 4500;
  }

  var trial = {
    type: 'single-stim',
    response_ends_trial: false,
    timing_response: timing,
    choices: [],
    data: {
      stimulus: stimulus.name,
      subtype: 'exposure'
    }
  }

  if(stimulus.name !== 'flower') {

    var cur_scalepos = calculateExposureScalepos(experiment.condition, experiment.subcondition, stimulus);

    trial.stimulus = '../static/images/adaptation/' + experiment.calibration_colors[color_index] + stimulus.name + cur_scalepos + '.jpg';
    trial.data.scalepos = cur_scalepos;
    trial.prompt = audio_header + stimulus.name + '_' + experiment.subcondition +  + statement_index + experiment.voice + audio_footer;
    console.log(trial.prompt);
  } else {

    trial.stimulus = '../static/images/adaptation/flower4' + experiment.calibration_colors[color_index] + '.jpg';
    trial.prompt = audio_header + 'flower' + statement + experiment.voice + audio_footer;
    trial.data = {
      scalepos: 4
    }

  }
  return trial;
}

function makeExposureBlock(experiment, stim_index) {

  var trials = [];
  var stimulus = experiment.stimuli[stim_index];

  for(var x = 0; x < 4; x++) {
    for(var y = 0; y < 6; y++) {
      trials.push(makeExposureTrial(experiment, x, y, stim_index));
    }
  }
  return trials;
}

function makeExposureBlocks(experiment) {
    var blocks = [];
    for(var i = 0; i < experiment.stimuli.length; i++) {
        var block = makeExposureBlock(experiment, i);
        blocks.push(block);
    }
    return blocks;
}

function makeAttentionTrial(experiment, stim_index, trial_index, color) {
  var trial = {
    type: 'single-stim',
    choices: ['R', 'B'],
    is_html: true
  };

  var presentation_slide = {
    stimulus: '<p class="text-center center-screen"><span style="font-size: 24pt; color:' + color + ';"><b>+</b></span></p>',
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
      color: experiment.calibration_colors[i],
      subtype: 'attention-response'},
    on_finish: function() {
      var data = jsPsych.data.getLastTrialData();
      var key = data.key_press;
      var _correct;
      if((key == '82' && data.color == 'red') || (key == '66' && data.color == 'blue')) {
          _correct = 1
      }
      else {
          _correct = 0
      }
      jsPsych.data.addDataToLastTrial({correct: _correct});
    }
  };

  trial.timeline = [presentation_slide, response_slide];
  return trial;
}

function makeAttentionBlock(experiment, stim_index, num) {
  var trials = []
  var colors = jsPsych.randomization.sample(["red", "blue"], num, true);
  for(var i = 0; i < num; i++) {
    trials.push(makeAttentionTrial(experiment, stim_index, i, colors[i]));
  }
  return trials;
}

function makeAttentionBlocks(experiment, num) {
  var blocks = []
  for(var x = 0; x < experiment.stimuli.length; x++) {
    blocks.push(makeAttentionBlock(experiment, x, num));
  }
  return blocks;
}

function correctAmbiguousPoint(ambiguous_point, scale_adjustment) {
  if(ambiguous_point + scale_adjustment > 1 && ambiguous_point + scale_adjustment < 5)
    return ambiguous_point + scale_adjustment;
  else if(ambiguous_point + scale_adjustment <= 1)
    return 2;

  return 4;
}

function makePosttestObjectTrial(experiment, stim_index, scale_adjustment, color) {
  var trial = {}
  var stimulus = experiment.stimuli[stim_index];

  var corrected_ambiguous_point = correctAmbiguousPoint(stimulus.ambiguous_point, scale_adjustment);
  var img_url = '../static/images/adaptation/' + color + stimulus.name + corrected_ambiguous_point + '.jpg'

  var audio_header = '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/';
  var audio_footer = '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>';
  var subcondition = experiment.subcondition === 'too'? 'too' : '';

  var presentation_trial = {
    stimulus: img_url,
    type: "single-stim",
    data: {
      subtype: 'posttest-stimulus'
    },
    prompt: audio_header + stimulus.name + '_question' + subcondition + experiment.voice + audio_footer,
    timing_post_trial: 0,
    response_ends_trial: false,
    timing_response: 3000,
    choices: []
  }

  var response_trial = {
    stimulus: img_url,
    prompt: '<br/><p class="text-center">Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
    response_ends_trial: true,
    choices: ['F', 'J'],
    data: {
        adjustment: scale_adjustment,
        stimulus: experiment.stimuli[stim_index].name,
        subtype: 'posttest-response',
        scalepos: corrected_ambiguous_point
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

function makePosttestFlowerTrial(experiment, colors) {
  // Get a random number of petals
  var num_petals = jsPsych.randomization.sample([1,2,3,4,5], 1, false);
  var color = jsPsych.randomization.sample(colors, 1, false);

  var presentation_trial = {
    stimulus: '../static/images/adaptation/' + color + 'flower' + num_petals + '.jpg',
    prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/flowerquestion' + experiment.voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>',
    data: {scalepos: nums[0] - 1,
        stimulus: "flower",
        subtype: 'posttest-audio'
    },
    timing_post_trial: 0,
    response_ends_trial: false,
    timing_response: 3000
  };

  var response_trial = {
    stimulus: '../static/images/adaptation/' + color + 'flower' + num_petals + '.jpg',
    prompt: '<br/><p class="text-center">Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
    data: {
        scalepos: num_petals,
        stimulus: 'flower',
        subtype: 'posttest-audio'
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

function makePosttestBlock(experiment, stim_index) {
  // Each posttest block consists of points.length segments
  var trials = [];

  for(var z = 0; z < experiment.posttest_points.length; z++) {

      var trialset = [];
      var reshuffled_colors = jsPsych.randomization.shuffle(experiment.calibration_colors);

      // If we're not doing flowers, each segment contains three trials
      if(experiment.stimuli[stim_index] !== 'flower') {
          for(var y = -1; y < 2; y++) {
            trialset.push(makePosttestObjectTrial(experiment, stim_index, y, reshuffled_colors[y + 1]));
          }
      }
      else { // For flowers, just do one random posttest
        trialset.push(makePosttestObjectTrial(experiment, reshuffled_colors));
      }

      // Now we push the trials to a segment
      trials.push({
          type: "single-stim",
          timeline: trialset
      });
  }

  return trials;
}

function makePosttestBlocks(experiment) {
    var blocks = [];
    for(var x = 0; x < experiment.stimuli.length; x++) {
        blocks.push(makePosttestBlock(experiment, x));
    }
    return blocks;
}
