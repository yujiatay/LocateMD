const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp();


// TODO: Check if really necessary (alot cheaper without)
exports.syncAppointment = functions.database.ref("appointmentsclinic/{uid}/{entry}").onWrite((change) => {
  let snapshot = {};
  let patientUID = "";
  if (!change.before.exists()) {
    // Create operation
    snapshot = change.after;
    patientUID = change.after.val().patient;
  } else if (!change.after.exists()) {
    // Delete operation
    snapshot = change.after;
    patientUID = change.before.val().patient;
  } else {
    let beforeUID = change.before.val().patient;
    let afterUID = change.after.val().patient;

    // Update operation (same patientUID)
    if (beforeUID === afterUID) {
      patientUID = afterUID;
      snapshot = change.after;
    } else {
      patientUID = afterUID;
      snapshot = change.after;
      admin.database().ref("appointmentspatient/" + beforeUID).update(null);
    }
  }

  return admin.database().ref("appointmentspatient/" + patientUID).update(snapshot);
});

// Function for joining queue, to determine the next queue time, correlate with advance booking slots with buffer
exports.updateRealTimeEstimates = functions.database.ref("appointmentsclinic/{uid}/{entry}").onCreate((snapshot) => {
  const appt = snapshot.val();
  // TODO: Import booked list here
  if (!appt.isBooking) {
    // TODO: updatePossibleNextEstimate (looking through booked list), using transactions to track last timing
  }
});


// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
