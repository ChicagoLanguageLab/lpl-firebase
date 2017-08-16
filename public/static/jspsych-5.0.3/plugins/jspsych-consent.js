/**
 * jspsych-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["consent"] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    // default trial parameters
    trial.button_html = trial.button_html || '<button class="jspsych-btn">%choice%</button>';
    trial.requirements = trial.requirements || '{{REQUIREMENTS_APPEAR_HERE}}. '
    trial.purpose = trial.purpose || '{{PURPOSE_APPEARS_HERE}}. '
    trial.procedures = trial.procedures || '{{PROCEDURES_APPEAR_HERE}}. '
    trial.time = trial.time || '{{EXPERIMENT_ESTIMATED_TIME}}'
    trial.pay = trial.pay || '{{EXPERIMENT_PAY}}'

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];

    // consent_element holds the title, form, and buttons.
    consent_element = $('<div>', {
        class: '',
        id: 'consent',
    });

    // consent_block holds the actual text of the consent form
    consent_block = $('<div>', {
      class: ''
    });

    display_element.append($('<div>', {
      class: 'header'
    }).append($('<h1>', {
      class: 'title',
      html: 'We need your consent to proceed.'
    })).append($('<p>', {
      class: 'lead',
      html: trial.requirements + 'The results of this experiment may be summarized in scientific publications. Before you agree to participate, please read the terms under which you consent to participate.'
    })));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Purpose of study'
    }));
    consent_block.append($('<p>', {
      html: trial.purpose + 'The information collected in this study will be used in the preparation of papers for presentation in international conferences and journals concerned with linguistic research.'
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Procedures'
    }));
    consent_block.append($('<p>', {
      html: trial.procedures
    }));
    consent_block.append($('<p>', {
      html: 'The entire process will take ' + trial.time + '. Upon completion, you will be compensated with ' + trial.pay + '.'
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Risks'
    }));
    consent_block.append($('<p>', {
      html: 'There are no known risks involved in this experimental procedure.'
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Benefits'
    }));
    consent_block.append($('<p>', {
      html: 'There are no immediate benefits of this research. In the long term, however, this research may help in the design of effective methods for language instruction and treatment of language disorders.'
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Confidentiality'
    }));
    consent_block.append($('<p>', {
      html: 'Your results will be kept completely confidential. Your name will not appear in any publication or presentation. To maximize confidentiality, your results will be assigned to a subject number even for our own analyses.'
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Request for more information'
    }));
    consent_block.append($('<p>', {
      html: 'If you have questions about this research, please contact Dr. Ming Xiang at 1115 E. 58th St., Rosenwald 205B. Phone (773) 702-8023. Email: mxiang, followed by "at"-sign, followed by "uchicago" dot "edu".'
    }));
    consent_block.append($('<p>', {
      html: `If you have any questions about your rights as a participant in this research,
        you can contact the following office at the University of Chicago:
        Social & Behavioral Sciences Institutional Review Board, University of Chicago, 1155 E. 60th street,
        Room 418, Chicago IL 60637. Phone: (773) 834-7835. Fax: (773) 834-8700. Email: sbs-irb@uchicago.edu.`
    }));

    consent_block.append($('<h2>', {
      class: 'mt-4',
      html: 'Refusal or withdrawal of participation'
    }));
    consent_block.append($('<p>', {
      class: 'mb-4',
      html: 'Your participation in this study is purely voluntary. You may withdraw from this study at any time, though note that doing so means that you agree to forfeit payment.'
    }));

    button_container = $('<div>', {
      class: 'd-flex justify-content-around'
    });

    button_container.append($('<div>', {
      class: 'p-2'
    }).append($('<button>', {
        class: 'row-md-3 btn btn-light',
        html: '<span class="fa fa-check" aria-hidden="true"></span> Yes, I would like to proceed with this study.'
      })
      .on('click', function(e) {
        handle_response(true);
      })));
    button_container.append($('<div>', {
      class: 'p-2'
    }).append($('<button>', {
        class: 'row-md-3 btn btn-light',
        html: '<span class="fa fa-ban" aria-hidden="true"></span> No thanks, I do not want to do this study.'
      })
      .on('click', function(e) {
        handle_response(false);
      })));

    consent_element.append(consent_block);
    consent_element.append($('<div>', {
      class: 'footer text-center'
    }).append($('<p>', {
      class: 'lead',
      html: `<i>By participating in this experiment, I confirm that I meet its requirements
      and that I understand the purpose of the research, the study procedures that I will undergo, and
      the possible risks and discomforts and/or benefits that I may experience.
      I have read and understand these terms of consent. Therefore, I agree to give my consent
      to participate as a subject in this research project.</i><hr class="style-eight" />`
    })).append(button_container));

    display_element.append(consent_element);

    // store response
    var response = {
      rt: -1,
      button: -1
    };

    // start time
    var start_time = 0;

    // function to handle responses by the subject
    function handle_response(consented) {

      // measure rt
      var end_time = Date.now();
      var rt = end_time - start_time;

      response.rt = rt;
      trial.consented = consented;

      end_trial();
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      for (var i = 0; i < setTimeoutHandlers.length; i++) {
        clearTimeout(setTimeoutHandlers[i]);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "consented": trial.consented
      };

      // clear the display
      display_element.html('');

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // start timing
    start_time = Date.now();
  };

  return plugin;
})();
