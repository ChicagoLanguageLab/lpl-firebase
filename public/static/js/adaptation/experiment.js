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

/* Experiment values */
var trial_distribution = [3,7,10,7,3];

/* jsPsych data */
var params = getAllUrlParams();

var workerId = params.workerId;
if(workerId == undefined || workerId == "")
    workerId = "TEST";

var condition = params.condition;
if(condition == undefined || condition == "")
    condition = "ambiguous";

var subtype = params.subtype;
if(subtype == undefined || subtype == "") {
    subtype = "pos";
}

var voice = params.voice;
if(voice == undefined || voice == "") {
    voice = "en";
}

var code = 'TURK' + jsPsych.randomization.randomID(10);
var dataRef = storageRef.child('2-24-2017-run1/' + workerId + condition + subtype + voice + '.csv');

console.log("Worker ID: " + workerId + "\nCondition: " + condition + "\nSubtype:   " + subtype + "\nVoice:     " + voice + "\nCode:      " + code);

/* The objects we will test on */
var objects = jsPsych.randomization.shuffle([{obj_name: 'candle', property: 'tall', file: 'candle', article: 'a'},{obj_name: 'bar', property: 'bent', file: 'straightrod', article: 'a'},{obj_name: 'pillow', property: 'plain', file: 'pillow', article: 'a'}]);

/* Define colorsets */
var exposure_colors = jsPsych.randomization.shuffle(['', '_red', '_blue', '_lgreen']);
var posttest_colors = ['_purple', '_lblue', '_pink'];
var all_colors = exposure_colors.concat(posttest_colors);

