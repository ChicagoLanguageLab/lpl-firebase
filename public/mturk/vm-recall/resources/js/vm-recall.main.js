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
  var experiment = new VmRecallExperiment(_.extend(json, jsPsych.data.urlVariables()));
  initializeExperiment(experiment);
}

function error(d, textStatus, error) {
  console.error("getJSON failed, status: " + textStatus + ", error: " + error);
}

function attemptLoad() {
  $.getJSON("resources/data/vm-recall.data.json",
            loadExperimentFromJSON)
   .fail(error);
}

function initializeExperiment(experiment) {
  var d = new Date();
  var date_string = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');

  var vars = jsPsych.data.urlVariables();

  dataRef = storageRef.child('vm-recall/' + date_string + '/' + experiment.getSubjectId() + '.csv');

  experiment.createTimeline();
  experiment.addPropertiesTojsPsych();

  jsPsych.init({
    timeline: experiment.getTimeline(),
    show_progress_bar: true,
    display_element: $('#jspsych-target')
  });

  $('#load-text').remove();
  clearInterval(loadInterval);
}

$( document ).ready(function() {

  checkWorker(jsPsych.data.urlVariables().workerId, 'vm-recall').then(function(snapshot) {

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
