/* Firebase initialization */

/* TODO: Add worker to database!!!*/

var config = {
    apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
    databaseURL: "https://language-processing-lab.firebaseio.com/",
    storageBucket: "gs://language-processing-lab.appspot.com"
};
firebase.initializeApp(config);

var storageRef = firebase.storage().ref();
var database = firebase.database();
var dataRef;

function makeLoadingFun() {
  if($('#load-text').html() === 'Loading experiment....')
    $('#load-text').html('Loading experiment.');
  else
    $('#load-text').html($('#load-text').html() + '.');
}

var loadInterval = setInterval(function() {
  makeLoadingFun();
}, 500);

function loadExperimentFromJSON(json) {
  var url_params = jsPsych.data.urlVariables();

  var params = {
    workerId: url_params.workerId,
    trials: _.omit(url_params, 'workerId')
  };

  var experiment = new Production2Experiment(_.extend(json, params));
  initializeExperiment(experiment);
}

function loadExperimentFromJS(d, textStatus, error) {
  console.error("getJSON failed, status: " + textStatus + ", error: " + error);
  var params = {"items":{"1":{"name":"Rick","noun":"jar","conditions":{"a":"lured","b":"labeled"}},"2":{"name":"Joanna","noun":"puzzle","conditions":{"a":"amused","b":"completed"}},"3":{"name":"Katie","noun":"plan","conditions":{"a":"delighted","b":"altered"}},"4":{"name":"Julia","noun":"ritual","conditions":{"a":"bored","b":"finished"}},"5":{"name":"Maya","noun":"song","conditions":{"a":"annoyed","b":"muted"}},"6":{"name":"Alana","noun":"cliff","conditions":{"a":"impressed","b":"evaded"}},"7":{"name":"Mia","noun":"parade","conditions":{"a":"frustrated","b":"escorted"}},"8":{"name":"Sarah","noun":"omen","conditions":{"a":"disturbed","b":"heeded"}},"9":{"name":"Marina","noun":"compliment","conditions":{"a":"excited","b":"rejected"}},"10":{"name":"Hannah","noun":"necklace","conditions":{"a":"soothed","b":"weighed"}},"11":{"name":"Jack","noun":"advertisement","conditions":{"a":"angered","b":"wrote"}},"12":{"name":"Camille","noun":"pyramid","conditions":{"a":"awed","b":"built"}},"13":{"name":"Christina","noun":"criticism","conditions":{"a":"disappointed","b":"recorded"}},"14":{"name":"Cindy","noun":"doll","conditions":{"a":"interested","b":"embraced"}},"15":{"name":"Nikki","noun":"article","conditions":{"a":"alarmed","b":"edited"}},"16":{"name":"Rebecca","noun":"announcement","conditions":{"a":"bothered","b":"released"}},"17":{"name":"Isabel","noun":"plane","conditions":{"a":"amazed","b":"controlled"}},"18":{"name":"Lisa","noun":"label","conditions":{"a":"tempted","b":"scratched"}},"19":{"name":"Brian","noun":"tests","conditions":{"a":"convinced","b":"reproduced"}},"20":{"name":"Louis","noun":"house","conditions":{"a":"astounded","b":"neglected"}},"21":{"name":"Mark","noun":"sermon","conditions":{"a":"provoked","b":"denounced"}},"22":{"name":"Jeremy","noun":"interview","conditions":{"a":"embarrassed","b":"authorized"}},"23":{"name":"Liam","noun":"fight","conditions":{"a":"frightened","b":"taped"}},"24":{"name":"Isaac","noun":"script","conditions":{"a":"demoralized","b":"lost"}},"25":{"name":"Jackson","noun":"dust","conditions":{"a":"shocked","b":"removed"}},"26":{"name":"Solomon","noun":"match","conditions":{"a":"thrilled","b":"timed"}},"27":{"name":"Kevin","noun":"book","conditions":{"a":"pleased","b":"praised"}},"28":{"name":"Zach","noun":"finances","conditions":{"a":"upset","b":"analyzed"}},"29":{"name":"Christian","noun":"ropes","conditions":{"a":"terrified","b":"cut"}},"30":{"name":"James","noun":"lecture","conditions":{"a":"discouraged","b":"interrupted"}},"31":{"name":"Steve","noun":"flash","conditions":{"a":"scared","b":"identified"}},"32":{"name":"Christopher","noun":"jewel","conditions":{"a":"stunned","b":"concealed"}}}};
  loadExperimentFromJSON(params);
  }

function attemptLoad() {
  $.getJSON("production.data.json",
            loadExperimentFromJSON)
   .fail(loadExperimentFromJS);
}

function initializeExperiment(experiment) {
  dataRef = storageRef.child('production-2/9-24-2017/' + experiment.getSubjectId() + '.csv');

  experiment.initTimeline();

  jsPsych.init({
    timeline: experiment.getTimeline(),
    show_progress_bar: true,
    display_element: $('#jspsych-target')
  });

  experiment.addPropertiesTojsPsych();
  clearInterval(loadInterval);
}

$( document ).ready(function() {
  checkWorker(jsPsych.data.urlVariables().workerId, 'adaptation-workers').then(function(snapshot) {
    if(snapshot.val() && snapshot.val().complete == 1) {
      console.log('Worker has already completed the experiment.');
      clearInterval(loadInterval);
      $('#load-text').remove();
      showError();
    }
    else {
      console.log('Worker has not yet completed the experiment.');
      attemptLoad();
    }
  });
});
