/**
 * jspsych-ospan-letter-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['ospan-letter-response'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {
    trial.instructions = typeof trial.instructions == 'undefined' ? "" : trial.instructions;
    trial.letters = typeof trial.letters == 'undefined' ? [] : trial.letters;
    trial.nrows = typeof trial.nrows == 'undefined' ? 1 : trial.nrows;
    trial.ncols = typeof trial.ncols == 'undefined' ? 1 : trial.ncols;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // show preamble text
    display_element.append($('<div>', {
      "id": 'jspsych-ospan-instructions',
      "class": 'jspsych-ospan-instructions'
    }));
    $('#jspsych-ospan-instructions').html(trial.instructions);


    display_element.append($('<table>', {
        "id": 'jspsych-ospan-letter-grid',
        "class": 'jspsych-ospan-letter-grid center-content',
        "css": {
          'border-collapse': 'collapse',
          'margin-left': 'auto',
          'margin-right': 'auto'
        }
      }));

    var grid = $('#jspsych-ospan-letter-grid');

    for (var i = 0; i < trial.nrows; i++) {
      grid.append($('<tr>', {
        "id": 'jspsych-ospan-letter-grid-row-' + i
      }));

      var row = $('#jspsych-ospan-letter-grid-row-' + i);

      for (var j = 0; j < trial.ncols; j++) {
        var letter = i * trial.ncols + j;

        row.append($('<td>', {
          "id": 'jspsych-ospan-letter-grid-entry-' + i + '-' + j
        }));

        var cell = $('#jspsych-ospan-letter-grid-entry-' + i + '-' + j);

        cell.append($('<button>', {
          "id": 'jspsych-ospan-letter-' + letter,
          "class": 'jspsych-btn jspsych-ospan-letter'
        }));

         $("#jspsych-ospan-letter-" + letter).html(trial.letters[letter]);

         (function(a) {
            $("#jspsych-ospan-letter-" + a).click(function(){
              $("#jspsych-ospan-letter-response-box").html($("#jspsych-ospan-letter-response-box").html() + trial.letters[a]);
          });
        }(letter));
      }
    }

    var specialButtons = ['', 'BLANK', 'CLEAR'];

    grid.append($('<tr>', {
      "id": 'jspsych-ospan-letter-grid-row-' + trial.nrows
    }));

    var row = $('#jspsych-ospan-letter-grid-row-' + trial.nrows);

    for(var i = 0; i < 3; i++) {
      row.append($('<td>', {
        "id": 'jspsych-ospan-letter-grid-entry-' + trial.nrows + '-' + i
      }));

      if(specialButtons[i] == '') continue;

      var cell = $('#jspsych-ospan-letter-grid-entry-' + trial.nrows + '-' + i);

      cell.append($('<button>', {
        "id": 'jspsych-ospan-letter-' + specialButtons[i],
        "class": 'jspsych-btn jspsych-ospan-letter'
      }));

      $("#jspsych-ospan-letter-" + specialButtons[i]).html(specialButtons[i]);

      if(specialButtons[i] == "BLANK") {
        $("#jspsych-ospan-letter-BLANK").click(function(){
          $("#jspsych-ospan-letter-response-box").html($("#jspsych-ospan-letter-response-box").html() + "_");
          //console.log("Clicked BLANK");
        });
      }
      else {
        $("#jspsych-ospan-letter-CLEAR").click(function(){
          $("#jspsych-ospan-letter-response-box").html("");
          //console.log("Clicked CLEAR");
        });
      }
    }

    display_element.append($('<div>', {
        "id": 'jspsych-ospan-letter-response',
        "class": 'jspsych-ospan-letter-response very-large',
        "css" : {
          'text-align': 'right'
        }
      }));

    // add text boxpan-response" cols="1" rows="10"></textarea>');
    $("#jspsych-ospan-letter-response").append('<p>Selected letters:&nbsp;&nbsp;&nbsp;&nbsp;<span id="jspsych-ospan-letter-response-box" name="jspsych-ospan-letter-response-box"></span></p>');

    display_element.append($('<div>', {
        "id": 'jspsych-ospan-letter-submit-container',
        "class": 'jspsych-ospan-letter-submit-container',
        "css" : {
          'text-align': 'right'
        }
      }));

    // add submit button
    $('#jspsych-ospan-letter-submit-container').append($('<button>', {
      'id': 'jspsych-ospan-submit',
      'class': 'jspsych-btn jspsych-ospan-letter-submit'
    }));

    $("#jspsych-ospan-submit").html('SUBMIT');
    $("#jspsych-ospan-submit").click(function() {

      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // save data
      var trialdata = {
        "rt": response_time,
        "response": $('#jspsych-ospan-letter-response-box').html()
      };

      display_element.html('');

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
