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

var dataRef = storageRef.child('production-remainder/TmoreC-11-03-2017/' + params.workerId + '.csv');

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

var productionInstructionsblock = initInstructions(productionInstructions);
var productionBlock = initProductionTrials();

var welcomePage = {
  type: 'text',
  text: `<div class="header row">
           <div class="col-2 text-right">
             <img class="logo" src="../shared/images/shield.png" alt="UChicago Logo"/>
           </div>
           <div class="col-10">
             <h1>Language Processing Laboratory</h1>
             <p class="lead">Department of Linguistics, The University of Chicago</p>
           </div>
         </div>
         <div>
           <p class="mt-4 lead">
             Thank you for your interest in our study!
           </p>
           <p>
             As a reminder, this study runs best in <b>Chrome</b> or <b>Firefox</b>. If you are not using one of these browers, we recommend switching now to avoid future issues. When you are ready, please proceed by pressing the  <strong>space bar</strong> .
           </p>
         </div>`,
  cont_key: [' ']
};

var consentPage = {
  type: 'consent',
  requirements: 'You must be at least 18 years old to participate in this study. ',
  purpose: 'In this research, we are investigating the processes involved in the comprehension of sentences. ',
  procedures: 'In this study, you will provide brief descriptions of one image out of a set of images. ',
  time: 'about 10 minutes',
  pay: '$1 USD',
  name: 'Dr. Ming Xiang',
  address: '1115 E. 58th St., Rosenwald 205B, Chicago IL, 60637',
  phone: '(773) 702-8023',
  email: 'mxiang@uchicago.edu'
};

timeline.push(welcomePage);
timeline.push(consentPage);
timeline.push(productionInstructionsblock);
timeline.push(browser_test_block);

timeline = addObjectsToTimeline(timeline, productionBlock);

var productionEndBlock = initInstructions(productionEndInstructions);
productionEndBlock.on_finish = function() {
  saveData(jsPsych.data.dataAsCSV(), dataRef, function() {
    console.log('Complete.');
  });
}
timeline.push(productionEndBlock);

/* start the experiment */
$(document).ready(function(){

  checkWorker(workerId, 'production-OSPAN').then(function(snapshot) {
    if(snapshot.val() && snapshot.val().complete == 1) {
      console.log('Worker has already completed the experiment.');
      showError();
    }
    else {
      console.log('Worker has not yet completed the experiment.');

      jsPsych.init({
        display_element: $('#jspsych-target'),
        timeline: timeline,
        show_progress_bar: true,
        timing_post_trial: 0,
        on_finish: function() {
          $('#jspsych-target').append('<p>Thank you for your participation! Your responses have been saved.</p><p>Your survey code is <b>' + code + '</b>. Please enter this code into your HIT. You may then close this window.</p><p>If you have any questions or concerns, please do not hesitate to contact the lab at <a href="mailto:uchicagolanglab@gmail.com">uchicagolanglab@gmail.com</a>.</p>');
        }
      });
    }
  });
});
