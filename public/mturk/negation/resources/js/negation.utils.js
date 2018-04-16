/** Build the stimulus - a set of colored shapes - as a single display.
  * @param {String} version - The version of the experiment.
  * @param {Int} block_size - The number of shapes to display per color block, where applicable.
  * @param {String} polarity - "Positive" or "Negative"
  * @param {Boolean} is_true - Truth value of the prompt sentence.
  * @param {Object} distribution - Stores data on the ratio of target/non-target shapes.
  * @param {String} coloring - "Random" or "Categorical". Defines how to color non-target shapes, e.g. by block or randomly.
  * @param {String} target_shape - The critical shape for this trial.
  * @param {String} target_color - The critical color for this trial.
  * @param {Array<String>} shapes - The set of shapes to choose from.
  * @param {Array<String>} colors - The set of colors to choose from.
  */
function makeSingleStimulus(version, block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes, colors) {

  // Generate a set of colored shapes based on coloring type
  var stimulus_shapes = [];
  if(coloring === "random") {
    stimulus_shapes = makeRandomStimulus(version, block_size, polarity, is_true, distribution, target_shape, target_color, shapes, colors);
  } else {
    stimulus_shapes = makeCategoricalStimulus(version, block_size, polarity, is_true, distribution, target_shape, target_color, shapes, colors);
  }

  // Colored shapes must be rendered in HTML. Buffer holds the generated HTML string.
  var buffer = "";
  var header = '<img src="resources/images/';
  var footer = '.png" width="50px" />';

  // stimulus_shapes is a list of lists, so we shuffle and flatten it.
  // Shuffling prevents the critical shapes from always being first.
  stimulus_shapes = _.flatten(jsPsych.randomization.shuffle(stimulus_shapes));

  // In this stimulus type, the target shapes are displayed with everything else.
  // We draw a box around the targets to reduce visual search time.
  var target_count = 0;
  _.each(stimulus_shapes, function(trial) {

    buffer += ' ';
    var cur_shape = trial.split('_')[0];

    if(cur_shape === target_shape) { // If processing a target, increase target count.
      target_count++;
      if(target_count == 1) { // If this is the first target, add a span tag.
        buffer += '<span class="border-around">';
      }
    }

    buffer += header + trial + footer; // Add image to the buffer.

    if(target_count == distribution.targets) { // If last target, close the span.
      buffer += '</span>';
    }
  });

  // Return buffer and list of shapes.
  return ({
    stimulus_string: buffer,
    stimulus_list: stimulus_shapes
  });

}

/** Build the stimulus - a set of colored shapes - as a pair of displays.
  * @param {String} version - The version of the experiment.
  * @param {Int} block_size - The number of shapes to display per color block, where applicable.
  * @param {String} polarity - "Positive" or "Negative"
  * @param {Boolean} is_true - Truth value of the prompt sentence.
  * @param {Object} distribution - Stores data on the ratio of target/non-target shapes.
  * @param {String} coloring - "Random" or "Categorical". Defines how to color non-target shapes, e.g. by block or randomly.
  * @param {String} target_shape - The critical shape for this trial.
  * @param {String} target_color - The critical color for this trial.
  * @param {Array<String>} shapes - The set of shapes to choose from.
  * @param {Array<String>} colors - The set of colors to choose from.
  */
function makeSpacedStimulus(version, block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes, colors, is_practice) {

  // In this stimulus type, there are two displays.
  // One display is targets only; the other consists of all other shapes.
  var targets_buffer = "";
  var others_buffer = "";

  // Generate a set of colored shapes based on coloring type
  var stimulus_list = [];
  if(coloring === "random") {
    stimulus_list = makeRandomStimulus(version, block_size, polarity, is_true, distribution, target_shape, target_color, shapes, colors);
  } else {
    stimulus_list = makeCategoricalStimulus(version, block_size, polarity, is_true, distribution, target_shape, target_color, shapes, colors, is_practice);
  }

  var header = '<img src="resources/images/';
  var footer = '.png" width="50px" />';

  targets = _.flatten(stimulus_list[0]);
  others = _.flatten(jsPsych.randomization.shuffle(stimulus_list[1]));

  _.each(targets, function(trial) {
    targets_buffer += ' ';
    targets_buffer += header + trial + footer;
  });

  if(version !== 'masked') {
    _.each(others, function(trial) {
      others_buffer += ' ';
      others_buffer += header + trial + footer;
    });
  }
  else {
    _.each(others, function(trial) {
      others_buffer += ' ';
      var cur_color = trial.split('_')[1];
      if(cur_color !== target_color) {
        others_buffer += '<span class="border-around">';
        others_buffer += header + 'blank' + footer;
        others_buffer += '</span>';
      }
      else {
        others_buffer += header + trial + footer;
      }
    });
  }

  return ({
    targets_string: targets_buffer,
    others_string: others_buffer,
    targets_list: targets,
    others_list: others
  });
}

