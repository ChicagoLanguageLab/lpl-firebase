function NegationExperiment(params) {
  console.log(params);

  var timeline = [];

  this.createTimeline = function() {

    var trials = jsPsych.randomization.factorial(params.blocked_factors, 1);//.concat(jsPsych.randomization.factorial(params.nblocked_factors, 1)).concat(jsPsych.randomization.factorial(params.ncolor_blocked_factors, 1));
    console.log(trials);
    var shapes = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.shape_factors, 1), 32, true);

    trials = _.zip(trials, shapes);

    _.each(trials, function(trial, i) {

      var prompt;
      var stimulus;

      if(trial[0].polarity === "ncolor-negative") {
        var false_color = jsPsych.randomization.sample(_.without(params.shape_factors.color, trial[1].color), 1, false)[0];
        stimulus = makeStimulus(params.block_size, trial[0].polarity, trial[0].is_true, trial[0].distribution, trial[0].coloring, trial[1].shape, trial[1].color, _.without(params.shape_factors.shape, trial[1].shape), _.without(params.shape_factors.color, trial[1].color, false_color));
        prompt = makePrompt(trial[0].polarity, params.condition, trial[1].shape, false_color);
      }
      else {
        stimulus = makeStimulus(params.block_size, trial[0].polarity, trial[0].is_true, trial[0].distribution, trial[0].coloring, trial[1].shape, trial[1].color, _.without(params.shape_factors.shape, trial[1].shape), _.without(params.shape_factors.color, trial[1].color));
        prompt = makePrompt(trial[0].polarity, params.condition, trial[1].shape, trial[1].color);
      }

      timeline.push({
        type: "single-stim",
        is_html: true,
        prompt: '<p class="text-center">' + prompt + '</p><p class="text-center">This is a ' + trial[0].is_true + ', ' + trial[0].polarity + ' ' + trial[1].color + ' ' + trial[1].shape + ' trial, with ' + trial[0].distribution.tag + ' and ' + trial[0].coloring + ' coloring of the remaining objects (if applicable).' + '</p>',
        stimulus: '<p class="text-center">' + stimulus + '</p>',
        choices: [' '],
        data: {
          target_shape: trial[1].shape,
          target_color: trial[1].color,
          polarity: (trial[0].polarity == "positive"? "Pos" : "Neg"),
          is_true: (trial[0].is_true? "T" : "F"),
          ratio: trial[0].distribution.tag,
          coloring: trial[0].coloring
        }
      });
    });
  }

  this.getTimeline = function() {
    return timeline;
  }

};

function makeStimulus(block_size, polarity, is_true, distribution, correlation, shape, color, shapes, colors) {
  var buffer = "";
  var trial_shapes = [];
  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);

  if(correlation === "categorical")
    trial_shapes = makecategoricalomTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors);
  else
    trial_shapes = makeRandomTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors);

  var header = ' <img src="resources/images/';
  var footer = '.png" width="50px" />';

  trial_shapes = _.flatten(jsPsych.randomization.shuffle(trial_shapes));

  _.each(trial_shapes, function(trial) {
    buffer += header + trial + footer;
  });

  return buffer;
}

function makePrompt(polarity, intensity, shape, color) {
  if(polarity === "positive") {
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

function makecategoricalomTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors) {
  var out = [];

  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);
  var shuffled_colors = jsPsych.randomization.shuffle(colors);

  if(((polarity === "positive" || polarity === "ncolor-negative") && is_true) || (polarity === "negative" && !is_true)) {
    for(var i = 0; i < distribution.targets / block_size; i++)
      out.push(makeShapeBlock(block_size, shape, color));
  }
  else if((polarity === "negative" && is_true) || (polarity === "positive" && !is_true)) {
    var rand_color = shuffled_colors.pop();
    for(var i = 0; i < distribution.targets / block_size; i++) {
      out.push(makeShapeBlock(block_size, shape, rand_color));
    }
  }

  for(var i = 0; i < distribution.color_ntarget / block_size; i++) {
    var rand_shape = shuffled_shapes.pop();
    out.push(makeShapeBlock(block_size, rand_shape, color));
  }
  for(var i = 0; i < distribution.other / block_size; i++) {
    var rand_shape = shuffled_shapes.pop();
    var rand_color = shuffled_colors.pop();
    out.push(makeShapeBlock(block_size, rand_shape, rand_color));
  }

  return out;
}

function makeRandomTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors) {
  var out = [];

  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);

  if(((polarity === "positive" || polarity === "ncolor-negative") && is_true) || (polarity === "negative" && !is_true)) {
    for(var i = 0; i < distribution.targets / block_size; i++)
      out.push(makeShapeBlock(block_size, shape, color));
  }
  else if((polarity === "negative" && is_true) || (polarity === "positive" && !is_true)) {
    var rand_color = jsPsych.randomization.sample(colors, 1, false);
    out.push(makeShapeBlock(block_size, shape, rand_color));
  }

  var extended_colors = [];
  for(var i=0; i < distribution.color_ntarget; i++)
    extended_colors.push(color);
  for(var i=0; i < distribution.other; i++)
    extended_colors.push(jsPsych.randomization.sample(colors, 1, false));

  console.log(extended_colors);
  var shuffled_colors = jsPsych.randomization.shuffle(extended_colors);
  console.log(shuffled_colors);

  for(var i=0; i < (distribution.color_ntarget + distribution.other) / 3; i++) {
    var rand_shape = shuffled_shapes.pop();



    var temp = [];
    for(var j=0; j<3; j++) {
      var rand_color = shuffled_colors.pop();
      temp.push(rand_shape + '_' + rand_color);
    }
    out.push(temp);
  }

  return out;
}
