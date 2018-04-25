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
function makeSpacedStimulus(version, condition, block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes, colors, is_practice) {

  // In this stimulus type, there are two displays.
  // One display is targets only; the other consists of all other shapes.
  var targets_buffer = "";
  var others_buffer = "";

  // Generate a set of colored shapes based on coloring type
  var stimulus_list = [];
  if(coloring === "random") {
    stimulus_list = makeRandomStimulus(version, block_size, polarity, is_true, distribution, target_shape, target_color, shapes, colors);
  } else {
    stimulus_list = makeCategoricalStimulus(version, condition, block_size, polarity, is_true, distribution, target_shape, target_color, shapes, colors, is_practice);
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
  if(version.includes('question') || version === '2display') {
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
    var rand_color = jsPsych.randomization.sampleWithoutReplacement(colors, 1);
    out.push(shape + '_' + rand_color);
  }
  return out;
}

function makeCategoricalStimulus(version, condition, block_size, polarity, is_true, distribution, target_shape, target_color, shapes, colors, is_practice) {

  if(version === "basic") {
    var out = [];
  } else {
    var targets = [];
    var others = [];
  }

  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);
  var shuffled_colors = jsPsych.randomization.shuffle(colors);

  if(is_practice && version.includes('question')) {
    shuffled_colors = jsPsych.randomization.shuffle(['orange','orange', 'orange', 'orange','orange', 'orange']);
  }

  if(((polarity === "positive" || polarity === "ncolor-negative") && is_true) || (polarity === "negative" && !is_true)) {
    if(version.includes('question') || condition === '1shape') {
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
    if(version.includes('question') || condition === '1shape') {
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

  if(version.includes('question') || condition === '1shape') {
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
    var rand_color = jsPsych.randomization.sampleWithoutReplacement(colors, 1);
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
    extended_colors.push(jsPsych.randomization.sampleWithoutReplacement(colors, 1));
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
  var condition = params.condition;
  var shapes = params.shape_factors[params.color_condition].shape;
  var colors = params[params.color_condition].colors;

  _.each(trials, function(trial, i) {

    var prompt;
    var stimulus;

    var polarity = trial.polarity;
    var distribution = trial.distribution;

    var is_true = trial.is_true == undefined? trial.distribution.is_true.pop() : trial.is_true;
    var coloring = trial.coloring == undefined ? 'none' : trial.coloring;

    var target_color;
    var target_shape;

    if(!is_practice) {
      var shape_factors = _.find(params.factors.distribution, function(dist){ return dist.tag === distribution.tag}).shape_factors;
      var shape_color = _.filter(shape_factors, function(factor) {return factor.color === trial.color}).pop();
      _.find(params.factors.distribution, function(dist){ return dist.tag === distribution.tag}).shape_factors = _.without(shape_factors, shape_color);

      target_shape = shape_color.shape;
      target_color = shape_color.color;
    } else {
      target_shape = distribution.shapes.pop();
      target_color = trial.color;
    }

    var shapes_no_target = _.without(shapes, target_shape);
    var colors_no_target = _.without(colors, target_color);

    if(version === "basic") {
      if(polarity === "ncolor-negative") {

        var false_color = jsPsych.randomization.sampleWithoutReplacement(colors_no_target, 1)[0];
        var colors_no_false = _.without(colors_no_target, false_color);

        stimulus = makeSingleStimulus(version, params.block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes_no_target, colors_no_false);
        prompt = makePrompt(version, polarity, params.condition, target_shape, false_color);

      } else {
        stimulus = makeSingleStimulus(version, params.block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes_no_target, colors_no_target);
        if(is_practice) {
          prompt = makePracticePrompt(trial.type, target_shape, target_color, is_true, distribution);
        } else {
          prompt = makePrompt(version, polarity, params.condition, target_shape, target_color);
        }
      }
    } else { // 2display, 2question, etc.
      stimulus = makeSpacedStimulus(version, condition, params.block_size, polarity, is_true, distribution, coloring, target_shape, target_color, shapes_no_target, colors_no_target, is_practice);
      if(is_practice && (!version.includes("question") && condition != '1shape')) {
        prompt = makePracticePrompt(trial.type, target_shape, target_color, is_true, distribution);
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
        instructions = '<p class="text-center">Look at these ' + target_shape + 's. On the next screen you see another ' + target_shape + '.</p><p class="text-center"><i>Please wait...<i></p>';
    }

    if(version === "basic") {
      block_data = {
        context1: stimulus.stimulus_list[0],
        context2: stimulus.stimulus_list[1],
        context3: stimulus.stimulus_list[2],
        context4: stimulus.stimulus_list[3],
        context5: stimulus.stimulus_list[4],
        context6: stimulus.stimulus_list[5],
        context7: stimulus.stimulus_list[6],
        context8: stimulus.stimulus_list[7],
        context9: stimulus.stimulus_list[8],
        target1: stimulus.stimulus_list[9],
        target2: stimulus.stimulus_list[10],
        target3: stimulus.stimulus_list[11]
      }
    } else {
      block_data = {
        context1: stimulus.others_list[0],
        context2: stimulus.others_list[1],
        context3: stimulus.others_list[2],
        context4: stimulus.others_list[3],
        context5: stimulus.others_list[4],
        context6: stimulus.others_list[5],
        context7: stimulus.others_list[6],
        context8: stimulus.others_list[7],
        context9: stimulus.others_list[8],
        target1: stimulus.targets_list[0],
        target2: stimulus.targets_list[1],
        target3: stimulus.targets_list[2]
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
    }

    _.extend(block_data, trial_data);

    var on_finish = undefined;
    if((i+1) % 8 == 0) {
      on_finish = function() {
        saveData(jsPsych.data.get().csv(), dataRef);
      }
    }
    if(i + 1 == trials.length && !is_practice) {
      on_finish = function() {
        saveData(jsPsych.data.get().csv(), dataRef);
        addWorker(params.workerId, "negation-study");
      }
    }

    var mini_timeline = [];

    if(i != 0 && i != 30 && i % 10 == 0) {
      block.push({
        type: 'html-keyboard-response',
        stimulus: '<p class="text-center">You will now take a short break. Please do not leave your computer. The task will start again in 10 seconds.</p>',
        response_ends_trial: false,
        trial_duration: 15000,
        post_trial_gap: 0
      });
      block.push({
        type: 'instructions',
        pages: ['<p class="text-center">The break is now over. To continue, <strong>click the button below</strong>.</p>'],
        allow_backward: false,
        key_forward: " ",
        button_label_next: "Continue",
        show_clickable_nav: true
      });
    }

    if(version === "basic") {

      block.push({
        type: 'html-keyboard-response',
        is_html: true,
        stimulus: '<p class="text-center">' + stimulus.stimulus_string + '</p>',
        response_ends_trial: false,
        trial_duration: 3000,
        post_trial_gap: 0
      });

      block_data.choices = ['True', 'False'];

      block.push({
        type: "html-button-response",
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
          if(version === "question-rb") {
            var practice_choices_temp = ['Yellow', 'Orange']
          }
          else {
            var practice_choices_temp = ['Yes', 'No']
          }

          block_data.choices = practice_choices_temp;

          block.push({
            type: 'html-button-response',
            is_html: true,
            stimulus: '<p class="text-center">' + stimulus.others_string + '</p><p class="text-center">' + instructions + '</p>',
            choices: practice_choices_temp,
            post_trial_gap: 0,
            data: block_data
          });
        } else {
          block_data.choices = params.choices;
          block.push({
            type: 'html-button-response',
            is_html: true,
            stimulus: '<p class="text-center">' + stimulus.others_string + '</p><p class="text-center">' + instructions + '</p>',
            choices: params.choices,
            post_trial_gap: 0,
            data: block_data
          });
        }
      } else {
        block.push({
          type: 'html-keyboard-response',
          is_html: true,
          stimulus: '<p class="text-center">' + stimulus.others_string + '</p><p class="text-center">' + instructions + '</p>',
          response_ends_trial: false,
          post_trial_gap: 0,
          trial_duration: 4500,
          data: block_data
        });
      }

      block_data.choices = ['True', 'False'];

      mini_timeline.push({
        type: "html-button-response",
        is_html: true,
        stimulus: '<p class="text-center">' + stimulus.targets_string + '</p><p class="text-center large">' + prompt + '</p>',
        stimuli: stimulus.stimulus_list,
        choices: ['True', 'False'],
        on_finish: on_finish,
        data: block_data
      });
    }

    if(is_practice) {
      if(version.includes("question")) {
        mini_timeline.push({
          type: 'instructions',
          "key_forward": " ",
          "show_clickable_nav": true,
          "allow_backward": false,
          "button_label_next": function() {
            var data = jsPsych.data.getLastTrialData().values()[0];
            if((data.button_pressed === "0" && data.is_true === "T") || (data.button_pressed === "1" && data.is_true === "F"))
              return "Begin experiment";
            else {
              var correct_answer = data.is_true === "T" ? "true" : "false";
              return "Try again";
            }
          },
          pages: function() {
            var data = jsPsych.data.getLastTrialData().values()[0];
            if((data.button_pressed === "0" && data.is_true === "T") || (data.button_pressed === "1" && data.is_true === "F"))
              return ['<p class="text-center">Correct!</p><p class="text-center">To repeat, if the content of the sentence is compatible with what the images show, then it is "True"; otherwise it is "False".</p><p class="text-center">Press <strong>click the button below</strong> to continue.</p>'];
            else {
              return ['<p class="text-center">Oops! That\'s not correct.</p><p class="text-center">Please <strong>click the button below</strong> to try the question again.</p>'];
            }
          },
          data: function() {
            var data = jsPsych.data.getLastTrialData().values()[0];
            if((data.button_pressed === "0" && data.is_true === "T") || (data.button_pressed === "1" && data.is_true === "F")) {
              return({correct:1});
            } else {
              return({correct:0});
            }
          }
        });
      } else {
        mini_timeline.push({
          type: 'instructions',
          "key_forward": " ",
          "show_clickable_nav": true,
          "allow_backward": false,
          pages: function() {
            var data = jsPsych.data.getLastTrialData().values()[0];
            if((data.button_pressed === "0" && data.is_true === "T") || (data.button_pressed === "1" && data.is_true === "F"))
              return ['<p class="text-center">Correct!</p><p class="text-center"><p class="text-center">Please <strong>click the button below</strong> to continue.</p>'];
            else {
              var correct_answer = data.is_true === "T" ? "true" : "false";
              return ['<p class="text-center">Oops! That\'s not correct.</p><p class="text-center">Please <strong>click the button below</strong> to try the question again.</p>'];
            }
          },
          data: function() {
            var data = jsPsych.data.getLastTrialData().values()[0];
            if((data.button_pressed === "0" && data.is_true === "T") || (data.button_pressed === "1" && data.is_true === "F")) {
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
          var data = jsPsych.data.getLastTrialData().values()[0];
          return !data.correct;
        }
      });
    } else {
      block = block.concat(mini_timeline);
    }
  });

  return block;
}