function makePrompt(version, polarity, intensity, shape, color) {
  if(version.includes('question')) {
    if (polarity === "positive") {
      return "The " + shape + " is " + color + ".";
    } else {
      return "The " + shape + " is not " + color + ".";
    }
  } else if (polarity === "positive") {
    if(intensity === "reg") {
      return "The " + shape + "s are " + color + ".";
    } else {
      return "All of the " + shape + "s are " + color + ".";
    }
  } else {
    if(intensity === "reg") {
      return "The " + shape + "s are not " + color + ".";
    } else {
      return "None of the " + shape + "s are " + color + ".";
    }
  }
}

function makePracticePrompt(type, shape, color, is_true, distribution) {
  if (is_true) {
    if(type === 'number') {
      return "There are " + distribution.targets + " " + shape + "s."
    } else {
      return "There are " + distribution.targets + " " + color + " " + shape + "s."
    }
  } else {
    if(type === 'number') {
      var number = Math.floor(Math.random() * 9 + 2);
      while (number == distribution.targets) {
        number = Math.floor(Math.random() * 9 + 2);
      }
      return "There are " + number + " " + shape + "s."
    } else {
      return "There are " + distribution.targets + " " + color + " " + shape + "s."
    }
  }
}

function makeShapeBlock(num_shapes, shape, color) {
  var shapes = [];
  for(var i = 0; i < num_shapes; i++) {
    shapes.push(shape + '_' + color);
  }
  return shapes;
}

function makeRandomShapeBlock(num_shapes, shape, colors) {
  var out = [];
  for(var i=0; i<num_shapes; i++) {
    var rand_color = jsPsych.randomization.sample(colors, 1, false);
    out.push(shape + '_' + rand_color);
  }
  return out;
}

function makeCategoricalStimulus(version, block_size, polarity, is_true, distribution, target_shape, target_color, shapes, colors, is_practice) {

  if(version === "basic") {
    var out = [];
  } else {
    var targets = [];
    var others = [];
  }

  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);
  var shuffled_colors = jsPsych.randomization.shuffle(colors);

  if(is_practice) {
    shuffled_colors = jsPsych.randomization.shuffle(['purple','purple', 'green', 'green','orange', 'orange']);
  }

  if(((polarity === "positive" || polarity === "ncolor-negative") && is_true) || (polarity === "negative" && !is_true)) {
    if(version.includes('question')) {
      targets.push(makeShapeBlock(1, target_shape, target_color));
    } else {
      for(var i = 0; i < distribution.targets / block_size; i++) {
        if(version === "basic") {
          out.push(makeShapeBlock(block_size, target_shape, target_color));
        } else {
          targets.push(makeShapeBlock(block_size, target_shape, target_color));
        }
      }
    }
  } else if((polarity === "negative" && is_true) || (polarity === "positive" && !is_true)) {
    var rand_color = shuffled_colors.pop();
    if(version.includes('question')) {
      targets.push(makeShapeBlock(1, target_shape, rand_color));
    } else {
      for(var i = 0; i < distribution.targets / block_size; i++) {
        if(version === "basic") {
          out.push(makeShapeBlock(block_size, target_shape, rand_color));
        } else {
          targets.push(makeShapeBlock(block_size, target_shape, rand_color));
        }
      }
    }
  }

  if(version.includes('question')) {
    others.push(makeShapeBlock(distribution.color_ntarget, target_shape, target_color));

    var rand_color = _.without(shuffled_colors, target_color).pop();
    others.push(makeShapeBlock(distribution.other, target_shape, rand_color));

  } else {
    for(var i = 0; i < distribution.color_ntarget / block_size; i++) {
      var rand_shape = shuffled_shapes.pop();
      if(version === "basic") {
        out.push(makeShapeBlock(block_size, rand_shape, target_color));
      } else {
        others.push(makeShapeBlock(block_size, rand_shape, target_color));
      }
    }

    for(var i = 0; i < distribution.other / block_size; i++) {
      var rand_shape = shuffled_shapes.pop();
      var rand_color = shuffled_colors.pop();
      if(version === "basic") {
        out.push(makeShapeBlock(block_size, rand_shape, rand_color));
      } else {
        others.push(makeShapeBlock(block_size, rand_shape, rand_color));
      }
    }
  }

  if(version === "basic") {
    return out;
  } else {
    return [targets, others];
  }
}

