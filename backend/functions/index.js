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
  let clinicRef = admin.database().ref("clinics/" + appt.clinic);
  // TODO: possible cleanup on old booking slots
  if (!appt.isBooking) {
    // TODO: updatePossibleNextEstimate (looking through booked list), using transactions to track last timing
    clinicRef.transaction((clinic) => {
      if (clinic) {
          // Set initial expected endtime,
          var startTime = clinic.nextEstimate;
          var endTime = clinic.nextEstimate + clinic.estimatedServiceTime;
          // In form of a json object, key: startime, value: endtime
          let bookingList = clinic.bookedSlots;
          // Get next timing after booked bookedSlots
          Object.keys(bookingList)
                .sort()
                .forEach((key) => {
                  // The additional = in comparisons intended to resolve exact overlap
                  // Booked appointment before queue and ends after startTime or
                  // Booked appointment after queue but starts before endTime,
                  // Push queue to after booked appointment
                  if ((key <= startTime && bookingList[key] >= startTime) ||
                      (key >= startTime && key <= endTime)) {
                    startTime = bookingList[key];
                    endTime = bookingList[key] + clinic.estimatedServiceTime;
                  }
                });
          clinic.nextEstimate = endTime;
      }
      appt.startTime = startTime;
      appt.endTime = endTime;
      admin.database().ref("appointmentsclinic/" + appt.clinic).update(appt);
      return clinic;
    });
  } else {
    let newBooking = {};
    newBooking[appt.startTime] = appt.endTime;
    admin.database().ref("clinics/" + appt.clinic + "/bookedSlots").update(newBooking);
  }
});


// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
