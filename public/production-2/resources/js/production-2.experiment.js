// production-2.experiment.js
// Defines the experiment object.

/** Construct an instance of the Production2Experiment class.
  * @constructor
  * @param {Object} params - A collection of parameters.
  */
function Production2Experiment(params) {

  var timeline = [];
  var raw_trials = params.trials;

  this.getTimeline = function() {
    return timeline;
  }

  var subject = {};
  subject.id = params.workerId;

  this.getSubjectId = function() {
    return subject.id;
  }

  this.initTimeline = function() {

    var trials = [];
    var order_list = jsPsych.randomization.shuffle([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

    var orderEnum = {
      0: 'name_first',
      1: 'noun_first'
    }

    _.each(raw_trials, function(trial, i) {

      var item = trial.slice(0, trial.length-1);
      var condition = trial[trial.length-1];
      var order = orderEnum[order_list[i]];

      var jsp_trial = {
        'type': 'production-response',
        'verb': params.items[item].conditions[condition],
        'data': {
          'item': item,
          'condition': condition,
          'trial_num': i,
          'name': params.items[item].name,
          'noun': params.items[item].noun,
          'verb': params.items[item].conditions[condition],
          'order': order
        }
      };

      if(order === 'name_first') {
        jsp_trial.noun1 = jsp_trial.data.name;
        jsp_trial.noun2 = jsp_trial.data.noun;
      }
      else if(order === 'noun_first'){
        jsp_trial.noun1 = jsp_trial.data.noun;
        jsp_trial.noun2 = jsp_trial.data.name;
      }

      trials.push(jsp_trial);

    });

    timeline = prefabs.pre_experiment_block.concat(trials);
    timeline = timeline.concat(prefabs.post_experiment);
  };

  this.addPropertiesTojsPsych = function() {
    jsPsych.data.addProperties({
      workerId: subject.id
    });
  }
}

var prefabs = {
  pre_experiment_block: [
    {
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
    },
    {
      type: 'consent',
      requirements: 'You must be at least 18 years old to participate in this study. ',
      purpose: 'In this research, we are investigating the processes involved in the comprehension of sentences. ',
      procedures: 'In this study, you will be presented with sets of words and use them to create sentences. ',
      time: 'about 15 minutes',
      pay: '$1.5 USD',
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
      type: 'demographics'
    },
    {
      type: 'text',
      text: `<p class="lead mt-4">Thank you for deciding to participate in our study!</p>
             <p>In this study, you will be presented with sets of a few words each. Your task is to create a sentence using these words. You may add additional words as necessary.</p>
             <p>When you are ready to begin, please press the space bar. You will first see a practice question.</p>`,
      cont_key: [' ']
    },
    {
      type: 'text',
      text: `<p>What sentence did you come up with? Here is one possibility: "The dog was barking loudly". Here is another: "A dog barked loudly". There are many other ways to create a sentence using the words "dog", "loudly", and "barked". There is no need to overthink; just write down the first thing that comes to your mind.</p>
             <p>There will be 32 items. When you are ready to begin, please press the <strong>space bar</strong>.</p>`,
      cont_key: [' ']
    }
  ],
  post_experiment: [
    {
      type: 'text',
      cont_key: [''],
      text: function(){
          var code = 'TURK' + jsPsych.randomization.randomID(10);
          saveData(jsPsych.data.dataAsCSV(), dataRef);

          jsPsych.data.addProperties({
            code: code
          });

          return '<p class="lead">You have finished the experiment! Your responses have been saved.</p>' +
                  '<p>Your survey code is <b>' + code + '</b>. Please enter this code into your HIT. ' +
                  `You may then close this window.</p><p>If you have any questions or concerns,
                    please do not hesitate to contact the lab at
                    <a href='mailto:uchicagolanglab@gmail.com'>uchicagolanglab@gmail.com</a>.
                  </p>`;
      }
    }
  ]
}
