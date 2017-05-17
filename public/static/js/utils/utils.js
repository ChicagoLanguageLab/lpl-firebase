var originalAmbiguousPoint;
var adjustedAmbiguousPoint;


function sign(num) {
    // IE does not support method sign here
    if (typeof Math.sign === 'undefined') {
        if (num > 0) {
            return 1;
        }
        if (num < 0) {
            return -1;
        }
        return 0;
    }
    return Math.sign(num);
}

function precise_round(num, decimals) {
    var t=Math.pow(10, decimals);
    return (Math.round((num * t) + (decimals>0?1:0)*(sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}

function saveData(filedata, dataRef){
    console.log("Saving progress...");
    dataRef.putString(filedata).then(function(snapshot) {
        console.log('Data has been uploaded!');
    });
}

function checkWorker(workerId, studyName, divToHide) {
    return firebase.database().ref(studyName + '/' + workerId).once('value').then(function(snapshot) {
        if(!snapshot.val()) {
            console.log("Not found!");
            return false;
        }
        console.log("Found!");
        if(snapshot.val().complete == 1) {
            console.log(workerId + " has done the thing!");

            $('#' + divToHide).hide();
            $('#error').show();
            
            return true;
        }
        return false;
    });
}

function addWorker(workerId, studyName) {
    var tokenRef = database.ref(studyName + '/' + workerId);
    tokenRef.set({
        complete : 1
    });
    console.log("Added a worker with completion value 1.");
}

function updateStatus(workerId, value) {
    var updates = {};
    updates['workerId/' + complete] = value;
    return firebase.database().ref().update(updates);
}

function objArrayToCSV(args) {  
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}

function getAllUrlParams(url) {
  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  var obj = {};
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}

function generateCalibration(type, objects, trial_distribution, colors, subtype) {
    var blocks = []
    var instructions = []

    var too_text = ' ';
    if(subtype === 'too')
        too_text = ' too ';

    for(i = 0; i < objects.length + 1; i++) {

        /* Instructions for this block */
        instructions.push({
            type: "text",
            text: '<p>In this section, you will be shown a series of images.</p>' + 
                "<p>You will be asked a question about each image. Follow the on-screen instructions to respond. Please answer based on your first instinct; there is no right or wrong answer.</p>" + 
                "<p>Please press the space bar when you are ready to begin.</p>",
            choices: [' ']
        });

        /* Generate trials */
        var trials = [];
        for (var x = 1; x < 6; x++) {
            temp = []
            for (var y = 0; y < all_colors.length; y++) {
                if(i != objects.length) {
                    temp.push({
                        stimulus: '../static/images/adaptation/' + objects[i].file + x + colors[y] + '.jpg',
                        prompt: '<p><br>Is this ' + objects[i].obj_name + too_text + objects[i].property + '?<br/><br/>Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
                        data: {scalepos: x, object: objects[i].obj_name}
                    });
                }
                else {
                    temp.push({
                        stimulus: '../static/images/adaptation/flower' + (x + 1) + colors[y] + '.jpg',
                        prompt: '<p><br/>Does this flower have four (4) petals?<br/><br/>Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
                        data: {scalepos: x, object: "flower"}
                    });
                }

            }
            trials = trials.concat(jsPsych.randomization.sample(temp, trial_distribution[x-1], true));
        }
        trials = jsPsych.randomization.shuffle(trials);
        
        /* Add a block for these trials */
        blocks.push({
            type: type,
            choices: ['F', 'J'],
            timing_post_trial: 1000,
            timeline: trials,
            on_finish: function(data){
                var has_prop = 0;
                if(data.key_press == '70')
                    has_prop = 1;
                jsPsych.data.addDataToLastTrial({has_prop: has_prop});
                jsPsych.data.addDataToLastTrial({scalepos: data.scalepos});
                jsPsych.data.addDataToLastTrial({object: data.object});
            }
        });
    }
    return [instructions, blocks];
}

function calculateAmbiguousPoint(object) {
    lr = new LogReg(5, 1);
    lr.init([1,2,3,4,5]);

    var trials = jsPsych.data.getData({object: object});

    _.each(trials, function(trial) {
        try {
            lr.addObs(trial.scalepos - 1, trial.has_prop);
        }
        catch (e) {
            xint = 3;
            console.log("Error");
            return;
        }
    });

    lr.fit();

    var xint = this.lr.xint();
    if(xint == null || isNaN(xint)) {
        xint = 3;
    }

    console.log('Xint: ' + xint)

    var best = 10000;
    var ambiguous_point = -1;
    for (var j=0; j<6; j++) {
        var dif = Math.abs(xint-j);
        if (dif < best) {
            best = dif;
            ambiguous_point = j;
        }
    }
    console.log('Best fit: ' + ambiguous_point);

    originalAmbiguousPoint = ambiguous_point;
    if(ambiguous_point <= 1)
        adjustedAmbiguousPoint = 2;
    else if(ambiguous_point >= 5)
        adjustedAmbiguousPoint = 4;
    else
        adjustedAmbiguousPoint = ambiguous_point;
}

function generatePosttest(points, objects, colors, type, voice) {
    var blocks = [];

    var too_text = '';
    if(type === '_too')
        too_text = '_too';

    for(var x = 0; x < objects.length + 1; x++) {
        // Each posttest block consists of points.length segments
        var segments = [];

        // Create the segments
        for(var z = 0; z < points.length; z++) {

            // Store trials
            var trials = [];

            // If we're not doing flowers, each segment contains three trials
            if(x < objects.length) {
                // We want to randomize the colors so the candles are less similar
                var temp = jsPsych.randomization.shuffle(colors);

                // For points to the left, center and right...
                for(var y = -1; y < 2; y++) {
                    (function (x, y, temp) {
                        trials.push({
                            timeline: [{
                                stimulus: function(){
                                    var ambiguous_point = adjustedAmbiguousPoint;
                                    // We need to make sure we don't use endpoints
                                    var image;
                                    if(ambiguous_point + y > 1 && ambiguous_point + y < 5)
                                        image =  '../static/images/adaptation/' + objects[x].file + (ambiguous_point + y) + temp[y + 1] + '.jpg'
                                    else if(ambiguous_point + y <= 1)
                                        image =  '../static/images/adaptation/' + objects[x].file + 2 + temp[y + 1] + '.jpg';
                                    else
                                        image = '../static/images/adaptation/' + objects[x].file + 4 + temp[y + 1] + '.jpg';

                                    // Return the proper image
                                    return image
                                },
                                type: "posttest-audio",
                                prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/' + objects[x].file + '_question' + too_text + voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>',
                                timing_post_trial: 0,
                                response_ends_trial: false,
                                timing_response: 3000,
                                choices: []
                            },
                            {
                                stimulus: function(){
                                    // We need to make sure we don't use endpoints
                                    var image;
                                    var ambiguous_point = adjustedAmbiguousPoint;
                                    console.log('Scale point in trial: ' + (ambiguous_point + y));
                                    if(ambiguous_point + y > 1 && ambiguous_point + y < 5)
                                        image =  '../static/images/adaptation/' + objects[x].file + (ambiguous_point + y) + temp[y + 1] + '.jpg'
                                    else if(ambiguous_point + y <= 1)
                                        image =  '../static/images/adaptation/' + objects[x].file + 2 + temp[y + 1] + '.jpg';
                                    else
                                        image = '../static/images/adaptation/' + objects[x].file + 4 + temp[y + 1] + '.jpg';

                                    // Return the proper image
                                    return image
                                },
                                prompt: '<br/><p>Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
                                type: "posttest",
                                choices: ['F', 'J'], 
                                data: {
                                    adjustment: y,
                                    object: objects[x].obj_name
                                },
                                on_finish: function(data) {
                                    var has_prop = 0;
                                    if(data.key_press == '70')
                                        has_prop = 1;

                                    var ambiguous_point = adjustedAmbiguousPoint;

                                    jsPsych.data.addDataToLastTrial({has_prop: has_prop});
                                    jsPsych.data.addDataToLastTrial({object: data.object});

                                    jsPsych.data.addDataToLastTrial({originalAmbiguousPoint: originalAmbiguousPoint});
                                    jsPsych.data.addDataToLastTrial({adjustedAmbiguousPoint: adjustedAmbiguousPoint});

                                    if(ambiguous_point + data.adjustment > 1 && ambiguous_point + data.adjustment < 5)
                                        jsPsych.data.addDataToLastTrial({scalepos: ambiguous_point + data.adjustment});
                                    else if(ambiguous_point + data.adjustment <= 1)
                                        jsPsych.data.addDataToLastTrial({scalepos: 2});
                                    else
                                        jsPsych.data.addDataToLastTrial({scalepos: 4});
                                }
                            }]
                        });
                    })(x,y,temp);
                }
            }
            else { // For flowers, just do one random posttest
                (function (y) {
                    // Get a random color and number of petals
                    var temp = jsPsych.randomization.shuffle(colors);
                    var nums = jsPsych.randomization.shuffle([2,3,4,5,6]);

                    trials.push({
                        timeline: [{
                            type: "posttest-audio",
                            stimulus: '../static/images/adaptation/flower' + nums[0] + temp[y]  + '.jpg',
                            prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/flower_question' + voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio></p><p>&nbsp;&nbsp;</p>',
                            data: {scalepos: nums[0] - 1,
                                object: "flower"
                            },
                            timing_post_trial: 0,
                            response_ends_trial: false,
                            timing_response: 3000
                        },
                        {
                            type: "posttest",
                            stimulus: '../static/images/adaptation/flower' + nums[0] + temp[y]  + '.jpg',
                            prompt: '<br/><p>Press <b>F</b> for <b>yes</b> and <b>J</b> for <b>no</b>.</p>',
                            data: {
                                scalepos: nums[0] - 1,
                                object: "flower"
                            },
                            choices: ['F', 'J'],
                            on_finish: function(data) {
                                var has_prop = 0;
                                if(data.key_press == '70')
                                    has_prop = 1;

                                jsPsych.data.addDataToLastTrial({has_prop: has_prop});
                                jsPsych.data.addDataToLastTrial({object: data.object});
                                jsPsych.data.addDataToLastTrial({scalepos: data.scalepos});
                            }
                        }]
                    });
                }(y));
            }

            // Now we push the trials to a segment
            segments.push({
                type: "posttest",
                timeline: trials
            });
        }
        // Push all segments to the block
        blocks.push(segments);
    }
    return blocks;
}

function generateExposure(objects, colors, condition, type, voice) {
    var segments = [];
    var instructions = [];
    var instruction_text;

    if(voice !== "_z") {
        instruction_text = "<p>In this section you will see a sequence of images. " + 
                           "You will also hear a verbal description of each image. " + 
                           "Please listen carefully to each description. " + 
                           "Periodically, you will answer some questions about the images.</p>" + 
                           "<p>Be sure to remain focused on the center of the screen. " + 
                           "Every so often, a \"+\" symbol will be briefly displayed in the center of the screen, " +
                           "and you will be asked a question about it. " +
                           "Please do your best to answer the question accurately.</p> " +
                           "<p>Press the space bar when you are ready to begin.</p>";
    }
    else {
        instruction_text = "<p>In this section, you will see a sequence of images. " + 
                           "You will also listen to sentences recorded using a speech synthesizer we are testing. " + 
                           "Periodically, you will answer some questions.</p>" + 
                           "<p>Be sure to remain focused on the center of the screen. " + 
                           "Every so often, a \"+\" symbol will be briefly displayed in the center of the screen, " +
                           "and you will be asked a question about it. " +
                           "Please do your best to answer the question accurately.</p> " +
                           "<p>Press the space bar when you are ready to begin.</p>";
    }
    for(var i = 0; i < objects.length + 1; i++) {
        /* Add the instructions */
        instructions.push({
            type: "text",
            text: instruction_text,
            choices: [' ']
        });

        var trials = [];
        for(var x = 0; x < 4; x++) {
            for(var y = 0; y < 6; y++) {
                (function (x, y, i) {
                    var statement; 
                    var timing;
                    if(x == 0 && y == 0){ //&& voice != "_z") {
                        statement = 5;
                        timing = 7500;
                    }
                    else {
                       statement = x + 1;
                       timing = 4500;
                   }
                    
                    if(i < objects.length) {
                        trials.push({
                            type: "exposure",
                            response_ends_trial: false,
                            timing_response: timing,
                            choices: [],
                            stimulus: function(){
                                var ambiguous_point = adjustedAmbiguousPoint;
                                if(condition == "ambiguous") {
                                    return '../static/images/adaptation/' + objects[i].file + ambiguous_point + colors[x] + '.jpg'
                                }
                                else if (condition == "prototypical") {
                                    if (type == "_neg") {
                                        return '../static/images/adaptation/' + objects[i].file + 1 + colors[x] + '.jpg'
                                    }
                                    else {
                                        return '../static/images/adaptation/' + objects[i].file + 5 + colors[x] + '.jpg'
                                    }
                                }
                            },
                            data: {object: objects[i].obj_name},
                            prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/' + objects[i].file + '_statement' + statement + type + voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio>',
                            on_finish: function(data){
                                var ambiguous_point = adjustedAmbiguousPoint;

                                jsPsych.data.addDataToLastTrial({originalAmbiguousPoint: originalAmbiguousPoint});
                                jsPsych.data.addDataToLastTrial({adjustedAmbiguousPoint: adjustedAmbiguousPoint});

                                jsPsych.data.addDataToLastTrial({object: data.object});
                                
                                if(condition == "ambiguous") {
                                    jsPsych.data.addDataToLastTrial({scalepos: ambiguous_point});
                                }
                                else if (condition == "prototypical") {
                                    if (type == "_neg") {
                                        jsPsych.data.addDataToLastTrial({scalepos: 1});
                                    }
                                    else {
                                        jsPsych.data.addDataToLastTrial({scalepos: 5});
                                    }
                                }
                            }
                        });
                    }
                    else {
                        trials.push({
                            type: "exposure",
                            response_ends_trial: false,
                            timing_response: timing,
                            choices: [],
                            stimulus: function(){
                                return '../static/images/adaptation/flower4' + colors[x] + '.jpg'
                            },
                            prompt: '<p><audio preload="auto" class="hidden" autoplay="autoplay"><source src="../static/sound/adaptation/flower_statement' + statement + voice + '.mp3" type="audio/mp3" /> [NOT SUPPORTED]</audio>',
                            on_finish: function(data){
                                jsPsych.data.addDataToLastTrial({object: "flower"});
                                jsPsych.data.addDataToLastTrial({scalepos: 4});
                            }
                        });
                    }
                }(x, y, i));
            }
        }
        segments.push(trials);
    }
    return [instructions, segments];
}

function generateAttentionTrials(num, objects) {
    var blocks = []
    for(var x = 0; x < objects.length + 1; x++) {
        var segments = []
        var colors = jsPsych.randomization.sample(["red", "blue"], num, true);
        for(var i = 0; i < num; i++) {
            console.log(colors[i]);
            segments.push({
                type: "attention",
                choices: ['R', 'B'],
                is_html: true,
                timeline: [{
                    stimulus: '<p><span style="font-size: 24pt; color:' + colors[i] + ';"><b>+</b></span></p>',
                    response_ends_trial: false,
                    timing_response: 500
                }, {
                    stimulus: '<p></p>',
                    prompt: '<p>What was the color of the "+" you just saw?<br/>Press <b>R</b> for <b>red</b> and <b>B</b> for <b>blue</b>.</p>',
                    data: {color: colors[i]},
                    on_finish: function(data) {
                        if(data.key_press == '82' && data.color == 'red') {
                            jsPsych.data.addDataToLastTrial({correct: 1});
                        }
                        else if (data.key_press == '66' && data.color == 'blue') {
                            jsPsych.data.addDataToLastTrial({correct: 1});
                        }
                        else {
                            jsPsych.data.addDataToLastTrial({correct: 0});
                        }
                    }
                }]
            });
        }
        blocks.push(segments);
    }
    return blocks;
}