function makeRandomStimulus(version, block_size, polarity, is_true, distribution, target_shape, target_color, shapes, colors) {

  if(version === "basic") {
    var out = [];
  } else {
    var targets = [];
    var others = [];
  }

  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);

  if(((polarity === "positive" || polarity === "ncolor-negative") && is_true) || (polarity === "negative" && !is_true)) {
    for(var i = 0; i < distribution.targets / block_size; i++) {
      if(version === "basic") {
        out.push(makeShapeBlock(block_size, target_shape, target_color));
      } else {
        targets.push(makeShapeBlock(block_size, target_shape, target_color));
      }
    }
  }
  else if((polarity === "negative" && is_true) || (polarity === "positive" && !is_true)) {
    var rand_color = jsPsych.randomization.sample(colors, 1, false);
    if(version === "basic") {
      out.push(makeShapeBlock(block_size, target_shape, rand_color));
    } else {
      targets.push(makeShapeBlock(block_size, target_shape, target_color));
    }
  }

  var extended_colors = [];
  for(var i=0; i < distribution.color_ntarget; i++) {
    extended_colors.push(target_color);
  }
  for(var i=0; i < distribution.other; i++) {
    extended_colors.push(jsPsych.randomization.sample(colors, 1, false));
  }

  var shuffled_colors = jsPsych.randomization.shuffle(extended_colors);
  for(var i=0; i < (distribution.color_ntarget + distribution.other) / 3; i++) {
    var rand_shape = shuffled_shapes.pop();

    var temp = [];
    for(var j=0; j<3; j++) {
      var rand_color = shuffled_colors.pop();
      temp.push(rand_shape + '_' + rand_color);
    }
    if(version === "basic") {
      out.push(temp);
    } else {
      others.push(temp);
    }
  }

  if(version === "basic") {
    return out;
  } else {
    return [targets, others];
  }
}

