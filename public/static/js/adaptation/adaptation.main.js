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

function loadExperiment() {
  console.log('Worker has not yet completed the experiment.');

  $.getJSON("../static/js/adaptation/params.json", function(json) {

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
  });
}

function workerError() {
  console.log('Worker has already completed the experiment.');
  clearInterval(loadDisplay);
  $('#load-text').remove();
  showError();
}

$( document ).ready(function() {

  var loadMessage = setInterval(function() {
    makeLoadingFun();
  }, 500);

  checkWorker(experiment.getSubjectId(), 'adaptation-workers').then(function(snapshot) {
    if(snapshot.val() && snapshot.val().complete == 1) {
      workerError();
    }
    else {
      loadExperiment();
    }

});
