/* Firebase initialization */

var config = {
    apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
    databaseURL: "https://language-processing-lab.firebaseio.com/",
    storageBucket: "gs://language-processing-lab.appspot.com"
};
firebase.initializeApp(config);

var storageRef = firebase.storage().ref();
var database = firebase.database();

/* Create a unique instance of the experiment */

var experiment = new AdaptationExperiment(_.extend(AdaptationData.getParams(), jsPsych.data.urlVariables()), AdaptationData.getPrefabs());
experiment.createTimeline();
experiment.addPropertiesTojsPsych();

var dataRef = storageRef.child('2-24-2017-run1/' + experiment.getSubjectId() + experiment.getCondition() + experiment.getSubcondition() + experiment.getVoice() + '.csv');

function makeLoadingFun() {
  if($('#load-text').html() === 'Loading experiment....')
    $('#load-text').html('Loading experiment.');
  else
    $('#load-text').html($('#load-text').html() + '.');
}

$( document ).ready(function() {

  var loadMessage = setInterval(function() {
    makeLoadingFun();
  }, 500);

  checkWorker(experiment.getSubjectId(), 'adaptation-workers').then(function(snapshot) {
    if(snapshot.val() && snapshot.val().complete == 1) {
      console.log('Worker has already completed the experiment.');
      clearInterval(loadDisplay);
      $('#load-text').remove();
      showError();
    }
    else {
      console.log('Worker has not yet completed the experiment.');
      jsPsych.init({
        timeline: experiment.getTimeline(),
        show_progress_bar: true,
        display_element: $('#jspsych-target')
      });
      clearInterval(loadMessage);
    }
  });
});
