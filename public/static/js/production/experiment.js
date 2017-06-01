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

var dataRef = storageRef.child('production-OSPAN/06-01-2017/' + params.workerId + '.csv');

browser_test_block = {
  timeline: [{
      type: "text",
      cont_key: ['Y', 'N'],
      text: '<p>This experiment works best if you have maximized your browser window. Is your browser window maximized?</p><p>Press <b>Y</b> for "yes" and <b>N</b> for "no".</p>',
      timing_post_trial: 1000
  }],
  loop_function: function(data){
    if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('n') == data[0].key_press){
        return true;
    } else {
        return false;
    }
  }
}

/* Init and add production trials */

var timeline = [];

var productionInstructionsblock = initInstructions(productionInstructions, [' ']);
var productionBlock = initProductionTrials();

timeline.push(productionInstructionsblock);
timeline.push(browser_test_block);
timeline = addObjectsToTimeline(timeline, productionBlock);

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
timeline = addObjectsToTimeline(timeline, letterPracticeBlock);
timeline.push(mathPracticeInstructionsBlock);
timeline = addObjectsToTimeline(timeline, mathPracticeBlock);
timeline.push(bothPracticeInstructions);
timeline = addObjectsToTimeline(timeline, bothPracticeBlock);
timeline.push(experimentInstructionsBlock);
timeline = addObjectsToTimeline(timeline, experimentBlock);

var feedbackBlock = {
  type: "text",
  text: function() { return "<p>You have finished the memory task. These are your final results:</p><p>You answered " + (results.total_math_problems - results.total_math_wrong) + " math problems correctly out of " + results.total_math_problems + " total problems. Of your incorrect answers, " + results.total_math_accuracy_errors + " were accuracy errors, and " + results.total_math_speed_errors + " were speed errors.</p><p>You recalled " + results.total_letters_correct + " letters correctly out of " + results.total_letters + " total letters. You responded with 100% accuracy on " + results.total_strings_correct + " strings out of " + results.total_strings + " total strings.</p><p>Press <strong>space</strong> to continue to your survey code.</p>"; },
  cont_key: [' '],
  on_finish: function() {
    addWorker(workerId, "production-OSPAN");
    saveData(jsPsych.data.dataAsCSV(), dataRef);
  }
};

timeline.push(feedbackBlock);

var endBlock = {
  type: "text",
  cont_key: [''],
  text: function(){
      return "<p>Thank you for your participation! Your responses have been saved.</p><p>Your survey code is <b>" + code + "</b>. Please enter this code into your HIT. You may then close this window.</p><p>If you have any questions or concerns, please do not hesitate to contact the lab at <a href='mailto:uchicagolanglab@gmail.com'>uchicagolanglab@gmail.com</a>.";
  }
};

timeline.push(endBlock);

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