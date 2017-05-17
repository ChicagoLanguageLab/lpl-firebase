$.getJSON("static/js/workerIds.json", function(json) {
    _.each(Object.keys(json.workers), function(worker) {
    	writeUserData(worker);
    });
});

/* Firebase initialization */
var config = {
    apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
    databaseURL: "https://language-processing-lab.firebaseio.com/",
    storageBucket: "gs://language-processing-lab.appspot.com"
};
firebase.initializeApp(config);

var database = firebase.database();

function writeUserData(workerId) {
    var tokenRef = database.ref('workers/' + workerId);
    tokenRef.set({
        complete : 1
    });
    console.log("Wrote data to database");
}