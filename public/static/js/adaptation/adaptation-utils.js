/* Intersperse exposure phase with posttests */

function make_exposure_posttest(experiment, prefabs) {

  var exposure_data         = makeExposure(experiment, prefabs);
  var exposure_instructions = exposure_data[0];
  var exposure_segments     = exposure_data[1];

  var attention_blocks = makeAttentionTrials(experiment, 4);
  var posttest_blocks  = makePosttest(experiment, prefabs);

  var exposure_blocks = [];
  for(var x = 0; x < exposure_segments.length; x++) {

    var exposure_trials = [];

    for(var i = 1; i < exposure_segments[x].length + 1; i++) {
      exposure_trials.push(exposure_segments[x][i-1]);

      // At the specified points, add three posttest trials (one segment)
      if(_.contains(experiment.posttest_points, i)) {
          exposure_trials.push(posttest_blocks[x].shift());
      }
      if(_.contains(experiment.attention_points, i)) {
          exposure_trials.push(attention_blocks[x].shift());
      }
    }

    // Add the trials as a block
    exposure_blocks.push({
      type: 'single-stim',
      timeline: [
        exposure_instructions,
        prefabs.audio_test_block,
        exposure_trials,
        prefabs.end_block
      ],
      timing_post_trial: 1000
    });

  }

  return exposure_blocks;

}

/**
 * Generates the full set of possible trials for a single stimulus/scale position combination.
 *
 * @param {object} e_instance - An instance of the experiment.
 * @param {number} stim_index - The index of the stimulus to use when generating trials.
 * @param {number} scale_pos  - The scale position to use when generating trials.
 */
function makeTrialSet(e_instance, stim_index, scale_pos) {

  var trials = []

  var cur_stim = e_instance.stimuli[stim_index];
  var key_instr = '<p class="center-screen text-center">Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>';
  var int_text = e_instance.subcondition === 'too'? ' too ' : ' ';

  var trial_data = {
    scalepos: scale_pos,
    stimulus: cur_stim.name
  }

  var prompt;
  if(cur_stim.name === 'flower')
    prompt = '<p class="center-screen text-center">Does this flower have exactly four (4) petals?</p>' + key_instr;
  else
    prompt = '<p class="center-screen text-center">Is this ' + cur_stim.name + int_text + cur_stim.adjective + '?</p>' + key_instr;

  for (var i = 0; i < e_instance.colors.length; i++) {

    var stim_url = '../static/images/adaptation/' + e_instance.colors[i] + cur_stim.name + scale_pos + '.jpg';

    trials.push({
      stimulus: stim_url,
      prompt: prompt,
      data: trial_data
    });
  }

  return trials;

}

/**
 * Samples from a set of trials generated with a given stimulus/scale position combination.
 *
 * @param {object} e_instance - An instance of the experiment.
 * @param {number} stim_index - The index of the stimulus to use when generating trials.
 * @param {number} scale_pos  - The scale position to use when generating trials.
*/
function sampleTrials(e_instance, stim_index, scale_pos) {
  return jsPsych.randomization.sample(makeTrialSet(e_instance, stim_index, scale_pos), e_instance.trial_distribution[scale_pos - 1], true);
}

function makeCalibrationBlock(e_instance, prefabs, is_post, stim_index) {
  var trials = [];
  var block_type = is_post? 'calibration' : 'post-calibration';

  for (var i = 1; i < e_instance.max_scalepos + 1; i++) {
      trials = trials.concat(sampleTrials(e_instance, stim_index, i));
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
      prefabs.calibration_instructions,
      calibration_block,
      prefabs.wrap_up
    ],
    data: {
      subtype: block_type
    }
  });
}

function makeCalibrationBlocks(experiment, prefabs, is_post) {
    var calibration_blocks = [];

    for(i = 0; i < experiment.stimuli.length; i++) {
        calibration_blocks.push(makeCalibrationBlock(experiment, prefabs, is_post, i));
    }

    return calibration_blocks;
}

