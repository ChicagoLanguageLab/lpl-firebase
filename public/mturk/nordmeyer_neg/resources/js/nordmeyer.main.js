/* Firebase initialization */

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
  var experiment = new NegationExperiment(_.extend(json, jsPsych.data.urlVariables()));
  initializeExperiment(experiment);
}

function error(d, textStatus, error) {
  console.error("getJSON failed, status: " + textStatus + ", error: " + error);
}

function attemptLoad() {
  $.getJSON("resources/data/nordmeyer.data.json",
            loadExperimentFromJSON)
   .fail(error);
}

function initializeExperiment(experiment) {
  var d = new Date();
  var date_string = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');

  var vars = jsPsych.data.urlVariables();

  var cond = vars.condition == undefined ? '' : vars.condition + '-';
  dataRef = storageRef.child('nordmeyer/phase1/' + date_string + '/' + experiment.getSubjectId() + '.csv');

  experiment.createTimeline();
  experiment.addPropertiesTojsPsych();

  var images = ["resources/images/apples_context1_item.jpg","resources/images/forks_context2_nothing.jpg","resources/images/apples_context1_nothing.jpg","resources/images/forks_context3_item.jpg","resources/images/apples_context2_item.jpg","resources/images/forks_context3_nothing.jpg","resources/images/apples_context2_nothing.jpg","resources/images/forks_item.jpg","resources/images/apples_context3_item.jpg","resources/images/forks_nothing.jpg","resources/images/apples_context3_nothing.jpg","resources/images/guitars_context1_item.jpg","resources/images/apples_item.jpg","resources/images/guitars_context1_nothing.jpg","resources/images/apples_nothing.jpg","resources/images/guitars_context2_item.jpg","resources/images/balloons_context1_item.jpg","resources/images/guitars_context2_nothing.jpg","resources/images/balloons_context1_nothing.jpg","resources/images/guitars_context3_item.jpg","resources/images/balloons_context2_item.jpg","resources/images/guitars_context3_nothing.jpg","resources/images/balloons_context2_nothing.jpg","resources/images/guitars_item.jpg","resources/images/balloons_context3_item.jpg","resources/images/guitars_nothing.jpg","resources/images/balloons_context3_nothing.jpg","resources/images/hat_contextC.jpg","resources/images/balloons_item.jpg","resources/images/hat_contextL.jpg","resources/images/balloons_nothing.jpg","resources/images/hat_contextR.jpg","resources/images/bananas_context1_item.jpg","resources/images/hat_item.jpg","resources/images/bananas_context1_nothing.jpg","resources/images/house_contextC.jpg","resources/images/bananas_context2_item.jpg","resources/images/house_contextL.jpg","resources/images/bananas_context2_nothing.jpg","resources/images/house_contextR.jpg","resources/images/bananas_context3_item.jpg","resources/images/house_item.jpg","resources/images/bananas_context3_nothing.jpg","resources/images/ice cream cones_context1_item.jpg","resources/images/bananas_item.jpg","resources/images/ice cream cones_context1_nothing.jpg","resources/images/bananas_nothing.jpg","resources/images/ice cream cones_context2_item.jpg","resources/images/beach balls_item.jpg","resources/images/ice cream cones_context2_nothing.jpg","resources/images/beach balls_nothing.jpg","resources/images/ice cream cones_context3_item.jpg","resources/images/bears_item.jpg","resources/images/ice cream cones_context3_nothing.jpg","resources/images/bears_nothing.jpg","resources/images/ice cream cones_item.jpg","resources/images/bird.png","resources/images/ice cream cones_nothing.jpg","resources/images/blanket_contextC.jpg","resources/images/keys_context1_item.jpg","resources/images/blanket_contextL.jpg","resources/images/keys_context1_nothing.jpg","resources/images/blanket_contextR.jpg","resources/images/keys_context2_item.jpg","resources/images/blanket_item.jpg","resources/images/keys_context2_nothing.jpg","resources/images/boat.pngkeys_context3_item.jpg","resources/images/book_contextC.jpg","resources/images/keys_context3_nothing.jpg","resources/images/book_contextL.jpg","resources/images/keys_item.jpg","resources/images/book_contextR.jpg","resources/images/keys_nothing.jpg","resources/images/book_item.jpg","resources/images/kites_context1_item.jpg","resources/images/bows_context1_item.jpg","resources/images/kites_context1_nothing.jpg","resources/images/bows_context1_nothing.jpg","resources/images/kites_context2_item.jpg","resources/images/bows_context2_item.jpg","resources/images/kites_context2_nothing.jpg","resources/images/bows_context2/nothing.jpg","resources/images/kites_context3_item.jpg","resources/images/bows_context3_item.jpg","resources/images/kites_context3_nothing.jpg","resources/images/bows_context3_nothing.jpg","resources/images/kites_item.jpg","resources/images/bows_item.jpg","resources/images/kites_nothing.jpg","resources/images/bows_nothing.jpg","resources/images/lollipops_context1_item.jpg","resources/images/broccoli.png","resources/images/lollipops_context1_nothing.jpg","resources/images/buckets_context1_item.jpg","resources/images/lollipops_context2_item.jpg","resources/images/buckets_context1_nothing.jpg","resources/images/lollipops_context2_nothing.jpg","resources/images/buckets_context2_item.jpg","resources/images/lollipops_context3_item.jpg","resources/images/buckets_context2_nothing.jpg","resources/images/lollipops_context3_nothing.jpg","resources/images/buckets_context3_item.jpg","resources/images/lollipops_item.jpg","resources/images/buckets_context3_nothing.jpg","resources/images/lollipops_nothing.jpg","resources/images/buckets_item.jpg","resources/images/mittens_context1_item.jpg","resources/images/buckets_nothing.jpg","resources/images/mittens_context1_nothing.jpg","resources/images/bunny.png","resources/images/mittens_context2_item.jpg","resources/images/bus.png","resources/images/mittens_context2_nothing.jpg","resources/images/cakes_context1_item.jpg","resources/images/mittens_context3_item.jpg","resources/images/cakes_context1_nothing.jpg","resources/images/mittens_context3_nothing.jpg","resources/images/cakes_context2_item.jpg","resources/images/mittens_item.jpg","resources/images/cakes_context2_nothing.jpg","resources/images/mittens_nothing.jpg","resources/images/cakes_context3_item.jpg","resources/images/oranges_context1_nothing.jpg","resources/images/cakes_context3_nothing.jpg","resources/images/oranges_context2_nothing.jpg","resources/images/cakes_item.jpg","resources/images/oranges_context3_nothing.jpg","resources/images/cakes_nothing.jpg","resources/images/oranges_item.jpg","resources/images/carrots_context1_item.jpg","resources/images/oranges_nothing.jpg","resources/images/carrots_context1_nothing.jpg","resources/images/pencils_context1_item.jpg","resources/images/carrots_context2_item.jpg","resources/images/pencils_context1_nothing.jpg","resources/images/carrots_context2_nothing.jpg","resources/images/pencils_context2_item.jpg","resources/images/carrots_context3_item.jpg","resources/images/pencils_context2_nothing.jpg","resources/images/carrots_context3_nothing.jpg","resources/images/pencils_context3_item.jpg","resources/images/carrots_item.jpg","resources/images/pencils_context3_nothing.jpg","resources/images/carrots_nothing.jpg","resources/images/pencils_item.jpg","resources/images/cars_context1_item.jpg","resources/images/pencils_nothing.jpg","resources/images/cars_context1_nothing.jpg","resources/images/phones_context1_item.jpg","resources/images/cars_context2_item.jpg","resources/images/phones_context1_nothing.jpg","resources/images/cars_context2_nothing.jpg","resources/images/phones_context2_item.jpg","resources/images/cars_context3_item.jpg","resources/images/phones_context2_nothing.jpg","resources/images/cars_context3_nothing.jpg","resources/images/phones_context3_item.jpg","resources/images/cars_item.jpg","resources/images/phones_context3_nothing.jpg","resources/images/cars_nothing.jpg","resources/images/phones_item.jpg","resources/images/cats_context1_item.jpg","resources/images/phones_nothing.jpg","resources/images/cats_context1_nothing.jpg","resources/images/pictures_item.jpg","resources/images/cats_context2_item.jpg","resources/images/pictures_nothing.jpg","resources/images/cats_context2_nothing.jpg","resources/images/pie slices_item.jpg","resources/images/cats_context3_item.jpg","resources/images/pie slices_nothing.jpg","resources/images/cats_context3_nothing.jpg","resources/images/pieces of pizza_item.jpg","resources/images/cats_item.jpg","resources/images/pieces of pizza_nothing.jpg","resources/images/cats_nothing.jpg","resources/images/plants_context1_item.jpg","resources/images/collar_contextC.jpg","resources/images/plants_context1_nothing.jpg","resources/images/collar_contextL.jpg","resources/images/plants_context2_item.jpg","resources/images/collar_contextR.jpg","resources/images/plants_context2_nothing.jpg","resources/images/collar_item.jpg","resources/images/plants_context3_item.jpg","resources/images/cookies_context1_item.jpg","resources/images/plants_context3_nothing.jpg","resources/images/cookies_context1_nothing.jpg","resources/images/plants_item.jpg","resources/images/cookies_context2_item.jpg","resources/images/plants_nothing.jpg","resources/images/cookies_context2_nothing.jpg","resources/images/presents_context1_item.jpg","resources/images/cookies_context3_item.jpg","resources/images/presents_context1_nothing.jpg","resources/images/cookies_context3_nothing.jpg","resources/images/presents_context2_item.jpg","resources/images/cookies_item.jpg","resources/images/presents_context2_nothing.jpg","resources/images/cookies_nothing.jpg","resources/images/presents_context3_item.jpg","resources/images/cow.png","resources/images/presents_context3_nothing.jpg","resources/images/crayons_context1_item.jpg","resources/images/presents_item.jpg","resources/images/crayons_context1_nothing.jpg","resources/images/presents_nothing.jpg","resources/images/crayons_context2_item.jpg","resources/images/purses_context1_item.jpg","resources/images/crayons_context2_nothing.jpg","resources/images/purses_context1_nothing.jpg","resources/images/crayons_context3_item.jpg","resources/images/purses_context2_item.jpg","resources/images/crayons_context3_nothing.jpg","resources/images/purses_context2_nothing.jpg","resources/images/crayons_item.jpg","resources/images/purses_context3_item.jpg","resources/images/crayons_nothing.jpg","resources/images/purses_context3_nothing.jpg","resources/images/cup.png","resources/images/purses_item.jpg","resources/images/daisies_context1_item.jpg","resources/images/purses_nothing.jpg","resources/images/daisies_context1_nothing.jpg","resources/images/rainboots_context1_item.jpg","resources/images/daisies_context2_item.jpg","resources/images/rainboots_context1_nothing.jpg","resources/images/daisies_context2_nothing.jpg","resources/images/rainboots_context2_item.jpg","resources/images/daisies_context3_item.jpg","resources/images/rainboots_context2_nothing.jpg","resources/images/daisies_context3_nothing.jpg","resources/images/rainboots_context3_item.jpg","resources/images/daisies_item.jpg","resources/images/rainboots_context3_nothing.jpg","resources/images/daisies_nothing.jpg","resources/images/rainboots_item.jpg","resources/images/dogs_context1_item.jpg","resources/images/rainboots_nothing.jpg","resources/images/dogs_context1_nothing.jpg","resources/images/sandwiches_item.jpg","resources/images/dogs_context2_item.jpg","resources/images/sandwiches_nothing.jpg","resources/images/dogs_context2_nothing.jpg","resources/images/scissors_context1_item.jpg","resources/images/dogs_context3_item.jpg","resources/images/scissors_context1_nothing.jpg","resources/images/dogs_context3_nothing.jpg","resources/images/scissors_context2_item.jpg","resources/images/dogs_item.jpg","resources/images/scissors_context2_nothing.jpg","resources/images/dogs_nothing.jpg","resources/images/scissors_context3_item.jpg","resources/images/donuts_context1_item.jpg","resources/images/scissors_context3_nothing.jpg","resources/images/donuts_context1_nothing.jpg","resources/images/scissors_item.jpg","resources/images/donuts_context2_item.jpg","resources/images/scissors_nothing.jpg","resources/images/donuts_context2_nothing.jpg","resources/images/shovels_context1_item.jpg","resources/images/donuts_context3_item.jpg","resources/images/shovels_context1_nothing.jpg","resources/images/donuts_context3_nothing.jpg","resources/images/shovels_context2_item.jpg","resources/images/donuts_item.jpg","resources/images/shovels_context2_nothing.jpg","resources/images/donuts_nothing.jpg","resources/images/shovels_context3_item.jpg","resources/images/dress_contextC.jpg","resources/images/shovels_context3_nothing.jpg","resources/images/dress_contextL.jpg","resources/images/shovels_item.jpg","resources/images/dress_contextR.jpg","resources/images/shovels_nothing.jpg","resources/images/dress_item.jpg","resources/images/spots_alternate.jpg","resources/images/elephant.png","resources/images/spots_contextC.jpg","resources/images/fish_context1_item.jpg","resources/images/spots_contextL.jpg","resources/images/fish_context1_nothing.jpg","resources/images/spots_contextR.jpg","resources/images/fish_context2_item.jpg","resources/images/spots_item.jpg","resources/images/fish_context2_nothing.jpg","resources/images/stanford.png","resources/images/fish_context3_item.jpg","resources/images/sweater_alternate.jpg","resources/images/fish_context3_nothing.jpg","resources/images/sweater_contextC.jpg","resources/images/fish_item.jpg","resources/images/sweater_contextL.jpg","resources/images/fish_nothing.jpg","resources/images/sweater_contextR.jpg","resources/images/flowers_context1_item.jpg","resources/images/sweater_item.jpg","resources/images/flowers_context1_nothing.jpg","resources/images/truck.png","resources/images/flowers_context2_item.jpg","resources/images/umbrellas_context1_item.jpg","resources/images/flowers_context2_nothing.jpg","resources/images/umbrellas_context1_nothing.jpg","resources/images/flowers_context3_item.jpg","resources/images/umbrellas_context2_item.jpg","resources/images/flowers_context3_nothing.jpg","resources/images/umbrellas_context2_nothing.jpg","resources/images/flowers_item.jpg","resources/images/umbrellas_context3_item.jpg","resources/images/flowers_nothing.jpg","resources/images/umbrellas_context3_nothing.jpg","resources/images/forks_context1_item.jpg","resources/images/umbrellas_item.jpg","resources/images/forks_context1_nothing.jpg","resources/images/umbrellas_nothing.jpg","resources/images/forks_context2_item.jpg"];

  jsPsych.init({
    timeline: experiment.getTimeline(),
    show_progress_bar: true,
    preload_images: images,
    display_element: 'jspsych-target',
    on_finish: function() {
      var code = jsPsych.data.getLastTrialData().values[0].code;
      $('#jspsych-target').html('<p class="lead">You have finished the experiment! Your responses have been saved.</p>' +
          '<p>Your survey code is <b>' + code + '</b>. Please enter this code into your HIT. ' +
          'You may then close this window.</p><p>If you have any questions or concerns, ' +
          'please do not hesitate to contact the lab at <a href="mailto:uchicagolanglab@gmail.com">uchicagolanglab@gmail.com</a>.</p>');
    }
  });

  var code = 'TURK' + jsPsych.randomization.randomID(10);

  jsPsych.data.addProperties({
    code: code
  });

  $('#load-text').remove();
  clearInterval(loadInterval);
}

$( document ).ready(function() {

  checkWorker(jsPsych.data.urlVariables().workerId, 'nordmeyer-study').then(function(snapshot) {

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