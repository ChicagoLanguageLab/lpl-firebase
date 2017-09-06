/* Firebase initialization */

var config = {
    apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
    databaseURL: "https://language-processing-lab.firebaseio.com/",
    storageBucket: "gs://language-processing-lab.appspot.com"
};
firebase.initializeApp(config);

var storageRef = firebase.storage().ref();
var database = firebase.database();

function makeLoadingFun() {
  if($('#load-text').html() === 'Loading experiment....')
    $('#load-text').html('Loading experiment.');
  else
    $('#load-text').html($('#load-text').html() + '.');
}

var loadMessage = setInterval(function() {
  makeLoadingFun();
}, 500);

function loadExperiment() {
  console.log('Worker has not yet completed the experiment.');

  $.getJSON("https://language-processing-lab.firebaseapp.com/static/js/adaptation/params.json", function(json) {

    var experiment = new AdaptationExperiment(_.extend(json, jsPsych.data.urlVariables()));
    var dataRef = storageRef.child('2-24-2017-run1/' + experiment.getSubjectId() + experiment.getCondition() + experiment.getSubcondition() + experiment.getVoice() + '.csv');

    experiment.createTimeline();
    experiment.addPropertiesTojsPsych();

    jsPsych.init({
      timeline: experiment.getTimeline(),
      show_progress_bar: true,
      display_element: $('#jspsych-target')
    });

    clearInterval(loadMessage);

  }).fail(function(d, textStatus, error) {
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
    var dataRef = storageRef.child('2-24-2017-run1/' + experiment.getSubjectId() + experiment.getCondition() + experiment.getSubcondition() + experiment.getVoice() + '.csv');

    experiment.createTimeline();
    experiment.addPropertiesTojsPsych();

    jsPsych.init({
      timeline: experiment.getTimeline(),
      show_progress_bar: true,
      display_element: $('#jspsych-target')
    });

    clearInterval(loadMessage);
  });
}

function workerError() {
  console.log('Worker has already completed the experiment.');
  clearInterval(loadDisplay);
  $('#load-text').remove();
  showError();
}

$( document ).ready(function() {
  checkWorker(jsPsych.data.urlVariables().workerId, 'adaptation-workers').then(function(snapshot) {
    if(snapshot.val() && snapshot.val().complete == 1) {
      workerError();
    }
    else {
      loadExperiment();
    }
  });
});
