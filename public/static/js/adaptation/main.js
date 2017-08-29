/* Firebase initialization */

var config = {
    apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
    databaseURL: "https://language-processing-lab.firebaseio.com/",
    storageBucket: "gs://language-processing-lab.appspot.com"
};
firebase.initializeApp(config);

var storageRef = firebase.storage().ref();
var database = firebase.database();

/* Create a unique instance of the experiment */

var Experiment = new Experiment(_.extend(params, jsPsych.data.urlVariables()));
Experiment.createTimeline();
Experiment.addPropertiesTojsPsych();

var dataRef = storageRef.child('2-24-2017-run1/' + Experiment.subject.id + Experiment.condition + Experiment.subtype + Experiment.voice + '.csv');

$( document ).ready(function() {

    /* Initialize experiment */

    jsPsych.init({
      timeline: Experiment.timeline,
      show_progress_bar: true,
      display_element: $('#jspsych-target')
    });

});