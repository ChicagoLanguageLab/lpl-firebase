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
var dataRef = storageRef.child('production/4-15-2017/' + workerId + '.csv');

/* Init and add production trials */

var timeline = [];

var productionInstructionsblock = initInstructions(productionInstructions, [' ']);
var productionBlock = initProductionTrials();

timeline.push(productionInstructionsblock);
_.each(productionBlock, function(trial, index, list) {
  timeline.push(trial);
});

var productionEndBlock = initInstructions(productionEndInstructions, [' ']);
timeline.push(productionEndBlock);

/* Init and add OSPAN trials */

var startingInstructionsBlock = initInstructions(startingInstructions, [' ']);
var letterPracticeInstructionsBlock = initInstructions(letterPracticeInstructions, [' ']);
var letterPracticeBlock = makeOspanTrials(pracLetterSize, "LetterPractice");
var mathPracticeInstructionsBlock = initInstructions(mathPracticeInstructions, [' ']);
var mathPracticeBlock = makeOspanTrials([], "MathPractice");
var bothPracticeInstructions = initInstructions(bothPracticeInstructions, [' ']);
var bothPracticeBlock = makeOspanTrials(pracBothSetSize, "BothPractice");
var experimentInstructionsBlock = initInstructions(experimentInstructions, [' ']);
var experimentBlock = makeOspanTrials(jsPsych.randomization.shuffle(testBothSetSize), "Experiment");

timeline.push(startingInstructionsBlock);
timeline.push(letterPracticeInstructionsBlock);
timeline.push(letterPracticeBlock);
timeline.push(mathPracticeInstructionsBlock);
timeline.push(mathPracticeBlock);
timeline.push(bothPracticeInstructions);
timeline.push(bothPracticeBlock);
timeline.push(experimentInstructionsBlock);
timeline.push(experimentBlock);

var end_ospan_block = {
type: "text",
  choices: [''],
  text: function(){
      return "<p>You have finished the second task. Press <strong>space</space> to continue to your survey code.</p>";
  },
  on_finish: function() {
    addWorker(workerId, "production-OSPAN");
    saveData(jsPsych.data.dataAsCSV(), dataRef);
  }
}

var end_block = {
  type: "text",
  choices: [''],
  text: function(){
      return "<p>Thank you for your participation! Your responses have been saved.</p><p>Your survey code is <b>" + code + "</b>. Please enter this code into your HIT. You may then close this window.</p><p>If you have any questions or concerns, please do not hesitate to contact the lab at <a href='mailto:uchicagolanglab@gmail.com'>uchicagolanglab@gmail.com</a>.";
  }
};

timeline.push(end_block);

/* start the experiment */
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