function calculateAmbiguousPoint(stimulus) {
    lr = new LogReg(5, 1);
    lr.init([1,2,3,4,5]);

    var trials = jsPsych.data.getData({stimulus: stimulus});

    _.each(trials, function(trial) {
      try {
        lr.addObs(trial.scalepos - 1, trial.has_prop);
      }
      catch (e) {
        xint = 3;
        console.log("Error");
        return;
      }
    });

    lr.fit();

    var xint = this.lr.xint();
    if(xint == null || isNaN(xint)) {
      xint = 3;
    }

    console.log('Xint: ' + xint)

    var best = 10000;
    var ambiguous_point = -1;
    for (var j=0; j<6; j++) {
      var dif = Math.abs(xint-j);
      if (dif < best) {
          best = dif;
          ambiguous_point = j;
      }
    }
    console.log('Best fit: ' + ambiguous_point);

    originalAmbiguousPoint = ambiguous_point;
    if(ambiguous_point <= 1)
      adjustedAmbiguousPoint = 2;
    else if(ambiguous_point >= 5)
      adjustedAmbiguousPoint = 4;
    else
      adjustedAmbiguousPoint = ambiguous_point;
}

function makePosttest(experiment, prefabs) {
    var blocks = [];

    var too_text = '';
    if(experiment.subcondition === 'too')
      too_text = '_too';

    for(var x = 0; x < experiment.stimuli.length + 1; x++) {
        // Each posttest block consists of points.length segments
        var segments = [];

        // Create the segments
        for(var z = 0; z < experiment.posttest_points.length; z++) {

            // Store trials
            var trials = [];

            // If we're not doing flowers, each segment contains three trials
            if(x < experiment.stimuli.length) {
                // We want to randomize the colors so the candles are less similar
                var temp = jsPsych.randomization.shuffle(experiment.colors);

                // For points to the left, center and right...
                for(var y = -1; y < 2; y++) {
                    (function (x, y, temp) {
                        trials.push({
                            timeline: [{
                                stimulus: function(){
                                    var ambiguous_point = adjustedAmbiguousPoint;
                                    // We need to make sure we don't use endpoints
                                    var image;
                                    if(ambiguous_point + y > 1 && ambiguous_point + y < 5)
                                        image =  '../static/images/adaptation/' + experiment.stimuli[x].name + (ambiguous_point + y) + temp[y + 1] + '.jpg'
                                    else if(ambiguous_point + y <= 1)
                                        image =  '../static/images/adaptation/' + experiment.stimuli[x].name + 2 + temp[y + 1] + '.jpg';
                                    else
                                        image = '../static/images/adaptation/' + experiment.stimuli[x].name + 4 + temp[y + 1] + '.jpg';

                                    // Return the proper image
                                    return image
                                },
                                type: "single-stim",
                                data: {
                                  subtype: 'posttest-audio'
                                },
                                prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/' + experiment.stimuli[x].name + '_question' + too_text + experiment.voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>',
                                timing_post_trial: 0,
                                response_ends_trial: false,
                                timing_response: 3000,
                                choices: []
                            },
                            {
                                stimulus: function(){
                                    // We need to make sure we don't use endpoints
                                    var image;
                                    var ambiguous_point = adjustedAmbiguousPoint;
                                    console.log('Scale point in trial: ' + (ambiguous_point + y));
                                    if(ambiguous_point + y > 1 && ambiguous_point + y < 5)
                                        image =  '../static/images/adaptation/' + experiment.stimuli[x].name + (ambiguous_point + y) + temp[y + 1] + '.jpg'
                                    else if(ambiguous_point + y <= 1)
                                        image =  '../static/images/adaptation/' + experiment.stimuli[x].name + 2 + temp[y + 1] + '.jpg';
                                    else
                                        image = '../static/images/adaptation/' + experiment.stimuli[x].name + 4 + temp[y + 1] + '.jpg';

                                    // Return the proper image
                                    return image
                                },
                                prompt: '<br/><p>Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
                                type: "single-stim",
                                choices: ['F', 'J'],
                                data: {
                                    adjustment: y,
                                    stimulus: experiment.stimuli[x].name,
                                    subtype: 'posttest'
                                },
                                on_finish: function(data) {
                                    var has_prop = 0;
                                    if(data.key_press == '70')
                                        has_prop = 1;

                                    var ambiguous_point = adjustedAmbiguousPoint;

                                    jsPsych.data.addDataToLastTrial({has_prop: has_prop});
                                    jsPsych.data.addDataToLastTrial({stimulus: data.stimulus});

                                    jsPsych.data.addDataToLastTrial({originalAmbiguousPoint: originalAmbiguousPoint});
                                    jsPsych.data.addDataToLastTrial({adjustedAmbiguousPoint: adjustedAmbiguousPoint});

                                    if(ambiguous_point + data.adjustment > 1 && ambiguous_point + data.adjustment < 5)
                                        jsPsych.data.addDataToLastTrial({scalepos: ambiguous_point + data.adjustment});
                                    else if(ambiguous_point + data.adjustment <= 1)
                                        jsPsych.data.addDataToLastTrial({scalepos: 2});
                                    else
                                        jsPsych.data.addDataToLastTrial({scalepos: 4});
                                }
                            }]
                        });
                    })(x,y,temp);
                }
            }
            else { // For flowers, just do one random posttest
                (function (y) {
                    // Get a random color and number of petals
                    var temp = jsPsych.randomization.shuffle(experiment.colors);
                    var nums = jsPsych.randomization.shuffle([2,3,4,5,6]);

                    trials.push({
                        timeline: [{
                            type: "single-stim",
                            stimulus: '../static/images/adaptation/flower' + nums[0] + temp[y]  + '.jpg',
                            prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/flower_question' + experiment.voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>',
                            data: {scalepos: nums[0] - 1,
                                stimulus: "flower",
                                subtype: 'posttest-audio'
                            },
                            timing_post_trial: 0,
                            response_ends_trial: false,
                            timing_response: 3000
                        },
                        {
                            type: "single-stim",
                            stimulus: '../static/images/adaptation/flower' + nums[0] + temp[y]  + '.jpg',
                            prompt: '<br/><p>Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
                            data: {
                                scalepos: nums[0] - 1,
                                stimulus: "flower",
                                subtype: 'posttest-audio'
                            },
                            choices: ['F', 'J'],
                            on_finish: function(data) {
                                var has_prop = 0;
                                if(data.key_press == '70')
                                    has_prop = 1;

                                jsPsych.data.addDataToLastTrial({has_prop: has_prop});
                                jsPsych.data.addDataToLastTrial({stimulus: data.object});
                                jsPsych.data.addDataToLastTrial({scalepos: data.scalepos});
                            }
                        }]
                    });
                }(y));
            }

            // Now we push the trials to a segment
            segments.push({
                type: "posttest",
                timeline: trials
            });
        }
        // Push all segments to the block
        blocks.push(segments);
    }
    return blocks;
}

