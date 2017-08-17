/* Firebase initialization */

var config = {
    apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
    databaseURL: "https://language-processing-lab.firebaseio.com/",
    storageBucket: "gs://language-processing-lab.appspot.com"
};
firebase.initializeApp(config);

var storageRef = firebase.storage().ref();
var database = firebase.database();


/* Read in data sent from Mechanical Turk */

var params = getAllUrlParams();


/* Create a unique instance of the experiment */

var experiment_instance = {

  stimuli: jsPsych.randomization.shuffle(init_data.stimuli),

  subject: {
    id: params.workerId,
    code: 'TURK' + jsPsych.randomization.randomID(10)
  },

  condition: params.condition,
  subtype: params.subtype,
  voice: params.voice,

  exposure_colors: jsPsych.randomization.shuffle(init_data.exposure_colors),
  posttest_colors: jsPsych.randomization.shuffle(init_data.posttest_colors),

  max_scalepos: 5,
  trial_distribution: [3,7,10,7,3],
  posttest_points: [2, 4, 8, 13, 20, 24],
  attention_points: [5, 10, 17, 22]

}

var _e = experiment_instance; // shorthand for experiment instance

_e.colors = _e.exposure_colors.concat(_e.posttest_colors);
_e.current_stim_set = _e.stimuli[0].name;

var dataRef = storageRef.child('2-24-2017-run1/' + _e.subject.id + _e.condition + _e.subtype + _e.voice + '.csv');

/* Generate end blocks for first calibration */
var end_blocks_pretest = generateEndBlocks(_e);

/* Generate all three calibration blocks */
var calibration_data         = generateCalibration(_e, trial_prefabs, false);
var calibration_instructions = calibration_data[0];
var calibration_blocks       = calibration_data[1];

/* Generate post-calibration blocks */
var post_calibration_data         = generateCalibration(_e, trial_prefabs, true);
var post_calibration_instructions = post_calibration_data[0];
var post_calibration_blocks       = post_calibration_data[1];

/* Generate exposure, , and attention trials */
var exposure_blocks = generate_exposure_posttest(_e, trial_prefabs);

/* Depending on the voice condition, the audio instructions need to differ */
var audio_test_block;
if(_e.voice === 'z')
  audio_test_block = audio_test_block_synth;
else
  audio_test_block = audio_test_block_human;

/* Holds the experiment structure */
var experiment_blocks = [];

/* Initial pre-experiment displays */
experiment_blocks.push({type: 'demographics'});
experiment_blocks.push(pre_consent);
experiment_blocks.push(consent);
experiment_blocks.push(check_consent);
experiment_blocks.push(expt_consented);

// Add the pretests, exposure, and post-tests
for(var x = 0; x < calibration_blocks.length; x++) {
    experiment_blocks.push(calibration_instructions[x]);
    experiment_blocks.push(calibration_blocks[x]);
    experiment_blocks.push(end_blocks_pretest[x]);

    experiment_blocks.push(exposure_blocks[x]);
}

// Reprise the pretests
for(var x = 0; x < post_calibration_blocks.length; x++) {
    experiment_blocks.push(post_calibration_instructions[x]);
    experiment_blocks.push(post_calibration_blocks[x]);
    if(x == post_calibration_blocks.length-1)
        experiment_blocks.push(end_block_last);
    else
        experiment_blocks.push(end_block);
}

experiment_blocks.push(final_block);

$( document ).ready(function() {

    /* Initialize experiment */

    jsPsych.init({
      timeline: experiment_blocks,
      show_progress_bar: true,
      display_element: $('#jspsych-target')
    });

});
