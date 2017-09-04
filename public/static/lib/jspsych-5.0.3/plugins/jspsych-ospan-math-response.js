/**
 * jspsych-ospan-letter-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['ospan-math-response'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    trial.number = typeof trial.number == 'undefined' ? "" : trial.number;
    trial.number_correct = typeof trial.number_correct == 'undefined' ? "TRUE" : trial.number_correct;
    trial.letters = typeof trial.letters == 'undefined' ? [] : trial.letters;
    trial.timing_response = trial.timing_response || -1;

    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];

    // show preamble text
    display_element.append($('<div>', {
      "id": 'jspsych-ospan-math-number',
      "class": 'jspsych-ospan-math-number center-screen center-content very-large'
    }));

    $('#jspsych-ospan-math-number').html('<p>' + trial.number + '</p>');

    display_element.append($('<div>', {
      "id": 'jspsych-ospan-math-response',
      "class": 'jspsych-ospan-math-response center-content',
      "css": {
        'position': 'relative'
      }
    }));

    var container = $('#jspsych-ospan-math-response');
    container.append($('<div>', {
      "id": 'jspsych-ospan-math-response-buttons',
      "css": {
        'position': 'fixed',
        'bottom': '25%',
        'width': '100%'
      }
    }));

    var buttons = $('#jspsych-ospan-math-response-buttons');

    buttons.append($('<button>', {
      "id": 'jspsych-ospan-math-true',
      "class": 'jspsych-btn jspsych-ospan-math-btn',
      "css": {
        'color': 'green'
      }
    }));

    buttons.append($('<button>', {
      "id": 'jspsych-ospan-math-false',
      "class": 'jspsych-btn jspsych-ospan-math-btn',
      "css": {
        'color': 'red'
      }
    }));

    $("#jspsych-ospan-math-true").html("TRUE");
    $("#jspsych-ospan-math-true").click(function(){
      end_trial("TRUE");
    });

    $("#jspsych-ospan-math-false").html("FALSE");
    $("#jspsych-ospan-math-false").click(function(){
      end_trial("FALSE");
    });

    var startTime = (new Date()).getTime();

    var end_trial = function(response) {
      // kill any remaining setTimeout handlers
      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // save data
      var trialdata = {
        "rt": response_time,
        "response": response
      };

      display_element.html('');

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    // end trial if time limit is set
    if (trial.timing_response > 0) {
      var t2 = setTimeout(function() {
        end_trial(-1);
      }, trial.timing_response);
      setTimeoutHandlers.push(t2);
    }

  };

  return plugin;

})();
