function NegationExperiment(params) {
  console.log(params);

  var timeline = [];

  this.createTimeline = function() {

    var trials = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.factors, 1), 50, false);

    _.each(trials, function(trial, i) {

      var stimulus = makeStimulus(trial.polarity, trial.shape, trial.color, trial.distribution, trial.correlation, _.without(params.factors.shape, trial.shape), _.without(params.factors.color, trial.color));
      var prompt = makePrompt(trial.polarity, trial.intensity, trial.shape, trial.color);

      timeline.push({
        type: "single-stim",
        is_html: true,
        prompt: '<p class="text-center">' + prompt + '</p><p class="text-center">This is a ' + trial.polarity + ' ' + trial.color + ' ' + trial.shape + ' trial, with ' + trial.distribution.targets + ' target objets, ' + trial.distribution.color_ntarget + ' non-target objects of the target color, and ' + trial.correlation + 'om coloring of the remaining objects (if applicable).' + '</p>',
        stimulus: '<p class="text-center">' + stimulus + '</p>',
        choices: [' ']
      });
    });
  }

  this.getTimeline = function() {
    return timeline;
  }

};

function makeStimulus(polarity, shape, color, distribution, correlation, shapes, colors) {
  var buffer = "";
  var trial_shapes = [];
  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);

  if(correlation === "nonrand") {

    var shuffled_colors = jsPsych.randomization.shuffle(colors);

    if(polarity === "positive") {
      for(var i = 0; i < distribution.targets / 2; i++) {
        trial_shapes.push([shape + '_' + color, shape + '_' + color]);
      }
      for(var i = 0; i < distribution.color_ntarget / 2; i++) {
        var rand_shape = shuffled_shapes.pop();
        trial_shapes.push([rand_shape + '_' + color, rand_shape + '_' + color]);
      }
      for(var i = 0; i < distribution.other / 2; i++) {
        var rand_shape = shuffled_shapes.pop();
        var rand_color = shuffled_colors.pop();
        trial_shapes.push([rand_shape + '_' + rand_color, rand_shape + '_' + rand_color]);
      }
    }
    else {
      var rand_color = shuffled_colors.pop();
      for(var i = 0; i < distribution.targets / 2; i++) {
        trial_shapes.push([shape + '_' + rand_color, shape + '_' + rand_color]);
      }
      for(var i = 0; i < distribution.color_ntarget / 2; i++) {
        var rand_shape = shuffled_shapes.pop();
        trial_shapes.push([rand_shape + '_' + color, rand_shape + '_' + color]);
      }
      for(var i = 0; i < distribution.other / 2; i++) {
        var rand_shape = shuffled_shapes.pop();
        var rand_color = shuffled_colors.pop();
        trial_shapes.push([rand_shape + '_' + rand_color, rand_shape + '_' + rand_color]);
      }
    }
  }
  else {
    if(polarity === "positive") {
      for(var i = 0; i < distribution.targets / 2; i++) {
        trial_shapes.push([shape + '_' + color, shape + '_' + color]);
      }
      for(var i = 0; i < distribution.color_ntarget / 2; i++) {
        var rand_shape = shuffled_shapes.pop();
        trial_shapes.push([rand_shape + '_' + color, rand_shape + '_' + color]);
      }
      for(var i = 0; i < distribution.other / 2; i++) {
        var rand_shape = shuffled_shapes.pop();
        var rand_color = jsPsych.randomization.sample(colors, 1, false);
        trial_shapes.push([rand_shape + '_' + rand_color, rand_shape + '_' + rand_color]);
      }
    }
    else {
      var rand_color = jsPsych.randomization.sample(colors, 1, false);
      for(var i = 0; i < distribution.targets / 2; i++) {
        trial_shapes.push([shape + '_' + rand_color, shape + '_' + rand_color]);
      }
      for(var i = 0; i < distribution.color_ntarget / 2; i++) {
        var rand_shape = shuffled_shapes.pop();
        trial_shapes.push([rand_shape + '_' + color, rand_shape + '_' + color]);
      }
      for(var i = 0; i < distribution.other / 2; i++) {
        var rand_shape = shuffled_shapes.pop();
        var rand_color = jsPsych.randomization.sample(colors, 1, false);
        trial_shapes.push([rand_shape + '_' + rand_color, rand_shape + '_' + rand_color]);
      }
    }
  }

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
