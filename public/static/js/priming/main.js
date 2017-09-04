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

var timeline = [prefabs.pre_experiment_block];

timeline.push({
  type: 'text',
  text: instructions,
  cont_key: [' ']
});

timeline.push(prefabs.speaker);
timeline.push(prefabs.microphone);

$( document ).ready(function() {

  var params   = jsPsych.data.urlVariables();
  var sentence = params.sentence;
  var image    = params.image;
  var verb     = params.verb;
  var workerId = params.workerId;

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

  checkWorker(workerId, 'priming-study', ['jspsych-target']);

  jsPsych.init({
    timeline: timeline,
    show_progress_bar: true,
    display_element: $('#jspsych-target')
  });
});
