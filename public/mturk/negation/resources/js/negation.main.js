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
  var experiment = new NegationExperiment(_.extend(json, jsPsych.data.urlVariables()));
  initializeExperiment(experiment);
}

function error(d, textStatus, error) {
  console.error("getJSON failed, status: " + textStatus + ", error: " + error);
}

function attemptLoad() {
  $.getJSON("resources/data/negation.data.json",
            loadExperimentFromJSON)
   .fail(error);
}

function initializeExperiment(experiment) {
  var d = new Date();
  var date_string = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');

  var vars = jsPsych.data.urlVariables();

  var cond = vars.condition == undefined ? '' : vars.condition + '-';
  dataRef = storageRef.child('negation/' + vars.version + '/' + date_string + '/' + cond + vars.color_condition + '/' + experiment.getSubjectId() + '.csv');

  experiment.createTimeline();
  experiment.addPropertiesTojsPsych();

  jsPsych.init({
    timeline: experiment.getTimeline(),
    show_progress_bar: true,
    display_element: $('#jspsych-target'),
    on_finish: function() {
      var code = jsPsych.data.getLastTrialData().code;
      $('#jspsych-target').html('<p class="lead">You have finished the experiment! Your responses have been saved.</p>' +
          '<p>Your survey code is <b>' + code + '</b>. Please enter this code into your HIT. ' +
          'You may then close this window.</p><p>If you have any questions or concerns, ' +
          'please do not hesitate to contact the lab at <a href="mailto:uchicagolanglab@gmail.com">uchicagolanglab@gmail.com</a>.</p>');
    }
  });

  var code = 'TURK' + jsPsych.randomization.randomID(10);

  jsPsych.data.addProperties({
    code: code
  });

  $('#load-text').remove();
  clearInterval(loadInterval);
}

$( document ).ready(function() {

  checkWorker(jsPsych.data.urlVariables().workerId, 'negation-study').then(function(snapshot) {

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
