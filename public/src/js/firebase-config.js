// firebase-config.js
// This file contains the data necessary to connect to Firebase, plus some helpers.

/******************************************************
 * FIREBASE CONFIGURATION
 ******************************************************/

 /* apiKey - The public API key of the project.
  * Can be found in the project's settings in the Firebase Console.

  * databaseURL - The URL of the project's database.
  * Can be found by navigating to the real-time database in the Firebase Console.

  * storageBucket - The URL of the project's storage bucket.
  * Can be found by navigating to Storage in the Firebase Console.
 */

 var config = {
     apiKey: "AIzaSyAlzTpCs3uxIXW6i6I7zsHLElb1GUpoDh8",
     databaseURL: "https://language-processing-lab.firebaseio.com/",
     storageBucket: "gs://language-processing-lab.appspot.com"
 };

/******************************************************
 * FIREBASE INITIALIZATION
 ******************************************************/

firebase.initializeApp(config);


var storage  = firebase.storage();
var database = firebase.database();


/*************************************************************************
* FIREBASE HELPER FUNCTIONS
**************************************************************************/

function saveDataToStorage(filedata, dataRef, thenFunc){
    console.log("Saving progress...");
    dataRef.putString(filedata).then(function() { console.log("Data saved!") });
}

function getParticipantCompletion(dbLocation, participantId, experimentId) {
    return firebase.database().ref(dbLocation + '/' + participantId + '/complete').once('value');
}

function addParticipantToDatabase(dbLocation, participantId, experimentId) {
  if(participantId !== "demo") {
    var tokenRef = database.ref(dbLocation + '/' + participantId);
    tokenRef.set({
        complete : 1
    });
    console.log("Added participant " + participantId + "to experiment " + experimentId + " with completion value 1.");
  }
}
