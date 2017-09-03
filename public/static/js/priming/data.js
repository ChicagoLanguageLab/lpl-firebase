// data.js
// Data for the priming experiment

/* Premade jsPsych trials */

var prefabs = {
  pre_experiment_block: {
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
                   As a reminder, this study runs best in <b>Chrome</b> or <b>Firefox</b>. If you are not using one of these browers, we recommend switching now to avoid future issues. When you are ready, please proceed by pressing the  <strong>space bar</strong> .
                 </p>
               </div>`,
        cont_key: [' ']
      },
      {
        type: 'consent',
        requirements: 'You must be at least 18 years old to participate in this study. ',
        purpose: 'In this research, we are investigating the processes involved in the comprehension of sentences and/or stories. ',
        procedures: 'In this study, you will be presented with a sentence accompanied by an audio clip. You will then record yourself describing a provided image. ',
        time: 'about 5 minutes',
        pay: '$0.50 USD',
        name: 'Dr. Ming Xiang',
        address: '1115 E. 58th St., Rosenwald 205B, Chicago IL, 60637',
        phone: '(773) 702-8023',
        email: 'mxiang@uchicago.edu'
      },
      {
        conditional_function: function() {
          var data = jsPsych.data.getLastTrialData();
          return !data.consented;
        },
        timeline: [{
          type: 'text',
          cont_key: [''],
          text: '<p class="lead">Thank you for considering participation in this study!</p><p>We\'re sorry it wasn\'t for you. You may close this window and return your HIT. There is no penalty for returning our lab\'s HITs.</p>'
        }]
      },
      {
        type: 'audio-consent'
      },
      {
        conditional_function: function() {
          var data = jsPsych.data.getLastTrialData();
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
        text: '<p class="lead mt-4">Thank you for deciding to participate in our study!</p><p>This study has multiple sections. Each section is only a few minutes long. In between sections, you can take short breaks if you need to, but please do not take breaks within a section. When you are ready to begin, please press the  <strong>space bar</strong> .</p>',
        cont_key: [' ']
      }
    ]
  },
  final_block: {
    type: 'text',
    cont_key: [''],
    text: function(){
        return `<p class="lead">
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
  speaker: {
    timeline: [{
      type: 'text',
      cont_key: ['Y', 'N'],
      text: `<p class="text-center center-screen">
               You will listen to some audio during this study. Have you turned your speaker on?<br/><br/>
               Press <b>Y</b> for "yes" and <b>N</b> for "no".
             </p>`,
      timing_post_trial: 1000
    }],
    loop_function: function(data){
      if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('n') == data[0].key_press){
        return true;
      } else {
        return false;
      }
    }
  },
  microphone: {
    timeline: [{
      type: 'text',
      cont_key: ['Y', 'N'],
      text: `<p class="text-center center-screen">
               You will record yourself during this study. Do you know where your mic is located?<br/><br/>
               Press <b>Y</b> for "yes" and <b>N</b> for "no".
             </p>`,
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
};

sentences = {'1a': 'Daniel planned to send his mother a note, but after work he was too tired to.',
			 '1b': 'Daniel planned to send his mother a note, but after work he was too tired.',
			 '1c': 'Daniel planned to send his mother a note, but after work he was too tired to send her anything.',
			 '1d': 'Daniel planned to send his mother a note, but after work he slept.',
			 '1e': 'Daniel planned to send a note to his mother, but after work he was too tired to.',
			 '1f': 'Daniel planned to send a note to his mother, but after work he was too tired.',
			 '1g': 'Daniel planned to send a note to his mother, but after work he was too tired to send anything to her.',
			 '1h': 'Daniel planned to send a note to his mother, but after work he slept.',
			 '6a': 'Robin said he would lend the gambler some money, but at the local club he wasn\'t allowed to.',
			 '6b': 'Robin said he would lend the gambler some money, but at the local club he wasn\'t allowed.',
			 '6c': 'Robin said he would lend the gambler some money, but at the local club he wasn\'t allowed to lend him money.',
			 '6d': 'Robin said he would lend the gambler some money, but at the local club he was frugal.',
			 '6e': 'Robin said he would lend some money to the gambler, but at the local club he wasn\'t allowed to.',
			 '6f': 'Robin said he would lend some money to the gambler, but at the local club he wasn\'t allowed.',
			 '6g': 'Robin said he would lend some money to the gambler, but at the local club he wasn\'t allowed to lend money to him.',
			 '6h': 'Robin said he would lend some money to the gambler, but at the local club he was frugal.',
			 '10a': 'The rescue worker needed to throw the stranded explorer the heavy rope, but he wasn\'t strong enough to.',
			 '10b': 'The rescue worker needed to throw the stranded explorer the heavy rope, but he wasn\'t strong enough.',
			 '10c': 'The rescue worker needed to throw the stranded explorer the heavy rope, but he wasn\'t strong enough to throw him anything.',
			 '10d': 'The rescue worker needed to throw the stranded explorer the heavy rope, but he was weak.',
			 '10e': 'The rescue worker needed to throw the heavy rope to the stranded explorer, but he wasn\'t strong enough to.',
			 '10f': 'The rescue worker needed to throw the heavy rope to the stranded explorer, but he wasn\'t strong enough.',
			 '10g': 'The rescue worker needed to throw the heavy rope to the stranded explorer, but he wasn\'t strong enough to throw anything to him.',
			 '10h': 'The rescue worker needed to throw the heavy rope to the stranded explorer, but he was weak.',
			 '15a': 'The county doesn\'t offer its residents these services yet, but next year they will start to.',
			 '15b': 'The county doesn\'t offer its residents these services yet, but next year they will start.',
			 '15c': 'The county doesn\'t offer its residents these services yet, but next year they will start to offer them some services.',
			 '15d': 'The county doesn\'t offer its residents these services yet, but next year they will change.',
			 '15e': 'The county doesn\'t offer these services to its residents yet, but next year they will start to.',
			 '15f': 'The county doesn\'t offer these services to its residents yet, but next year they will start.',
			 '15g': 'The county doesn\'t offer these services to its residents yet, but next year they will start to offer some services to them.',
			 '15h': 'The county doesn\'t offer these services to its residents yet, but next year they will change.',
			 '17a': 'Suzanne was supposed to show her secretary a memo, but in the end she failed to.',
			 '17b': 'Suzanne was supposed to show her secretary a memo, but in the end she failed.',
			 '17c': 'Suzanne was supposed to show her secretary a memo, but in the end she failed to show her the memo.',
			 '17d': 'Suzanne was supposed to show her secretary a memo, but in the end she was busy.',
			 '17e': 'Suzanne was supposed to show a memo to her secretary, but in the end she failed to.',
			 '17f': 'Suzanne was supposed to show a memo to her secretary, but in the end she failed.',
			 '17g': 'Suzanne was supposed to show a memo to her secretary, but in the end she failed to show the memo to her.',
			 '17h': 'Suzanne was supposed to show a memo to her secretary, but in the end she was busy.',
			 '20a': 'The tenant needed to mail his landlord a check, but he didn\'t have enough money to.',
			 '20b': 'The tenant needed to mail his landlord a check, but he didn\'t have enough money.',
			 '20c': 'The tenant needed to mail his landlord a check, but he didn\'t have enough money to mail him a check.',
			 '20d': 'The tenant needed to mail his landlord a check, but he was broke.',
			 '20e': 'The tenant needed to mail a check to his landlord, but he didn\'t have enough money to.',
			 '20f': 'The tenant needed to mail a check to his landlord, but he didn\'t have enough money.',
			 '20g': 'The tenant needed to mail a check to his landlord, but he didn\'t have enough money to mail a check to him.',
			 '20h': 'The tenant needed to mail a check to his landlord, but he was broke.',
			 '21a': 'David was supposed to bring the spy a message, but he did not try to.',
			 '21b': 'David was supposed to bring the spy a message, but he did not try.',
			 '21c': 'David was supposed to bring the spy a message, but he did not try to bring him anything.',
			 '21d': 'David was supposed to bring the spy a message, but he was asleep.',
			 '21e': 'David was supposed to bring a message to the spy, but he did not try to.',
			 '21f': 'David was supposed to bring a message to the spy, but he did not try.',
			 '21g': 'David was supposed to bring a message to the spy, but he did not try to bring anything to him.',
			 '21h': 'David was supposed to bring a message to the spy, but he was asleep.',
			 '22a': 'John\'s parents were asked to pass him the heavy basket, but they were too weak to.',
			 '22b': 'John\'s parents were asked to pass him the heavy basket, but they were too weak.',
			 '22c': 'John\'s parents were asked to pass him the heavy basket, but they were too weak to pass him that basket.',
			 '22d': 'John\'s parents were asked to pass him the heavy basket, but they were not listening.',
			 '22e': 'John\'s parents were asked to pass the heavy basket to him, but they were too weak to.',
			 '22f': 'John\'s parents were asked to pass the heavy basket to him, but they were too weak.',
			 '22g': 'John\'s parents were asked to pass the heavy basket to him, but they were too weak to pass that basket to him.',
			 '22h': 'John\'s parents were asked to pass the heavy basket to him, but they were not listening.',
			 '24a': 'Tina was going to hand the honoree the award, but she didn\'t have the courage to.',
			 '24b': 'Tina was going to hand the honoree the award, but she didn\'t have the courage.',
			 '24c': 'Tina was going to hand the honoree the award, but she didn\'t have the courage to hand him the award in public.',
			 '24d': 'Tina was going to hand the honoree the award, but she became nervous.',
			 '24e': 'Tina was going to hand the award to the honoree, but she didn\'t have the courage to.',
			 '24f': 'Tina was going to hand the award to the honoree, but she didn\'t have the courage.',
			 '24g': 'Tina was going to hand the award to the honoree, but she didn\'t have the courage to hand the award to him in public.',
			 '24h': 'Tina was going to hand the award to the honoree, but she became nervous.',
			 '29a': 'Carl did not want to sell the organization the car, so he did not volunteer to.',
			 '29b': 'Carl did not want to sell the organization the car, so he did not volunteer.',
			 '29c': 'Carl did not want to sell the organization the car, so he did not volunteer to sell them his car at all.',
			 '29d': 'Carl did not want to sell the organization the car, so he was ashamed.',
			 '29e': 'Carl did not want to sell the car to the organization, so he did not volunteer to.',
			 '29f': 'Carl did not want to sell the car to the organization, so he did not volunteer.',
			 '29g': 'Carl did not want to sell the car to the organization, so he did not volunteer to sell his car to them at all.',
			 '29h': 'Carl did not want to sell the car to the organization, so he was ashamed.'
};

var instructions = `<p>You will first be presented with a sentence. Take a moment to <strong>read</strong> the sentence.</p>
						<p>After a few seconds, an audio recording of the sentence will play. Please <strong>listen</strong> carefully to the recording.</p>
						<p>Once the recording has finished playing, a <strong>Next</strong> button will appear.</p>
            <div class="card-block">
						<p>After you click "Next", you will be presented with an image and a verb.</p>
						<p>Use the recorder provided on this page to <strong>record</strong> yourself describing what is happening in the image.</p>
						<p>Please use only <strong>one sentence</strong> to describe the image, and be sure to <strong>use the provided verb</strong> in your sentence.</p>
					</div>`
