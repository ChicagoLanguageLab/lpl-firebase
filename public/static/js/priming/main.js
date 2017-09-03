/* Firebase initialization */
var config = {
    apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
    databaseURL: "https://language-processing-lab.firebaseio.com/",
    storageBucket: "gs://language-processing-lab.appspot.com"
};
firebase.initializeApp(config);

var storage = firebase.storage();
var storageRef = storage.ref();
var database = firebase.database();

var subjectData = {};

var timeline = [prefabs.pre_experiment_block];
console.log(timeline);

$( document ).ready(function() {

  var params   = jsPsych.data.urlVariables();
  var sentence = params.sentence;
  var image    = params.image;
  var verb     = params.verb;
  var workerId = params.workerId;

  var dataRef = storageRef.child('priming/07-25-2017/' + params.workerId + '.csv');

  checkWorker(workerId, 'priming-study', ['jspsych-target']);

  jsPsych.init({
    timeline: timeline,
    show_progress_bar: true,
    display_element: $('#jspsych-target')
  });
});
