function NegationExperiment(params) {

  var timeline = [];
  var id = params.workerId;
  var condition = params.condition;
  var color_condition = params.color_condition;

  this.getSubjectId = function() {
    return id;
  }

  this.addPropertiesTojsPsych = function () {
    jsPsych.data.addProperties({
      workerId: id,
      condition: condition,
      color_condition: color_condition
    });
  }

  this.getTimeline = function() {
    return timeline;
  }

  var initPreamble = function() {
    var preamble = params.preamble;

    preamble.consent_check.conditional_function = function() {
      var data = jsPsych.data.getLastTrialData();
      return !data.consented;
    }

    timeline = timeline.concat([preamble.intro, preamble.consent, preamble.consent_check, preamble.demographics, preamble.post_demographics]);
  }

  var initPractice = function() {
    var trials = jsPsych.randomization.factorial(params.practice_factors, 1);

    if(params.color_condition === "2color") {
      var shapes = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.shape_factors_2color, 1), 4, true);
    }
    else {
      var shapes = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.shape_factors, 1), 4, true);
    }
    trials = _.zip(trials, shapes);

    timeline = timeline.concat(createTrials(trials, params, true));
  }

  var initTrials = function() {
    var trials = jsPsych.randomization.factorial(params.blocked_factors, 1);

    if(params.color_condition === "2color") {
      var shapes = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.shape_factors_2color, 1), 32, true);
    }
    else {
      var shapes = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.shape_factors, 1), 32, true);
    }

    trials = _.zip(trials, shapes);

    timeline = timeline.concat(createTrials(trials, params, false));

    timeline.push({
      type: 'text',
      cont_key: [''],
      text: function(){
          var code = 'TURK' + jsPsych.randomization.randomID(10);

          jsPsych.data.addProperties({
            code: code
          });

          return '<p class="lead">You have finished the experiment! Your responses have been saved.</p>' +
                  '<p>Your survey code is <b>' + code + '</b>. Please enter this code into your HIT. ' +
                  `You may then close this window.</p><p>If you have any questions or concerns,
                    please do not hesitate to contact the lab at
                    <a href='mailto:uchicagolanglab@gmail.com'>uchicagolanglab@gmail.com</a>.
                  </p>`;
      }
    });
  }

  this.createTimeline = function() {
    initPreamble();
    initPractice();

    timeline.push({
      type: 'text',
      cont_key: [' '],
      text: '<p class="lead">You have finished the practice section.</p><p>The real task will now begin. You will not receive feedback on your responses during this part of the study, but your accuracy will be recorded.</p><p>Press the <strong>space bar</strong> when you are ready to begin.</p>'
    });

    initTrials();
  }
};

function makeStimulus(block_size, polarity, is_true, distribution, correlation, shape, color, shapes, colors) {
  var targets_buffer = "";
  var others_buffer = "";

  var trial_shapes = [];
  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);

  if(correlation === "categorical")
    trial_shapes = makeCategoricalTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors);
  else
    trial_shapes = makeRandomTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors);

  var header = '<img src="resources/images/';
  var footer = '.png" width="50px" />';

  targets = _.flatten(trial_shapes[0]);
  others = _.flatten(jsPsych.randomization.shuffle(trial_shapes[1]));

  _.each(targets, function(trial) {
    targets_buffer += ' ';
    targets_buffer += header + trial + footer;
  });

  _.each(others, function(trial) {
    others_buffer += ' ';
    others_buffer += header + trial + footer;
  });

  return ({
    targets_string: targets_buffer,
    others_string: others_buffer,
    targets_list: targets,
    others_list: others
  });
}

function makePracticePrompt(type, shape, color, is_true, distribution) {
  if (is_true) {
    if(type === 'number') {
      return "There are " + distribution.targets + " " + shape + "s."
    }
    else {
      return "There are " + distribution.targets + " " + color + " " + shape + "s."
    }
  }
  else {
    if(type === 'number') {
      var number = Math.floor(Math.random() * 9 + 2);
      while (number == distribution.targets) {
        number = Math.floor(Math.random() * 9 + 2);
      }
      return "There are " + number + " " + shape + "s."
    }
    else {
      return "There are " + distribution.targets + " " + color + " " + shape + "s."
    }
  }
}

