const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp();

exports.syncAppointment = functions.database.ref("appointmentsclinic/{uid}/{entry}").onCreate((snapshot) => {
  const appt = snapshot.val();
  const patientUID = appt.patient;
  return admin.database().ref("appointmentspatient/" + patientUID).set(snapshot);
});
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
