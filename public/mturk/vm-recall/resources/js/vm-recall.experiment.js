/** Construct an instance of the BasicExperiment class.
  * @constructor
  * @param {Object} params - The experiment parameters from URL data and/or your data.json file.
  */
function VmRecallExperiment(params) {

  /** Hold the trials, instructions, etc. that make up the experiment.
   * @type {Array<object>}
   */
  var timeline = [];

  /** The current subject.
   * @type {object}
   * @param {string} id - The subject's Worker ID or SONA subject number.
  */
  var subject = { //NOTE: Add more subject parameters here if needed.
    id: params.workerId
  }

  var version = params.version;

  /** Return the subject's ID.
   * @returns {string} - The subject's Worker ID or SONA subject number.
  */
  this.getSubjectId = function() {
    return subject.id;
  }

  /** Return the experiment timeline.
   * @returns {array} - The experiment timeline.
  */
  this.getTimeline = function() {
    return timeline;
  }

  /** Add data to jsPsych's internal representation of the experiment. Can be called at any time.
  */
  this.addPropertiesTojsPsych = function () {
    jsPsych.data.addProperties({
      workerId: subject.id,
      version: version
    });
  }

  /** Initialize and append the default preamble to the timeline. This includes a generic intro page, consent form, and demographic questionnaire. Values for some of these are altered via the JSON file.
  */
  var initPreamble = function() {
    var preamble = params.preamble;

    preamble.consent_check.conditional_function = function() {
      var data = jsPsych.data.getLastTrialData();
      return !data.consented;
    }

    timeline = timeline.concat([preamble.intro, preamble.consent, preamble.consent_check, preamble.demographics, preamble.post_demographics, preamble.instructions]);
  }

  var initTrials = function() {
    var urlParams = jsPsych.data.urlVariables();

    var temp = _.chain(urlParams)
  		.omit(['workerId', 'version'])
  		.map(function(value, key, list) {

  			var i = key.replace('q', '');
        var data = value.split('_');

        if(version === 'vm-recall') {
          if(params.trials[data[0]].filler) {
            return(makeFillerTrial(i, data, params, subject));
          }
          else {
            return(makeTestTrial(i, data, params, subject));
          }
        }
        else {
          return(makeTrial67(i, data, params, subject));
        }
      }).value();

    timeline = timeline.concat(temp);

    // Return a code for the HIT
    // NOTE: No need to change this unless you want to remove it or add a prefix to the code.
    timeline.push({
      type: 'text',
      cont_key: [''],
      text: function(){
          var code = 'RE' + jsPsych.randomization.randomID(10);

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

  /** Build the experiment.
  */
  this.createTimeline = function() {
    initPreamble();
    initTrials();
  }
};

function makeTestTrial(i, data, params, subject) {
  var trials = [];
  var chunks = ['subject', 'verb', 'object'];
  var trial = params.trials[data[0]][data[1]];

  var timing = 0;
  for(var x = 0; x < 3; x++) {
    if(x == 2) {
      timing = parseInt(data[2]) * 100;
    }
    trials.push(makeReadingTrial(i, trial, data, chunks[x], timing, parseInt(data[2]) * 100, false));
  }

  trials.push({
    type: "vm-recall",
    data: {
      trial_number: i,
      item_number: data[0],
      condition: data[1],
      filler: false,
      pause_length: timing
    },
    on_finish: function() {
      var data = jsPsych.data.getLastTrialData();
      if(data.trial_number == 52 || data.trial_number % 8 == 0) {
        saveData(jsPsych.data.dataAsCSV(), dataRef);
        if(data.trial_number == 52) {
          addWorker(subject.id, 'vm-recall');
        }
      }
    }
  });

  return ({
    type: "button-response",
    timeline: trials
  });
}

function makeFillerTrial(i, data, params, subject) {
  var trials = [];
  var chunks = ['chunk_1', 'chunk_2', 'chunk_3'];
  var trial = params.trials[data[0]];

  var timing = 0;
  for(var x = 0; x < 3; x++) {
    if(x == 2) {
      timing = 600;
    }
    trials.push(makeReadingTrial(i, trial, data, chunks[x], timing, 600, true));
  }

  trials.push({
    type: "button-response",
    is_html: true,
    stimulus: '<p class="large text-center">Please press the button to proceed to the next item.</p>',
    choices: ['Next'],
    data: {
      trial_number: i,
      filler: true,
      item_number: data[0],
      pause_length: 600
    },
    on_finish: function() {
      var data = jsPsych.data.getLastTrialData();
      if(data.trial_number == 52 || data.trial_number % 8 == 0) {
        saveData(jsPsych.data.dataAsCSV(), dataRef);
        if(data.trial_number == 52) {
          addWorker(subject.id, 'vm-recall');
        }
      }
    }
  });

  return ({
    type: "button-response",
    timeline: trials
  });
}

function makeReadingTrial(i, trial, data, chunk, timing, pause, is_filler) {
  return ({
    type: "button-response",
    is_html: true,
    stimulus: '<p class="large text-center">' + trial[chunk] + "</p>",
    choices: ['>'],
    data: {
      trial_number: i,
      item_number: data[0],
      condition: data[1],
      pause_length: pause,
      filler: is_filler,
      stimulus: trial[chunk]
    },
    timing_post_trial: timing
  });
}

function makeReadingTrial67(i, data, item, chunk, timing, pause) {
  return ({
    type: "button-response",
    is_html: true,
    stimulus: '<p class="large text-center">' + chunk + "</p>",
    choices: ['>'],
    data: {
      trial_number: i,
      item_number: data[0],
      condition: data[1],
      pause_length: pause,
      filler: item.filler,
      recall: item.recall,
      stimulus: chunk
    },
    timing_post_trial: timing
  });
}

function makeTrial67(i, data, params, subject) {
  var item = params.trials[data[0]];
  var trials = []

  if(item.filler) {
    var trial = params.trials[data[0]].chunks;
    var prompt = "Please type the sentence you just read in the box below:"
  }
  else {
    var trial = params.trials[data[0]][data[1]];
    var prompt = "Please type the sentences you just read in the box below:"
  }

  var timing = 0;
  for(var x = 0; x < trial.length; x++) {
    if(x == trial.length - 1) {
      timing = 500;
    }
    trials.push(makeReadingTrial67(i, data, item, trial[x], timing, 500));
  }

  if(item.recall) {
    trials.push({
      type: "vm-recall",
      prompt: prompt,
      data: {
        trial_number: i,
        item_number: data[0],
        condition: data[1],
        filler: item.filler,
        recall: item.recall,
        pause_length: 500
      },
      on_finish: function() {
        var data = jsPsych.data.getLastTrialData();
        if(data.trial_number == 52 || data.trial_number % 8 == 0) {
          saveData(jsPsych.data.dataAsCSV(), dataRef);
          if(data.trial_number == 52) {
            addWorker(subject.id, 'vm-recall');
          }
        }
      }
    });
  }
  else {
    trials.push({
      type: "button-response",
      is_html: true,
      stimulus: '<p class="large text-center">Please press the button to proceed to the next item.</p>',
      choices: ['Next'],
      data: {
        trial_number: i,
        item_number: data[0],
        filler: item.filler,
        recall: item.recall,
        pause_length: 500
      },
      on_finish: function() {
        var data = jsPsych.data.getLastTrialData();
        if(data.trial_number == 52 || data.trial_number % 8 == 0) {
          saveData(jsPsych.data.dataAsCSV(), dataRef);
          if(data.trial_number == 52) {
            addWorker(subject.id, 'vm-recall');
          }
        }
      }
    });
  }

  return ({
    type: "button-response",
    timeline: trials
  });
}
