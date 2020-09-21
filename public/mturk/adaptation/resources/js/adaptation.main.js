// runner.js

// This file loads the stimuli in stimuli.json and initializes an Experiment
// object.

// The trials created by the Experiment are then send to jsPsych,
// which runs the experiment.


/*************************************************************************
* ON DOCUMENT READY
**************************************************************************/

$( document ).ready(function() {

  urlVars = jsPsych.data.urlVariables();

  getParticipantCompletion("adaptation-workers", urlVars.participantId, '')
    .then(function(snapshot) {

      if(snapshot.val() && snapshot.val().complete) {
        console.log('This participant has already completed the experiment!');
        showUserError();
      }

      else {
        console.log('This participant has not yet completed the experiment. :)');
        loadStimuliAndRun("resources/data/adaptation.data.json");
      }

  });
});


/*************************************************************************
* jsPSYCH RUNNER
**************************************************************************/

/* Calls jsPsych.init() to run the experiment
 *
 * experiment.getTimeline() returns the timeline created by the Experiment
 * object, which is passed to jsPsych.
 * experiment.onFinish() defines what jsPsych does once the experiment is done.
 */

function initializeJsPsych(experiment) {

  experiment.createTimeline()
  experiment.addPropertiesTojsPsych()
  experiment.setStorageLocation()

  jsPsych.init({
    timeline: experiment.getTimeline(),
    show_progress_bar: true,
    display_element: $('#jspsych-target'),
    on_finish: function() {
      experiment.onFinish()
    }
  });
}


/*************************************************************************
* EXPERIMENT LOADER AND HELPER FUNCTIONS
**************************************************************************/

/* Try to load the JSON file
 *
 * On success - calls returnStimuli()
 * On failure - displays an error message in the console
 */
function loadStimuliAndRun(file) {
  $.getJSON(file, initializeExperimentWithStimuli).fail(showConsoleError);
}

/* Initialize an Experiment object with loaded stimuli and storage instance
 * and send the experiment to jsPsych.
 * All URL variables are also passed to the Experiment object.
 */
function initializeExperimentWithStimuli(json) {
  var experiment = new AdaptationExperiment(_.extend(json, jsPsych.data.urlVariables()),
    storage);
  initializeJsPsych(experiment);
}

function showConsoleError(d, textStatus, error) {
  console.error("getJSON failed, status: " + textStatus + ", error: " + error);
}

function showUserError() {
  $( '#jspsych-target' ).append($('<div>', {
     id: 'error',
     class: 'text-center',
     html: '<p>According to our records, you have already participated in this experiment or a very similar experiment. </p><p>If you belive this message to be in error, please contact <a href="mailto:uchicagolanglab@gmail.com">uchicagolanglab@gmail.com</a>.</div>'
   }));
}
