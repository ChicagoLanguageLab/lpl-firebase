/* Firebase initialization */

var config = {
    apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
    databaseURL: "https://language-processing-lab.firebaseio.com/",
    storageBucket: "gs://language-processing-lab.appspot.com"
};
firebase.initializeApp(config);

var storageRef = firebase.storage().ref();
var database = firebase.database();
var dataRef;

function makeLoadingFun() {
  if($('#load-text').html() === 'Loading experiment....')
    $('#load-text').html('Loading experiment.');
  else
    $('#load-text').html($('#load-text').html() + '.');
}

var loadInterval = setInterval(function() {
  makeLoadingFun();
}, 500);

function loadExperimentFromJSON(json) {
  var experiment = new AdaptationExperiment(_.extend(json, jsPsych.data.urlVariables()));
  initializeExperiment(experiment);
}

function loadExperimentFromJS(d, textStatus, error) {
  console.error("getJSON failed, status: " + textStatus + ", error: " + error);
  var params = {
    stimuli: [
      {
        name: 'candle',
        adjective: 'tall',
        ambiguous_point: 3
      },{
        name: 'bar',
        adjective: 'bent',
        ambiguous_point: 3
      },{
        name: 'pillow',
        adjective: 'plain',
        ambiguous_point: 3
      }
    ],
    calibration: {
      max_scalepos: 5,
      distribution: [3,7,10,7,3]
    },
    exposure: {
      instructions: {
        header: '<p class="lead">In this section, you will be shown a series of images. ',
        body: {
          human: 'You will also hear a verbal description of each image. ',
          synth: 'You will also listen to sentences recorded using a speech synthesizer we are testing. '
        },
        footer: 'Periodically, you will answer some questions.</p><p>Be sure to remain focused on the center of the screen. ' +
                'Every so often, a \"+\" symbol will be briefly displayed in the center of the screen, and you will be asked a question about it. ' +
                'Please do your best to answer the question accurately.</p><p>Press the <strong>space bar</strong> when you are ready to begin.</p>'
      },
      colors: ['plain', 'red', 'blue', 'lgreen'],
      num_audio: 4,
      reps: 6
    },
    posttest: {
      colors: ['purple', 'lblue', 'pink'],
      locations: [2, 4, 8, 13, 20, 24]
    },
    attention: {
      colors: ['red', 'blue'],
      locations: [5, 10, 17, 22]
    }
  };
  var experiment = new AdaptationExperiment(_.extend(params, jsPsych.data.urlVariables()));
  initializeExperiment(experiment);
}

function attemptLoad() {
  $.getJSON("production.data.json",
            loadExperimentFromJSON)
   .fail(loadExperimentFromJS);
}

function initializeExperiment(experiment) {
  dataRef = storageRef.child('2-24-2017-run1/' + experiment.getSubjectId() + experiment.getCondition() + experiment.getSubcondition() + experiment.getVoice() + '.csv');

  experiment.createTimeline();
  experiment.addPropertiesTojsPsych();

  jsPsych.init({
    timeline: experiment.getTimeline(),
    show_progress_bar: true,
    display_element: $('#jspsych-target')
  });

  clearInterval(loadInterval);
}

$( document ).ready(function() {
  checkWorker(jsPsych.data.urlVariables().workerId, 'adaptation-workers').then(function(snapshot) {
    if(snapshot.val() && snapshot.val().complete == 1) {
      console.log('Worker has already completed the experiment.');
      clearInterval(loadInterval);
      $('#load-text').remove();
      showError();
    }
    else {
      console.log('Worker has not yet completed the experiment.');
      attemptLoad();
    }
  });
});
