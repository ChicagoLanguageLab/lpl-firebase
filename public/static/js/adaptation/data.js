// data.js
// Data for the adaptation experiment

/* Premade jsPsych trials */

var pre_experiment_block = {
  type: 'text',
  timeline: [
    {
      type: 'text',
      text: `<div class="header row">
               <div class="col-2 text-right">
                 <img class="logo" src="../static/images/shield.png" alt="UChicago Logo"/>
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
    },
    {
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
    },
    {
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
    },
    {
      type: 'demographics'
    },
    {
      type: 'text',
      text: '<p class="lead mt-4">Thank you for deciding to participate in our study!</p><p>This study has multiple sections. Each section is only a few minutes long. In between sections, you can take short breaks if you need to, but please do not take breaks within a section. When you are ready to begin, please press the <strong>space bar</strong>.</p>',
      cont_key: [' ']
    }
  ]
};

var prefabs = {
  end_block: {
    type: 'text',
    cont_key: [' '],
    text: function() {
        return `<p>
                  You have finished this section. You can take a short break now if you want to.
                </p>
                <p>
                  Please press the space bar when you ready to continue.
                </p>`;
    },
    on_finish: function(data){
        saveData(jsPsych.data.dataAsCSV(), dataRef);
    }
  },
  final_block: {
    type: 'text',
    cont_key: [''],
    text: function(){
        return `<p>
                  You have finished the experiment! Your responses have been saved.
                </p>
                <p>
                  Your survey code is <b>" + code + "</b>. Please enter this code into your HIT.
                  You may then close this window.</p><p>If you have any questions or concerns,
                  please do not hesitate to contact the lab at
                  <a href='mailto:uchicagolanglab@gmail.com'>uchicagolanglab@gmail.com</a>.
                </p>`;
    }
  },
  end_block_last: {
    type: 'text',
    cont_key: [' '],
    text: function() {
        return `<p>
                  You have finished this section. You can take a short break now if you want to.
               </p>
               <p>
                 Please press the space bar when you ready to continue.
               </p>`;
    },
    on_finish: function(data){
        saveData(jsPsych.data.dataAsCSV(), dataRef);
        addWorker(workerId, 'adaptation-study');
    }
  },
  calibration_instructions: {
    type: 'text',
    text: `<p class="lead">
             In this section, you will be shown a series of images.
           </p>
           <p>
             You will be asked a question about each image. You will respond by pressing buttons on the keyboard.
             Please answer each question based on your first instinct; there is no right or wrong answer.
          </p>
          <p>
            Please press the <strong>space bar</strong> when you are ready to begin.
         </p>`,
    cont_key: [' ']
  }
};

var audio_test_prefabs = {
  human: {
    timeline: [{
      type: 'text',
      cont_key: ['F', 'J'],
      text: `<p class="text-center center-screen">
               You will listen to some verbal statements in this section. Have you turned your speaker on?<br/><br/>
               Press <b>F</b> for "yes" and <b>J</b> for "no".
             </p>`,
      timing_post_trial: 1000
    }],
    loop_function: function(data){
      if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('j') == data[0].key_press){
        return true;
      } else {
        return false;
      }
    }
  },
  synth: {
    timeline: [{
        type: 'text',
        cont_key: ['F', 'J'],
        text: `<p>
                 We are testing a speech synthesizer that can imitate human voice.
                 In this section you will hear some verbal statements made by this synthesizer.
                 Have you turned your speaker on?</p><p>Press <b>F</b> for "yes" and <b>J</b> for "no".
              </p>`,
        timing_post_trial: 1000
    }],
    loop_function: function(data){
      if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('j') == data[0].key_press){
        return true;
      } else {
        return false;
      }
    }
  }
}

var exposure_instructions = {
  header: '<p>In this section, you will see a sequence of images. ',
  footer: 'Periodically, you will answer some questions.</p><p>Be sure to remain focused on the center of the screen. ' +
          'Every so often, a \"+\" symbol will be briefly displayed in the center of the screen, and you will be asked a question about it. ' +
          'Please do your best to answer the question accurately.</p><p>Press the space bar when you are ready to begin.</p>'
}

var params = {
  stimuli: [
    {
      name: 'candle',
      adjective: 'tall',
      ambiguous_point: 3
    },{
      name: 'bar',
      adjective: 'bent',
      ambiguous_point: 3
    },{
      name: 'pillow',
      adjective: 'plain',
      ambiguous_point: 3
    },
    {
      name: 'flower',
      adjective: '',
      ambiguous_point: 4
    }
  ],
  exposure_colors: ['plain', 'red', 'blue', 'lgreen'],
  posttest_colors: ['purple', 'lblue', 'pink'],
  max_scalepos: 5,
  trial_distribution: [3,7,10,7,3],
  posttest_points: [2, 4, 8, 13, 20, 24],
  attention_points: [5, 10, 17, 22]
}