function makePrompt(polarity, intensity, shape, color) {
  if (polarity === "positive") {
    if(intensity === "reg")
      return "The " + shape + "s are " + color + ".";
    else
      return "All of the " + shape + "s are " + color + ".";
  }
  else {
    if(intensity === "reg")
      return "The " + shape + "s are not " + color + ".";
    else
      return "None of the " + shape + "s are " + color + ".";
  }
}

function makeShapeBlock(num_shapes, shape, color) {
  var out = [];
  for(var i=0; i<num_shapes; i++) {
    out.push(shape + '_' + color);
  }
  return out;
}

function makeRandomShapeBlock(num_shapes, shape, colors) {
  var out = [];
  for(var i=0; i<num_shapes; i++) {
    var rand_color = jsPsych.randomization.sample(colors, 1, false);
    out.push(shape + '_' + rand_color);
  }
  return out;
}

function makeCategoricalTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors) {
  var other = [];
  var targets = [];

  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);
  var shuffled_colors = jsPsych.randomization.shuffle(colors);

  if(((polarity === "positive" || polarity === "ncolor-negative") && is_true) || (polarity === "negative" && !is_true)) {
    for(var i = 0; i < distribution.targets / block_size; i++)
      targets.push(makeShapeBlock(block_size, shape, color));
  }
  else if((polarity === "negative" && is_true) || (polarity === "positive" && !is_true)) {
    var rand_color = shuffled_colors.pop();
    for(var i = 0; i < distribution.targets / block_size; i++) {
      targets.push(makeShapeBlock(block_size, shape, rand_color));
    }
  }

  for(var i = 0; i < distribution.color_ntarget / block_size; i++) {
    var rand_shape = shuffled_shapes.pop();
    other.push(makeShapeBlock(block_size, rand_shape, color));
  }
  for(var i = 0; i < distribution.other / block_size; i++) {
    var rand_shape = shuffled_shapes.pop();
    var rand_color = shuffled_colors.pop();
    other.push(makeShapeBlock(block_size, rand_shape, rand_color));
  }

  return (targets, other);
}

function makeRandomTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors) {
  var targets = [];
  var others = [];

  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);

  if(((polarity === "positive" || polarity === "ncolor-negative") && is_true) || (polarity === "negative" && !is_true)) {
    for(var i = 0; i < distribution.targets / block_size; i++)
      targets.push(makeShapeBlock(block_size, shape, color));
  }
  else if((polarity === "negative" && is_true) || (polarity === "positive" && !is_true)) {
    var rand_color = jsPsych.randomization.sample(colors, 1, false);
    targets.push(makeShapeBlock(block_size, shape, rand_color));
  }

  var extended_colors = [];
  for(var i=0; i < distribution.color_ntarget; i++)
    extended_colors.push(color);
  for(var i=0; i < distribution.other; i++)
    extended_colors.push(jsPsych.randomization.sample(colors, 1, false));

  var shuffled_colors = jsPsych.randomization.shuffle(extended_colors);
  for(var i=0; i < (distribution.color_ntarget + distribution.other) / 3; i++) {
    var rand_shape = shuffled_shapes.pop();

    var temp = [];
    for(var j=0; j<3; j++) {
      var rand_color = shuffled_colors.pop();
      temp.push(rand_shape + '_' + rand_color);
    }
    others.push(temp);
  }

  return (targets, other);
}