var welcome_block_1 = {
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

/* First experiment block. TODO: Write overview of experiment. */
var welcome_block = {
    type: "text",
    text: '<p class="lead mt-4">Thank you for deciding to participate in our study!</p><p>This study has multiple sections. Each section is only a few minutes long. In between sections, you can take short breaks if you need to, but please do not take breaks within a section. When you are ready to begin, please press the <strong>space bar</strong>.</p>',
    choices: [' ']
};

var if_node = {
  conditional_function: function() {
    var data = jsPsych.data.getLastTrialData();
    console.log(data.consented);
    return !data.consented;
  },
  timeline: [{
    type: 'text',
    cont_key: [''],
    text: "Oops!"
  }]
};

/* Generate end blocks for first calibration */
var end_blocks_pretest = [];
for(var i = 0; i < objects.length + 1; i++) {
    (function (i) {
        end_blocks_pretest.push({
            type: "text",
            choices: [' '],
            text: function() {
                if(i < objects.length)
                    calculateAmbiguousPoint(objects[i].obj_name);
                return "<p>You have finished this section. You can take a short break now if you want to.</p><p>Please press the space bar when you are ready to continue.</p>";
            },
            on_finish: function(data){
                saveData(jsPsych.data.getDataAsCSV(), dataRef);
            }
        });
    }(i));
}

/* Generic end-block for the other sections */
var end_block_general = {
    type: "text",
    choices: [' '],
    text: function() {
        return "<p>You have finished this section. You can take a short break now if you want to.</p><p>Please press the space bar when you ready to continue.</p>";
    },
    on_finish: function(data){
        saveData(jsPsych.data.getDataAsCSV(), dataRef);
    }
};

var end_block_last = {
    type: "text",
    choices: [' '],
    text: function() {
        return "<p>You have finished this section. You can take a short break now if you want to.</p><p>Please press the space bar when you ready to continue.</p>";
    },
    on_finish: function(data){
        saveData(jsPsych.data.getDataAsCSV(), dataRef);
        addWorker(workerId, 'adaptation-study');
    }
};

/* Generate all three calibration blocks */
var calibration_data = generateCalibration("calibration", objects, trial_distribution, all_colors, subtype);
var calibration_instructions    = calibration_data[0];
var calibration_blocks          = calibration_data[1];

/* Generate exposure segments; blocks come later */
var exposure_data           = generateExposure(objects, exposure_colors, condition, '_' + subtype, '_' + voice);
var exposure_instructions   = exposure_data[0];
var exposure_segments       = exposure_data[1];

/* Generate posttest */
var posttest_points = [2, 4, 8, 13, 20, 24];
var posttest_blocks = generatePosttest(posttest_points, objects, posttest_colors, '_' + subtype, '_' + voice);

/* Generate post-calibration blocks */
var post_calibration_data = generateCalibration("post-calibration", objects, trial_distribution, all_colors, subtype);
var post_calibration_instructions   = post_calibration_data[0];
var post_calibration_blocks         = post_calibration_data[1];

/* Generate attention trials */
var attention_blocks = generateAttentionTrials(4, objects);
var attention_points = [5, 10, 17, 22];

/* Intersperse exposure phase with posttests */
var exposure_blocks = [];
for(var x = 0; x < exposure_segments.length; x++) {
    var exposure_trials = [];
    for(var i = 1; i < exposure_segments[x].length + 1; i++) {
        exposure_trials.push(exposure_segments[x][i-1]);

        // At the specified points, add three posttest trials (one segment)
        if(_.contains(posttest_points, i)) {
            exposure_trials.push(posttest_blocks[x].shift());
        }
        if(_.contains(attention_points, i)) {
            exposure_trials.push(attention_blocks[x].shift());
        }
    }

    // Push all the trials to a block
    exposure_blocks.push({
        type: "exposure",
        timeline: exposure_trials,
        timing_post_trial: 1000
    });
}

var final_block = {
    type: "text",
    choices: [''],
    text: function(){
        return "<p>You have finished the experiment! Your responses have been saved.</p><p>Your survey code is <b>" + code + "</b>. Please enter this code into your HIT. You may then close this window.</p><p>If you have any questions or concerns, please do not hesitate to contact the lab at <a href='mailto:uchicagolanglab@gmail.com'>uchicagolanglab@gmail.com</a>.";
    }
}

var audio_test_block;
if(voice === 'TEMP') {
    audio_test_block = {
        timeline: [{
            type: "text",
            choices: ['F', 'J'],
            text: '<p>We are testing a speech synthesizer that can imitate human voice. In this section you will hear some verbal statements made by this synthesizer. Did you turn your speaker on?</p><p>Press <b>F</b> for "yes" and <b>J</b> for "no".</p>',
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
else {
    audio_test_block = {
        timeline: [{
            type: "text",
            choices: ['F', 'J'],
            text: '<p>You will listen to some verbal statements in this section. Did you turn your speaker on?</p><p>Press <b>F</b> for "yes" and <b>J</b> for "no".</p>',
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

/* Holds the experiment structure */
var experiment_blocks = [];

var consent = {
  type: 'consent',
  requirements: 'You must be at least 18 years old to participate in this study. ',
  purpose: 'In this research, we are investigating the processes involved in the comprehension of sentences and/or stories. ',
  procedures: 'In this study, you will be presented with a series of images and descriptions and provide feedback on them, as directed in the experimental instructions. You will also listen to some audio about a set of images. ',
  time: 'about 30-40 minutes',
  pay: '$4 USD'
};


experiment_blocks.push(welcome_block_1);
experiment_blocks.push(consent);
experiment_blocks.push(if_node);
experiment_blocks.push(welcome_block);

// Add the pretests, exposure, and post-tests
for(var x = 0; x < calibration_blocks.length; x++) {
    experiment_blocks.push(calibration_instructions[x]);
    experiment_blocks.push(calibration_blocks[x]);
    experiment_blocks.push(end_blocks_pretest[x]);

    experiment_blocks.push(exposure_instructions[x]);
    experiment_blocks.push(audio_test_block);
    experiment_blocks.push(exposure_blocks[x]);
    experiment_blocks.push(end_block_general);
}

// Reprise the pretests
for(var x = 0; x < post_calibration_blocks.length; x++) {
    experiment_blocks.push(post_calibration_instructions[x]);
    experiment_blocks.push(post_calibration_blocks[x]);
    if(x == post_calibration_blocks.length-1)
        experiment_blocks.push(end_block_last);
    else
        experiment_blocks.push(end_block_general);
}

experiment_blocks.push(final_block);

$( document ).ready(function() {

    /*checkWorker(workerId, 'adaptation-study');

    $('#progress-bar').hide();
    $('#jspsych-target').hide();
    $('#no-consent').hide();
    $('#demographics').hide();
    $('#consent').hide();


    $('button.browser').click(function(e){
        e.preventDefault();
        $('#browser').hide();
        $('#consent').show();
    });
    $('button.consent').click(function(e){
        e.preventDefault();
        $('#consent').hide();
        $('#demographics').show();
    });
    $('button.no-consent').click(function(e){
        e.preventDefault();
        $('#consent').hide();
        $('#no-consent').show();
    });

    $('#submit-demographics').click(function(e) {
        e.preventDefault();

        var gender = $("input[type='radio'][name='gender']:checked").val();
        var age = $('#age').val();
        var state = $('#state').val();
        var natLang = $('#natLang').val();
        var domLang = $('#domLang').val();
        var prtLang = $('#prtLang').val();
        var otherLang = $('#otherLang').val();

        if(age == "" || state == "" || natLang == "" || domLang == "" || prtLang == "" || gender == undefined || gender == "") {
            alert("Please answer all of the questions.");
            return;
        }

        if((/\D/.test(age))){
            alert("Age must be a number.");
            return;
        }
        age = parseInt(age, 10);

        console.log("Gender: " + gender + " Age: " + age + " State: " + state + " Native: " + natLang + " Dominant: " + domLang + " Parent: " + prtLang + " Other: " + otherLang);

        $('#header').hide();
        $('#demographics').hide(); */

        /* Initialize experiment */
        jsPsych.init({
            timeline: experiment_blocks,
            show_progress_bar: true,
            display_element: $('#jspsych-target')
        });

        /* Append data */
        /*jsPsych.data.addProperties({
            workerId: workerId,
            condition: condition,
            subtype: subtype,
            voice: voice,
            code: code,
            age: age,
            gender: gender,
            state: state,
            nativeLg: natLang,
            dominantLg: domLang,
            parentLgs: prtLang,
            foreignLgs: otherLang
        });
    });*/
});