function createTrials(trials, params, is_practice) {

  var block = [];
  var version = params.version;
  var shape_factors = params.color_conditions[params.color_condition];

  _.each(trials, function(trial, i) {

    var prompt;
    var stimulus;

    var polarity = trial[0].polarity;
    var is_true = trial[0].is_true;
    var distribution = trial[0].distribution;
    var coloring = trial[0].coloring == undefined ? 'none' : trial[0].coloring;

    var target_color;
    var target_shape;

    if(version.includes("question")) {
      target_color = trial[0].color;
      if(params.condition === 'N/A' || is_practice) {
        target_shape = distribution.shapes.pop();
      }
      else {
        target_shape = trial[1].shape;
      }
    } else {
      target_color = trial[1].color;
      target_shape = trial[1].shape;
    }

    var shapes_no_target = _.without(shape_factors.shapes, target_shape);
    var colors_no_target = _.without(shape_factors.colors, target_color);

    if(polarity === "ncolor-negative") {

      var false_color = jsPsych.randomization.sample(colors_no_target, 1, false)[0];
      var colors_no_false = _.without(colors_no_target, false_color);

      if(version === "basic") {
        stimulus = makeSingleStimulus(version, params.block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes_no_target, colors_no_false);
      } else {
        stimulus = makeSpacedStimulus(version, params.block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes_no_target, colors_no_false);
      }

      prompt = makePrompt(version, polarity, params.condition, target_shape, false_color);

    } else {

      if(version === "basic") {
        stimulus = makeSingleStimulus(version, params.block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes_no_target, colors_no_target);
      } else {
        stimulus = makeSpacedStimulus(version, params.block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes_no_target, colors_no_target, is_practice);
      }

      if(is_practice && !version.includes("question")) {
        prompt = makePracticePrompt(trial[0].type, target_shape, target_color, is_true, distribution);
      } else {
        prompt = makePrompt(version, polarity, params.condition, target_shape, target_color);
      }
    }

    var instructions;
    switch(version) {
      case "masked":
        instructions = '<p class="text-center">Look at these shapes. Some shapes (marked by a dashed outline) might be hidden. On the next screen you will answer a question about the color of some other shapes.</p><p class="text-center">Press the <strong>space bar</strong> to proceed.</p>';
        break;
      case "spaced":
        instructions = '<p class="text-center">Look at the colors of these shapes. On the next screen you will answer a question about the color of some other shapes.</p><p class="text-center">Press the <strong>space bar</strong> to proceed.</p>';
        break;
      case "question-yn":
        instructions = '<p class="text-center large">Look at these ' + target_shape + 's. On the next screen you will see another ' + target_shape + '.</p><p class="text-center large">Do you think the next ' + target_shape + ' will be ' + target_color + '?</p>';
        break;
      case "question-rb":
        instructions = '<p class="text-center large">Look at these ' + target_shape + 's. On the next screen you will see another ' + target_shape + '.</p><p class="text-center large">What color do you think the next ' + target_shape + ' will be?</p>';
        break;
      default:
        instructions = '<p class="text-center">Look at these shapes. On the next screen you will answer a question.</p><p class="text-center">Press the <strong>space bar</strong> to proceed.</p>';
    }

    if(version === "basic") {
      block_data = {
        shape0: stimulus.stimulus_list[0],
        shape1: stimulus.stimulus_list[1],
        shape2: stimulus.stimulus_list[2],
        shape3: stimulus.stimulus_list[3],
        shape4: stimulus.stimulus_list[4],
        shape5: stimulus.stimulus_list[5],
        shape6: stimulus.stimulus_list[6],
        shape7: stimulus.stimulus_list[7],
        shape8: stimulus.stimulus_list[8],
        shape9: stimulus.stimulus_list[9],
        shape10: stimulus.stimulus_list[10],
        shape11: stimulus.stimulus_list[11]
      }
    } else {
      block_data = {
        shape0: stimulus.others_list[0],
        shape1: stimulus.others_list[1],
        shape2: stimulus.others_list[2],
        shape3: stimulus.others_list[3],
        shape4: stimulus.others_list[4],
        shape5: stimulus.others_list[5],
        shape6: stimulus.others_list[6],
        shape7: stimulus.others_list[7],
        shape8: stimulus.others_list[8],
        shape9: stimulus.targets_list[0],
        shape10: stimulus.targets_list[1],
        shape11: stimulus.targets_list[2]
      };
    }

    trial_data = {
      prompt: prompt,
      trial_num: i,
      stimulus: '',
      is_practice: is_practice,
      target_shape: target_shape,
      target_color: target_color,
      ratio: distribution.tag,
      coloring: coloring,
      polarity: (polarity == "positive"? "Pos" : "Neg"),
      is_true: (is_true? "T" : "F")
    };

    _.extend(block_data, trial_data);

    var on_finish = undefined;
    if((i+1) % 8 == 0) {
      on_finish = function() {
        saveData(jsPsych.data.dataAsCSV(), dataRef);
      }
    }
    if(i + 1 == trials.length && !is_practice) {
      on_finish = function() {
        saveData(jsPsych.data.dataAsCSV(), dataRef);
        addWorker(params.workerId, "negation-study");
      }
    }

    var mini_timeline = [];

    if(i != 0 && i != 30 && i % 10 == 0) {
      block.push({
        type: 'single-stim',
        is_html: true,
        stimulus: '<p class="text-center">You will now take a short break. Please do not leave your computer. The task will start again in 10 seconds.</p>',
        response_ends_trial: false,
        timing_response: 15000,
        timing_post_trial: 0
      });
      block.push({
        type: 'single-stim',
        is_html: true,
        stimulus: '<p class="text-center">The break is now over. To continue, press the <strong>space bar</strong>.</p>',
        response_ends_trial: true,
        choices: [' '],
        timing_response: -1
      });
    }

    if(version === "basic") {

      block.push({
        type: 'single-stim',
        is_html: true,
        stimulus: '<p class="text-center">' + stimulus.stimulus_string + '</p>',
        response_ends_trial: false,
        timing_response: 3000,
        timing_post_trial: 0
      });

      block.push({
        type: "button-response",
        is_html: true,
        prompt: '<p class="text-center large">"' + prompt + '"</p>',
        stimulus: '<p class="text-center">' + stimulus.stimulus_string + '</p>',
        stimuli: stimulus.stimulus_list,
        choices: ['True', 'False'],
        on_finish: on_finish,
        data: block_data
      });

    } else {

      if(version.includes('question')) {
        if(is_practice) {
          mini_timeline.push({
            type: 'button-response',
            is_html: true,
            stimulus: '<p class="text-center">' + stimulus.others_string + '</p>',
            prompt: instructions,
            timing_response: -1,
            choices: ['yellow', 'orange'],
            timing_post_trial: 0,
            data: block_data
          });
        } else {
          mini_timeline.push({
            type: 'button-response',
            is_html: true,
            stimulus: '<p class="text-center">' + stimulus.others_string + '</p>',
            prompt: instructions,
            timing_response: -1,
            choices: params.choices,
            timing_post_trial: 0,
            data: block_data
          });
        }
      } else {
        mini_timeline.push({
          type: 'single-stim',
          is_html: true,
          stimulus: '<p class="text-center">' + stimulus.others_string + '</p>',
          prompt: instructions,
          response_ends_trial: true,
          timing_response: -1,
          choices: [' '],
          timing_post_trial: 0,
          data: block_data
        });
      }

      mini_timeline.push({
        type: "button-response",
        is_html: true,
        prompt: '<p class="text-center large">' + prompt + '</p>',
        stimulus: '<p class="text-center">' + stimulus.targets_string + '</p>',
        stimuli: stimulus.stimulus_list,
        choices: ['True', 'False'],
        on_finish: on_finish,
        data: block_data
      });
    }

    if(is_practice) {
      if(version.includes("question")) {
        mini_timeline.push({
          type: 'text',
          cont_key: [' '],
          text: function() {
            var data = jsPsych.data.getLastTrialData();
            if((data.button_pressed === "True" && data.is_true === "T") || (data.button_pressed === "False" && data.is_true === "F"))
              return '<p class="text-center">Correct!</p><p class="text-center">To repeat, if the content of the sentence is compatible with what the images show, then it is "True"; otherwise it is "False".</p><p class="text-center">The real experiment will now begin. Press the <strong>space bar</strong> to continue.</p>';
            else {
              var correct_answer = data.is_true === "T" ? "true" : "false";
              return '<p class="text-center">Oops! That\'s not correct.</p><p class="text-center">Press the <strong>space bar</strong> to try the question again.</p>';
            }
          },
          data: function() {
            var data = jsPsych.data.getLastTrialData();
            if((data.button_pressed === "True" && data.is_true === "T") || (data.button_pressed === "False" && data.is_true === "F")) {
              return({correct:1});
            } else {
              return({correct:0});
            }
          }
        });
      } else {
        mini_timeline.push({
          type: 'text',
          cont_key: [' '],
          text: function() {
            var data = jsPsych.data.getLastTrialData();
            if((data.button_pressed === "True" && data.is_true === "T") || (data.button_pressed === "False" && data.is_true === "F"))
              return '<p class="text-center">Correct!</p><p class="text-center"><p class="text-center">Press the <strong>space bar</strong> to continue.</p>';
            else {
              var correct_answer = data.is_true === "T" ? "true" : "false";
              return '<p class="text-center">Oops! That\'s not correct.</p><p class="text-center">Press the <strong>space bar</strong> to try the question again.</p>';
            }
          },
          data: function() {
            var data = jsPsych.data.getLastTrialData();
            if((data.button_pressed === "True" && data.is_true === "T") || (data.button_pressed === "False" && data.is_true === "F")) {
              return({correct:1});
            } else {
              return({correct:0});
            }
          }
        });
      }
      block.push({
        timeline: mini_timeline,
        loop_function: function (){
          var data = jsPsych.data.getLastTrialData();
          return !data.correct;
        }
      });
    } else {
      block = block.concat(mini_timeline);
    }
  });

  return block;
}