function makeExposure(experiment, prefabs) {
    var segments = [];
    var instructions = [];
    var instruction_text;

    if(experiment.voice !== "z") {
        instruction_text = "<p>In this section you will see a sequence of images. " +
                           "You will also hear a verbal description of each image. " +
                           "Please listen carefully to each description. " +
                           "Periodically, you will answer some questions about the images.</p>" +
                           "<p>Be sure to remain focused on the center of the screen. " +
                           "Every so often, a \"+\" symbol will be briefly displayed in the center of the screen, " +
                           "and you will be asked a question about it. " +
                           "Please do your best to answer the question accurately.</p> " +
                           "<p>Press the space bar when you are ready to begin.</p>";
    }
    else {
        instruction_text = "<p>In this section, you will see a sequence of images. " +
                           "You will also listen to sentences recorded using a speech synthesizer we are testing. " +
                           "Periodically, you will answer some questions.</p>" +
                           "<p>Be sure to remain focused on the center of the screen. " +
                           "Every so often, a \"+\" symbol will be briefly displayed in the center of the screen, " +
                           "and you will be asked a question about it. " +
                           "Please do your best to answer the question accurately.</p> " +
                           "<p>Press the space bar when you are ready to begin.</p>";
    }
    for(var i = 0; i < experiment.stimuli.length + 1; i++) {
        /* Add the instructions */
        instructions.push({
            type: "text",
            text: instruction_text,
            cont_key: [' ']
        });

        var trials = [];
        for(var x = 0; x < 4; x++) {
            for(var y = 0; y < 6; y++) {
                (function (x, y, i) {
                    var statement;
                    var timing;
                    if(x == 0 && y == 0){ //&& voice != "_z") {
                        statement = 5;
                        timing = 7500;
                    }
                    else {
                       statement = x + 1;
                       timing = 4500;
                   }

                    if(i < experiment.stimuli.length) {
                        trials.push({
                            type: "exposure",
                            response_ends_trial: false,
                            timing_response: timing,
                            choices: [],
                            stimulus: function(){
                                var ambiguous_point = adjustedAmbiguousPoint;
                                if(condition == "ambiguous") {
                                    return '../static/images/adaptation/' + experiment.stimuli[i].name + ambiguous_point + experiment.colors[x] + '.jpg'
                                }
                                else if (condition == "prototypical") {
                                    if (type == "_neg") {
                                        return '../static/images/adaptation/' + experiment.stimuli[i].name + 1 + experiment.colors[x] + '.jpg'
                                    }
                                    else {
                                        return '../static/images/adaptation/' + experiment.stimuli[i].name + 5 + experiment.colors[x] + '.jpg'
                                    }
                                }
                            },
                            data: {stimulus: experiment.stimuli[i].name},
                            prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/' + experiment.stimuli[i].name + '_statement' + statement + experiment.subcondition + experiment.voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio>',
                            on_finish: function(data){
                                var ambiguous_point = adjustedAmbiguousPoint;

                                jsPsych.data.addDataToLastTrial({originalAmbiguousPoint: originalAmbiguousPoint});
                                jsPsych.data.addDataToLastTrial({adjustedAmbiguousPoint: adjustedAmbiguousPoint});

                                jsPsych.data.addDataToLastTrial({stimulus: data.object});

                                if(condition == "ambiguous") {
                                    jsPsych.data.addDataToLastTrial({scalepos: ambiguous_point});
                                }
                                else if (condition == "prototypical") {
                                    if (type == "_neg") {
                                        jsPsych.data.addDataToLastTrial({scalepos: 1});
                                    }
                                    else {
                                        jsPsych.data.addDataToLastTrial({scalepos: 5});
                                    }
                                }
                            }
                        });
                    }
                    else {
                        trials.push({
                            type: "exposure",
                            response_ends_trial: false,
                            timing_response: timing,
                            choices: [],
                            stimulus: function(){
                                return '../static/images/adaptation/flower4' + experiment.colors[x] + '.jpg'
                            },
                            prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/flower_statement' + statement + experiment.voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio>',
                            on_finish: function(data){
                                jsPsych.data.addDataToLastTrial({stimulus: "flower"});
                                jsPsych.data.addDataToLastTrial({scalepos: 4});
                            }
                        });
                    }
                }(x, y, i));
            }
        }
        segments.push(trials);
    }
    return [instructions, segments];
}

