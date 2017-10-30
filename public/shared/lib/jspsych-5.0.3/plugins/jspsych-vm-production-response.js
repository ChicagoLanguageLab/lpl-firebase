/**
 * jspsych-vm-production-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['vm-production-response'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;
    trial.rows = typeof trial.rows == 'undefined' ? 1 : trial.rows;
    trial.columns = typeof trial.columns == 'undefined' ? 80 : trial.columns;
    trial.required = typeof trial.required == 'undefined' ? false : trial.required;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // show preamble text
    display_element.append($('<div>', {
      "id": 'jspsych-survey-text-preamble',
      "class": 'small'
    }));

    $('#jspsych-survey-text-preamble').html('<p>' + trial.preamble + '</p>');

    // add question

    display_element.append($('<div>', {
        "id": 'jspsych-survey-text',
        "class": 'jspsych-survey-text-question'
      }));

    // add question text
    $("#jspsych-survey-text").append('<p class="jspsych-survey-text">' + trial.question + '</p>');

    // add text box
    $("#jspsych-survey-text").append('<p><input type="text" id="jspsych-survey-text-response" name="jspsych-survey-text-response" rows="' + trial.rows + ' columns="' + trial.columns + '"></p></input>');



    // add submit button
    display_element.append($('<button>', {
      'id': 'jspsych-survey-text-next',
      'class': 'jspsych-btn jspsych-survey-text'
    }));
    $("#jspsych-survey-text-next").html('Next');

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
