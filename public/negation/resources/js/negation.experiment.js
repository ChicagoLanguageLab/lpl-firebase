function NegationExperiment(params) {

  var timeline = [];
  var id = params.id;

  this.getSubjectId = function() {
    return id;
  }

  this.addPropertiesTojsPsych = function () {
    jsPsych.data.addProperties({
      workerId: id
    });
  }

  this.getTimeline = function() {
    return timeline;
  }

  var initPreamble = function() {
    timeline.push({
      type: 'text',
      text: `<div class="header row">
               <div class="col-2 text-right">
                 <img class="logo" src="../shared/images/shield.png" alt="UChicago Logo"/>
               </div>
               <div class="col-10">
                 <h1>Language Processing Laboratory</h1>
                 <p class="lead">Department of Linguistics, The University of Chicago</p>
               </div>
             </div>
             <div>
               <p class="mt-4 lead">
                 Thank you for your interest in our study!
               </p>
               <p>
                 As a reminder, this study runs best in <b>Chrome</b> or <b>Firefox</b>. If you are not using one of these browers, we recommend switching now to avoid future issues. When you are ready, please proceed by pressing the  <strong>space bar</strong> .
               </p>
             </div>`,
      cont_key: [' ']
    });
    timeline.push({
      type: 'consent',
      requirements: 'You must be at least 18 years old to participate in this study. ',
      purpose: 'In this research, we are investigating the processes involved in the comprehension of sentences. ',
      procedures: 'In this study, you will be presented with sets of shapes and determine whether statements about them are true or false. ',
      time: 'about 10 minutes',
      pay: '$1 USD',
      name: 'Dr. Ming Xiang',
      address: '1115 E. 58th St., Rosenwald 205B, Chicago IL, 60637',
      phone: '(773) 702-8023',
      email: 'mxiang@uchicago.edu'
    });
    timeline.push({
      conditional_function: function() {
        var data = jsPsych.data.getLastTrialData();
        return !data.consented;
      },
      timeline: [{
        type: 'text',
        cont_key: [''],
        text: '<p class="text-center lead">Thank you for considering participation in this study!</p><p>We\'re sorry it wasn\'t for you. You may close this window and return your HIT. There is no penalty for returning our lab\'s HITs.</p>'
      }]
    },
    {
      type: 'demographics'
    },
    {
      type: 'text',
      cont_key: [' '],
      text: '<p class="lead mt-4">Thank you for deciding to participate in our study!</p><p>In this experiment, you will see a sequence of images, and a sentence. Your task is to decide whether the sentence is "true" or "false" depending on the images in front of you.</p><p>If the content of the sentence is compatible with what the images show, then it is "True"; otherwise it is "False".</p><p>To see some practice questions, please press the <strong>space bar</space>.</p>'
    });
  }

  var initPractice = function() {
    var trials = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.blocked_factors, 1), 4, false);
    var shapes = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.shape_factors, 1), 4, true);

    trials = _.zip(trials, shapes);

    timeline.push(createTrials(trials, params, true));
  }

  var initTrials = function() {
    var trials = jsPsych.randomization.factorial(params.blocked_factors, 1);
    var shapes = jsPsych.randomization.sample(jsPsych.randomization.factorial(params.shape_factors, 1), 32, true);

    trials = _.zip(trials, shapes);

    timeline.push(createTrials(trials, params, false));

    timeline.push({
      type: 'text',
      cont_key: [''],
      text: function(){
          var code = 'TURK' + jsPsych.randomization.randomID(10);

          jsPsych.data.addProperties({
            code: code
          });

          return '<p class="lead">You have finished the experiment! Your responses have been saved.</p>' +
                  '<p>Your survey code is <b>' + code + '</b>. Please enter this code into your HIT.' +
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
      text: '<p class="text-center lead">You have finished the practice section.</p><p class="text-center">Press the <strong>space bar</strong> when you are ready to begin the real task.</p>'
    });

    initTrials();
  }
};

function makeStimulus(block_size, polarity, is_true, distribution, correlation, shape, color, shapes, colors) {
  var buffer = "";
  var trial_shapes = [];
  var shuffled_shapes = jsPsych.randomization.shuffle(shapes);

  if(correlation === "categorical")
    trial_shapes = makeCategoricalTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors);
  else
    trial_shapes = makeRandomTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors);

  var header = ' <img src="resources/images/';
  var footer = '.png" width="50px" />';

  trial_shapes = _.flatten(jsPsych.randomization.shuffle(trial_shapes));

  _.each(trial_shapes, function(trial) {
    buffer += header + trial + footer;
  });

  return ({
    stimulus_string: buffer,
    stimulus_list: trial_shapes
  });
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

function makeCategoricalTrial(block_size, polarity, is_true, distribution, shape, color, shapes, colors) {
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

  var shuffled_colors = jsPsych.randomization.shuffle(extended_colors);
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

function createTrials(trials, params, isPractice) {
  var block = {
    type: "single-stim",
    timeline: []
  };

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

    var on_finish = undefined;
    if((i+1) % 8 == 0) {
      on_finish = function() {
        saveData(jsPsych.data.dataAsCSV(), dataRef);
      }
    }

    block.timeline.push({
      type: "button-response",
      is_html: true,
      prompt: '<p class="text-center large">"' + prompt + '"</p>',
      stimulus: '<p class="text-center">' + stimulus.stimulus_string + '</p>',
      choices: ['True', 'False'],
      on_finish: on_finish,
      data: {
        stimulus: '',
        isPractice: isPractice,
        target_shape: trial[1].shape,
        target_color: trial[1].color,
        polarity: (trial[0].polarity == "positive"? "Pos" : "Neg"),
        is_true: (trial[0].is_true? "T" : "F"),
        ratio: trial[0].distribution.tag,
        coloring: trial[0].coloring,
        prompt: prompt,
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
    });

    if(isPractice) {
      block.timeline.push({
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
