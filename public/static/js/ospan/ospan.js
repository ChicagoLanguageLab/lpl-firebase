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

/* Get parameters */

var params = getAllUrlParams();

var workerId = params.workerId;
if(workerId == undefined || workerId == "")
    workerId = "TEST";

var code = 'TURK' + jsPsych.randomization.randomID(10);
var dataRef = storageRef.child('ospan_testing/' + workerId + '.csv');

/* Generate OSPAN sections */

var startingInstructionsBlock = initInstructions(startingInstructions, [' ']);
var letterPracticeInstructionsBlock = initInstructions(letterPracticeInstructions, [' ']);
var letterPracticeBlock = makeOspanTrials(pracLetterSize, "LetterPractice");
var mathPracticeInstructionsBlock = initInstructions(mathPracticeInstructions, [' ']);
var mathPracticeBlock = makeOspanTrials([], "MathPractice");
var bothPracticeInstructions = initInstructions(bothPracticeInstructions, [' ']);
var bothPracticeBlock = makeOspanTrials(pracBothSetSize, "BothPractice");
var experimentInstructionsBlock = initInstructions(experimentInstructions, [' ']);
var experimentBlock = makeOspanTrials(jsPsych.randomization.shuffle(testBothSetSize), "Experiment");

var feedbackBlock = {
  type: "text",
  text: function() { return "<p>You have finished the memory task. In case you are interested, these are your final results:</p><p>You answered " + (results.total_math_problems - results.total_math_wrong) + " math problems correctly out of " + results.total_math_problems + " total problems. Of your incorrect answers, " + results.total_math_accuracy_errors + " were accuracy errors, and " + results.total_math_speed_errors + " were speed errors.</p><p>You recalled " + results.total_letters_correct + " letters correctly out of " + results.total_letters + " total letters. You responded with 100% accuracy on " + results.total_strings_correct + " strings out of " + results.total_strings + " total strings.</p><p>Thank you for your participation!</p>"; }
};

/* Add sections to timeline */

var timeline = [];
timeline.push(startingInstructionsBlock);
timeline.push(letterPracticeInstructionsBlock);
timeline = addObjectsToTimeline(timeline, letterPracticeBlock);
timeline.push(mathPracticeInstructionsBlock);
timeline = addObjectsToTimeline(timeline, mathPracticeBlock);
timeline.push(bothPracticeInstructions);
timeline = addObjectsToTimeline(timeline, bothPracticeBlock);
timeline.push(experimentInstructionsBlock);
timeline = addObjectsToTimeline(timeline, experimentBlock);
timeline.push(feedbackBlock);

/* Start the experiment */

$(document).ready(function(){
    checkWorker(workerId, 'production-study');

    $('#progress-bar').show();
    $('#jspsych-target').show();

    jsPsych.init({
      display_element: $('#jspsych-target'),
      timeline: timeline,
      show_progress_bar: true,
      timing_post_trial: 0
  });
});