function createTrials(trials, params, isPractice) {
  var block = [];

  _.each(trials, function(trial, i) {

    var prompt;
    var stimulus;

    if(trial[0].polarity === "ncolor-negative") {

      if(params.color_condition === "2color") {
        var false_color = jsPsych.randomization.sample(_.without(params.shape_factors_2color.color, trial[1].color), 1, false)[0];
        stimulus = makeStimulus(params.block_size, trial[0].polarity, trial[0].is_true, trial[0].distribution, trial[0].coloring, trial[1].shape, trial[1].color, _.without(params.shape_factors_2color.shape, trial[1].shape), _.without(params.shape_factors_2color.color, trial[1].color, false_color));
      }
      else {
        var false_color = jsPsych.randomization.sample(_.without(params.shape_factors.color, trial[1].color), 1, false)[0];
        stimulus = makeStimulus(params.block_size, trial[0].polarity, trial[0].is_true, trial[0].distribution, trial[0].coloring, trial[1].shape, trial[1].color, _.without(params.shape_factors.shape, trial[1].shape), _.without(params.shape_factors.color, trial[1].color, false_color));
      }

      prompt = makePrompt(trial[0].polarity, params.condition, trial[1].shape, false_color);
    }
    else {
      if(params.color_condition === "2color") {
        stimulus = makeStimulus(params.block_size, trial[0].polarity, trial[0].is_true, trial[0].distribution, trial[0].coloring, trial[1].shape, trial[1].color, _.without(params.shape_factors_2color.shape, trial[1].shape), _.without(params.shape_factors_2color.color, trial[1].color));
      }
      else {
        stimulus = makeStimulus(params.block_size, trial[0].polarity, trial[0].is_true, trial[0].distribution, trial[0].coloring, trial[1].shape, trial[1].color, _.without(params.shape_factors.shape, trial[1].shape), _.without(params.shape_factors.color, trial[1].color));
      }

      if(isPractice)
        prompt = makePracticePrompt(trial[0].type, trial[1].shape, trial[1].color, trial[0].is_true, trial[0].distribution);
      else
        prompt = makePrompt(trial[0].polarity, params.condition, trial[1].shape, trial[1].color);
    }

    var on_finish = undefined;
    if((i+1) % 8 == 0) {
      on_finish = function() {
        saveData(jsPsych.data.dataAsCSV(), dataRef);
      }
    }
    if(i + 1 == trials.length && !isPractice) {
      on_finish = function() {
        saveData(jsPsych.data.dataAsCSV(), dataRef);
        addWorker(params.workerId, "negation-study");
      }
    }

    // Preview 1
    block.push({
      type: 'single-stim',
      is_html: true,
      stimulus: '<p class="text-center">' + stimulus.others_string + '</p>',
      prompt: 'Look at the colors of these shapes. On the next screen you will answer a question about the color of some other shapes. Press the <strong>space bar</strong> to proceed.',
      response_ends_trial: false,
      timing_response: -1,
      choices: [' '],
      timing_post_trial: 0,
      data: {
        stimulus: '',
        isPractice: isPractice,
        target_shape: trial[1].shape,
        target_color: trial[1].color,
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
        shape11: stimulus.targets_list[2],
        ratio: trial[0].distribution.tag,
        coloring: trial[0].coloring,
        polarity: (trial[0].polarity == "positive"? "Pos" : "Neg"),
        is_true: (trial[0].is_true? "T" : "F"),
        prompt: prompt
      }
    });

    block.push({
      type: "button-response",
      is_html: true,
      prompt: '<p class="text-center large">"' + prompt + '"</p>',
      stimulus: '<p class="text-center">' + stimulus.targets_string + '</p>',
      stimuli: stimulus.stimulus_list,
      choices: ['True', 'False'],
      on_finish: on_finish,
      data: {
        stimulus: '',
        isPractice: isPractice,
        target_shape: trial[1].shape,
        target_color: trial[1].color,
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
        shape11: stimulus.targets_list[2],
        ratio: trial[0].distribution.tag,
        coloring: trial[0].coloring,
        polarity: (trial[0].polarity == "positive"? "Pos" : "Neg"),
        is_true: (trial[0].is_true? "T" : "F"),
        prompt: prompt
      }
    });

    if(isPractice) {
      block.push({
        type: 'text',
        cont_key: [' '],
        text: function() {
          var data = jsPsych.data.getLastTrialData();
          if((data.button_pressed === "True" && data.is_true === "T") || (data.button_pressed === "False" && data.is_true === "F"))
            return '<p class="text-center">Correct!</p><p class="text-center">Press the <strong>space bar</strong> to continue.</p>';
          else {
            var correct_answer = data.is_true === "T" ? "true" : "false";
            return '<p class="text-center">Oops! The correct answer was "' + correct_answer +'".</p><p class="text-center">Press the <strong>space bar</strong> to continue.</p>';
          }
        }
      });
    }
  });
  return block;
}

function preloadImages(shapes, colors) {
  var images = new Array()

  for(var i = 0; i < shapes.length; i++) {
    for (var j = 0; j < colors.length; j++) {
      images[i] = new Image()
      images[i].src = "resources/images/" + shapes[i] + "_" + colors[j] + ".png";
    }
  }
}
