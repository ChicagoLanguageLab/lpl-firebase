/**
 * Creates a new Experiment.
 * @constructor
 */
function Experiment(params) {
  this.stimuli = jsPsych.randomization.shuffle(params.stimuli);
  this.timeline = [];

  var url_params = jsPsych.data.urlVariables();

  this.subject = {
    id: url_params.workerId,
    code: 'TURK' + jsPsych.randomization.randomID(10)
  };

  this.condition = url_params.condition;
  this.subcondition = url_params.subcondition;
  this.voice = url_params.voice;

  this.prefabs = prefabs;

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

  this.exposure_colors = jsPsych.randomization.shuffle(params.exposure_colors);
  this.posttest_colors = jsPsych.randomization.shuffle(params.posttest_colors);
  this.colors = this.exposure_colors.concat(this.posttest_colors);

  this.max_scalepos = params.max_scalepos;
  this.trial_distribution = params.trial_distribution;
  this.posttest_points = params.posttest_points;
  this.attention_points = params.attention_points;

  this.current_stim_set = this.stimuli[0].name;

  // Add data to jsPsych instance
  jsPsych.data.addProperties({
    workerId: this.subject.id,
    code: this.subject.code,
    condition: this.condition,
    subcondition: this.subcondition,
    voice: this.voice
  });

  this.init = function() {
    /* TODO: comment this */

    var calibration_blocks = makeCalibrationBlocks(this, false);
    var exposure_blocks = makeExposurePosttestBlocks(this);
    var post_calibration_blocks = makeCalibrationBlocks(this, true);

    //this.timeline.push(pre_experiment_block);

    // TODO: change this to use Underscore
    for(var x = 0; x < calibration_blocks.length; x++) {
        //this.timeline.push(calibration_blocks[x]);
        this.timeline.push(exposure_blocks[x]);
    }

    // Reprise the pretests
    /*for(var x = 0; x < post_calibration_blocks.length; x++) {
        this.timeline.push(post_calibration_blocks[x]);
        if(x == post_calibration_blocks.length-1)
            this.timeline.push(this.prefabs.end_block_last);
        else
            this.timeline.push(this.prefabs.end_block);
    }*/

    this.timeline.push(this.prefabs.final_block);
  }
}

/**
 * Samples from a set of trials generated with a given stimulus/scale position combination.
 *
 * @param {object} experiment - An instance of the experiment.
 * @param {number} stim_index - The index of the stimulus to use when generating trials.
 * @param {number} scale_pos  - The scale position to use when generating trials.
 */
function sampleTrials(experiment, stim_index, scale_pos) {
  var full_trials = makeTrialSet(experiment, stim_index, scale_pos);
  return jsPsych.randomization.sample(full_trials, experiment.trial_distribution[scale_pos - 1], true);
}

/**
 * Calculates the most ambiguous scalepos for a given stimulus.
 * TODO: Make jsPsych an argument for maximum safety?
 *
 * @param {string} stimulus - Name of the stimulus to check.
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

    var ambig_prop;
    var tweaked_ambiguous_point = tweakAmbiguousPoint(ambiguous_point);
    switch(stimulus) {
      case 'candle': ambig_prop = {candle_ambiguous_point: tweaked_ambiguous_point}; break;
      case 'pillow': ambig_prop = {pillow_ambiguous_point: tweaked_ambiguous_point}; break;
      case 'bar': ambig_prop = {bar_ambiguous_point: tweaked_ambiguous_point}; break;
    }
    jsPsych.data.addProperties(ambig_prop);
}

/**
 * Adjusts the ambiguous point as needed.
 *
 * @param {number} ambiguous_point - The original ambiguous point.
 */
function tweakAmbiguousPoint(ambiguous_point) {
  if(ambiguous_point <= 1)
    return 2;
  else if(ambiguous_point >= 5)
    return 4;
  else
    return ambiguous_point;
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

  for (var i = 0; i < experiment.colors.length; i++) {

    var stim_url = '../static/images/adaptation/' + experiment.colors[i] + cur_stim.name + scale_pos + '.jpg';

    trials.push({
      stimulus: stim_url,
      prompt: prompt,
      data: trial_data
    });
  }

  return trials;

}

/**
 * Generates a block of calibration trials.
 *
 * @param {object} experiment - An instance of the experiment.
 * @param {boolean} is_post   - If this is a post-calibration block, true. Else false.
 * @param {number} stim_index - Index of the stimulus to use for this block.
 */
function makeCalibrationBlock(experiment, is_post, stim_index) {
  var trials = [];
  var block_type = is_post? 'post-calibration' : 'calibration';

  for (var i = 1; i < experiment.max_scalepos + 1; i++) {
      trials = trials.concat(sampleTrials(experiment, stim_index, i));
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

  return ({
    type: 'text',
    timing_post_trial: 1000,
    timeline: [
      experiment.prefabs.calibration_instructions,
      calibration_block,
      experiment.prefabs.wrap_up
    ],
    data: {
      subtype: block_type
    }
  });
}

/**
 * Generates a set of calibration trials.
 * @param {object} experiment - An instance of the experiment.
 * @param {boolean} is_post   - If this is a post-calibration block, true. Else false.
 */
function makeCalibrationBlocks(experiment, is_post) {
    var calibration_blocks = [];

    for(i = 0; i < experiment.stimuli.length; i++) {
        calibration_blocks.push(makeCalibrationBlock(experiment, is_post, i));
    }

    return calibration_blocks;
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

  var audio_header = '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="';
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

    trial.stimulus = '../static/images/adaptation/' + experiment.colors[color_index] + stimulus.name + cur_scalepos + '.jpg';
    trial.data.scalepos = cur_scalepos;
    trial.prompt = audio_header + '../static/sound/adaptation/' + experiment.subcondition + stimulus.name + statement_index + experiment.voice + audio_footer;
    console.log(trial.prompt);
  } else {

    trial.stimulus = '../static/images/adaptation/flower4' + experiment.colors[color_index] + '.jpg';
    trial.prompt = audio_header + '../static/sound/adaptation/flower' + statement + experiment.voice + audio_footer;
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
    timing_response: 500
  };

  var response_slide = {
    stimulus: '<p></p>',
    prompt: '<p class="text-center center-screen">What was the color of the "+" you just saw?<br/>Press <b>R</b> for <b>red</b> and <b>B</b> for <b>blue</b>.</p>',
    data: {color: experiment.colors[i], subtype: 'attention'},
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

  var presentation_trial = {
    stimulus: img_url,
    type: "single-stim",
    data: {
      subtype: 'posttest-audio'
    },
    prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/' + experiment.subcondition + stimulus.name + 'question' + experiment.voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>',
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
        subtype: 'posttest',
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
      var reshuffled_colors = jsPsych.randomization.shuffle(experiment.colors);

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
