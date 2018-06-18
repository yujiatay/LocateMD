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
    clinicRef.transaction((clinic) => {
      if (clinic) {
        // Obtain current slot times
        let startTime = clinic.nextEstimate;
        let endTime = startTime + clinic.estimatedServiceTime;

        // In form of a json object, key: starttime, value: endtime
        let bookingList = clinic.bookedSlots;
        // Likely to cause problems if estimate is >3 hours (conflict with booking slots)
        // Check if estimatedStartTime is accurate
        if (clinic.hasOwnProperty('nextEstimate') && clinic.nextEstimate !== null &&
          clinic.nextEstimate < (Date.now() - 60000)) {
          // estimate is inaccurate, obtain better estimate from current time
          startTime = Date.now();
          endTime = startTime + clinic.estimatedServiceTime;
          // Get next timing after booked bookedSlots
          Object.keys(bookingList)
          .sort()
          .forEach((key) => {
            // The additional = in comparisons intended to resolve exact overlap
            // If start of queue time is between booked appointment start and end or
            // end of queue time is between booked appointment start and end,
            // Push queue to after booked appointment
            if ((key >= startTime && key < endTime) ||
              (bookingList[key] > startTime && bookingList[key] <= endTime)) {
              startTime = bookingList[key];
              endTime = bookingList[key] + clinic.estimatedServiceTime;
            }
          });
        }

        // Obtain next slot (resolving for booking) after current queue
        let nextStartTime = endTime;
        let nextEndTime = endTime + clinic.estimatedServiceTime;
        Object.keys(bookingList)
        .sort()
        .forEach((key) => {
          // The additional = in comparisons intended to resolve exact overlap
          // If start of queue time is between booked appointment start and end or
          // end of queue time is between booked appointment start and end,
          // Push queue to after booked appointment
          if ((key >= nextStartTime && key < nextEndTime) ||
            (bookingList[key] > nextStartTime && bookingList[key] <= nextEndTime)) {
            nextStartTime = bookingList[key];
            nextEndTime = bookingList[key] + clinic.estimatedServiceTime;
          }
        });
        clinic.nextEstimate = nextStartTime;
      }
      appt.startTime = startTime;
      appt.endTime = endTime;
      admin.database().ref("appointmentsclinic/" + appt.clinic).update(appt);
      return clinic;
    });
  } else {
    // TODO: check with realtime queue if it passes 3 hour mark
    let newBooking = {};
    newBooking[appt.startTime] = appt.endTime;
    admin.database().ref("clinics/" + appt.clinic + "/bookedSlots").update(newBooking);
  }
});

// TODO: http request for client to call and update estimate on clinic

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
