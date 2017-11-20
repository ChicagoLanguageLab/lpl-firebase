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
    $("#jspsych-survey-text").append('<p class="jspsych-survey-text text-center">' + trial.question + '</p>');

    // add text box
    $("#jspsych-survey-text").append('<p class="text-center"><input type="text" id="jspsych-survey-text-response" name="jspsych-survey-text-response" rows="' + trial.rows + ' columns="' + trial.columns + '"></p></input>');



    // add submit button
    display_element.append($('<p>', {
      'id': 'jspsych-survey-text-next',
      'class': 'text-center',
      'html': '<button class="jspsych-btn jspsych-survey-text">Next</button>'
    }));

    function submit(e) {

      e.preventDefault();

      var response = $("#jspsych-survey-text-response").val();

      if(response == '') {
        alert("Please answer the question.");
        return;
      }

      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // save data
      var trial_data = {
        "rt": response_time,
        "response": response
      };

      display_element.html('');

      // next trial
      jsPsych.finishTrial(trial_data);
    }

    $('#jspsych-survey-text-response').bind("enterKey",function(e){
      submit(e);
    });
    $('#jspsych-survey-text-response').on('keyup', function(e){
        if(e.keyCode == 13) $(this).trigger("enterKey");
    });

    $("#jspsych-survey-text-next").click(function(e) {
      submit(e);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
