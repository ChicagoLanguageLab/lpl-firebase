/**
 * jspsych-production-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['production-response'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;
    trial.required = typeof trial.required == 'undefined' ? false : trial.required;

    trial.noun1 = typeof trial.noun1 == 'undefined' ? false : trial.noun1;
    trial.noun2 = typeof trial.noun2 == 'undefined' ? false : trial.noun2;
    trial.verb = typeof trial.verb == 'undefined' ? false : trial.verb;
    trial.practice = typeof trial.practice == 'undefined' ? false : trial.practice;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // show preamble text
      display_element.append($('<div>', {
        "id": 'jspsych-survey-text-preamble',
        "class": 'text-center mt-4 small'
      }));

      $('#jspsych-survey-text-preamble').html('<p>' + trial.preamble + '</p>');

    // add question

    display_element.append($('<div>', {
        "id": 'jspsych-survey-text',
        "class": 'jspsych-survey-text-question text-center'
      }));

    // add question text
    $("#jspsych-survey-text").append('<p class="jspsych-survey-text">' + trial.noun1 + ', ' + trial.noun2 + ', ' + trial.verb + '</p>');

    // add text box
    $("#jspsych-survey-text").append('<input type="text" id="jspsych-survey-text-response" name="jspsych-survey-text-response" size="' + 80 + '"></input>');

    // add submit button
    var div = $('<div>', {
      'class': 'text-center'
    });

    div.append($('<button>', {
      'id': 'jspsych-survey-text-next',
      'class': 'jspsych-btn jspsych-survey-text',
      'html': 'Next'
    }));
    display_element.append(div);

    function submit() {
      var response = $("div.jspsych-survey-text-question").children('input').val();

      if(response == '') {
        alert("Please answer the question.");
        return;
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

    $('#jspsych-survey-text-response').bind("enterKey",function(e){
      submit();
    });
    $('#jspsych-survey-text-response').on('keyup', function(e){
        if(e.keyCode == 13) $(this).trigger("enterKey");
    });

    $("#jspsych-survey-text-next").click(function() {
      submit();
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
