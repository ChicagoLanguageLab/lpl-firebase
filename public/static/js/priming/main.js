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

var timeline = [];
timeline.concat(prefabs.pre_experiment_block);

timeline.push({
  type: 'text',
  text: instructions,
  cont_key: [' ']
});

timeline.push(prefabs.speaker);
timeline.push(prefabs.microphone);

var params   = jsPsych.data.urlVariables();
var workerId = params.workerId;
var sentence = params.sentence;
var image    = params.image;
var verb     = params.verb;

var paramString = window.location.href.split('?')[1];
var dataRef = storageRef.child('priming/07-25-2017/' + params.workerId + '.csv');

timeline.push({
  type: 'single-stim',
  stimulus: '<p class="center-screen text-center very-large">' + sentences[sentence] + '</p>',
  is_html: true,
  timing_response: 3000,
  timing_post_trial: 0,
  choices: []
});

timeline.push({
  type: 'single-stim',
  prompt: '<p class="text-center"><audio controls preload="auto" autoplay="autoplay"><source src="../static/sound/priming/' + sentence + '.mp3" type="audio/mp3" />[NOT SUPPORTED]</audio></p>',
  is_html: true,
  stimulus: '<p class="center-screen text-center very-large">' + sentences[sentence] + '</p>',
  timing_response: 7000,
  choices: [],
  timing_post_trial: 0
});

timeline.push({
  type: 'single-stim',
  prompt: '<p class="text-center"><audio controls preload="auto"><source src="../static/sound/priming/' + sentence + '.mp3" type="audio/mp3" />[NOT SUPPORTED]</audio><br/>Press the <strong>space bar</strong> to continue.</p>',
  is_html: true,
  stimulus: '<p class="center-screen text-center very-large">' + sentences[sentence] + '</p>',
  timing_response: -1,
  choices: [' '],
  timing_post_trial: 0,
  on_finish: function() {
    saveData(jsPsych.data.dataAsCSV(), dataRef, function() {
      window.location.href = 'response.html?' + paramString;
    });
  }
});

$( document ).ready(function() {

  checkWorker(workerId, 'priming-study').then(function(snapshot) {
    if(snapshot.val() && snapshot.val().complete == 1) {
      console.log('Worker has already completed the experiment.');
      showError();
    }
    else {
      console.log('Worker has not yet completed the experiment.');

      jsPsych.init({
        timeline: timeline,
        show_progress_bar: true,
        display_element: $('#jspsych-target')
      });
    }
  });
});
