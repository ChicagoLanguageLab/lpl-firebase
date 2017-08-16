// data.js
// Static data for the adaptation experiment

/* Static jsPsych trials */

// Initial text shown to the subject
var pre_consent = {
  type: 'text',
  text: `<div class="header row">
           <div class="col-2 text-right">
             <img class="logo" src="../static/shield.png" alt="UChicago Logo"/>
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
             As a reminder, this study runs best in <b>Chrome</b> or <b>Firefox</b>. If you are not using one of these browers, we recommend switching now to avoid future issues. When you are ready, please proceed by pressing the <strong>space bar</strong>.
           </p>
         </div>`,
  cont_key: [' ']
}

// Consent form
var consent = {
  type: 'consent',
  requirements: 'You must be at least 18 years old to participate in this study. ',
  purpose: 'In this research, we are investigating the processes involved in the comprehension of sentences and/or stories. ',
  procedures: 'In this study, you will be presented with a series of images and descriptions and provide feedback on them, as directed in the experimental instructions. You will also listen to some audio about a set of images. ',
  time: 'about 30-40 minutes',
  pay: '$4 USD',
  name: 'Dr. Ming Xiang',
  address: '1115 E. 58th St., Rosenwald 205B, Chicago IL, 60637',
  phone: '(773) 702-8023',
  email: 'mxiang@uchicago.edu'
};

// Checks if the subject consented or not
var check_consent = {
  conditional_function: function() {
    var data = jsPsych.data.getLastTrialData();
    console.log(data.consented);
    return !data.consented;
  },
  timeline: [{
    type: 'text',
    cont_key: [''],
    text: '<p class="lead">Thank you for considering participation in this study!</p><p>We\'re sorry it wasn\'t for you. You may close this window and return your HIT. There is no penalty for returning our lab\'s HITs.</p>'
  }]
};

/* If the subject consents...*/
var expt_consented = {
    type: "text",
    text: '<p class="lead mt-4">Thank you for deciding to participate in our study!</p><p>This study has multiple sections. Each section is only a few minutes long. In between sections, you can take short breaks if you need to, but please do not take breaks within a section. When you are ready to begin, please press the <strong>space bar</strong>.</p>',
    choices: [' ']
};

/* Generic end-block that works for most sections */
var end_block = {
    type: "text",
    choices: [' '],
    text: function() {
        return "<p>You have finished this section. You can take a short break now if you want to.</p><p>Please press the space bar when you ready to continue.</p>";
    },
    on_finish: function(data){
        saveData(jsPsych.data.getDataAsCSV(), dataRef);
    }
};

/* Experiment values */
var trial_distribution = [3,7,10,7,3];

/* The objects we will test on. */
var objects = [{obj_name: 'candle', property: 'tall', file: 'candle', article: 'a'},{obj_name: 'bar', property: 'bent', file: 'straightrod', article: 'a'},{obj_name: 'pillow', property: 'plain', file: 'pillow', article: 'a'}];

/* Define colorsets */
var exposure_colors = ['', '_red', '_blue', '_lgreen'];
var posttest_colors = ['_purple', '_lblue', '_pink'];