function makeAttentionTrials(experiment, num) {
    var blocks = []
    for(var x = 0; x < experiment.stimuli.length + 1; x++) {
        var segments = []
        var colors = jsPsych.randomization.sample(["red", "blue"], num, true);
        for(var i = 0; i < num; i++) {
            console.log(experiment.colors[i]);
            segments.push({
                type: "attention",
                choices: ['R', 'B'],
                is_html: true,
                timeline: [{
                    stimulus: '<p><span style="font-size: 24pt; color:' + experiment.colors[i] + ';"><b>+</b></span></p>',
                    response_ends_trial: false,
                    timing_response: 500
                }, {
                    stimulus: '<p></p>',
                    prompt: '<p>What was the color of the "+" you just saw?<br/>Press <b>R</b> for <b>red</b> and <b>B</b> for <b>blue</b>.</p>',
                    data: {color: experiment.colors[i]},
                    on_finish: function(data) {
                        if(data.key_press == '82' && data.color == 'red') {
                            jsPsych.data.addDataToLastTrial({correct: 1});
                        }
                        else if (data.key_press == '66' && data.color == 'blue') {
                            jsPsych.data.addDataToLastTrial({correct: 1});
                        }
                        else {
                            jsPsych.data.addDataToLastTrial({correct: 0});
                        }
                    }
                }]
            });
        }
        blocks.push(segments);
    }
    return blocks;
}
