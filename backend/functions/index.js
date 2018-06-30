const functions = require('firebase-functions');
const admin = require('firebase-admin');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
admin.initializeApp();

const BOOKINGTHRESHOLD = 10800000;


exports.updateClinicStamp = functions.database.ref("clinics").onWrite((change, context) => {
  return admin.database().ref("clinicMeta").update({lastModified: Date.now()});
});

// Add information to appointments for easy reading
exports.addNamesToAppointments = functions.database.ref("appointments/{entry}").onCreate((snapshot, context) => {
  const appt = snapshot.val();
  let clinicRef = admin.database().ref("clinics/" + appt.clinic);
  let patientRef = admin.database().ref("patients/" + appt.patient);
  return Promise.all([
    clinicRef.once('value'),
    patientRef.once('value')
  ]).then(res => {
    appt.clinicName = res[0].val().clinicName;
    appt.patientName = res[1].val().name;
    return admin.database().ref("appointments/" + context.params.entry).update(appt);
  });
});


// Function for joining queue, to determine the next queue time, correlate with advance booking slots with buffer
exports.updateRealTimeEstimates = functions.database.ref("appointments/{entry}").onCreate((snapshot, context) => {
  const appt = snapshot.val();
  let clinicRef = admin.database().ref("clinics/" + appt.clinic);
  // TODO: possible cleanup on old booking slots
  if (!appt.isBooking) {
    return clinicRef.transaction((clinic) => {
      if (clinic) {
        // Obtain current slot times
        let startTime = clinic.nextEstimate;
        // REVERT ANY NEGATIVE TIMINGS TO ACTUAL ESTIMATE
        if (startTime < 0) {
          startTime = -startTime;
        }
        if (!clinic.hasOwnProperty('bookedSlots') || clinic.estimatedServiceTime === null) clinic.estimatedServiceTime = 600000;
        let endTime = startTime + clinic.estimatedServiceTime;

        // In form of a json object, key: starttime, value: endtime
        let bookingList = (!clinic.hasOwnProperty('bookedSlots') || clinic.bookedSlots === null) ? {} : clinic.bookedSlots;
        // Likely to cause problems if estimate is >3 hours (conflict with booking slots)
        // Check if estimatedStartTime is accurate
        if (!clinic.hasOwnProperty('nextEstimate') || clinic.nextEstimate === null || clinic.nextEstimate >= 0 &&
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
        // GIVE NEGATIVE NUMBER IF MORE THAN BOOKING THRESHOLD, DEFINES POSSIBLY INACCURATE TIMESTAMP
        if (nextStartTime > Date.now() + BOOKINGTHRESHOLD) {
          nextStartTime = -nextStartTime;
        }

        // tentatively put queueNum into clinic object
        let queueNum = clinic.nextQueueNum;
        if (queueNum === null) {
          queueNum = 0;
        }
        clinic.nextQueueNum = queueNum + 1;
        clinic.nextEstimate = nextStartTime;
        appt.startTime = startTime;
        appt.endTime = endTime;
        appt.queueNum = queueNum;
        admin.database().ref("appointments/" + context.params.entry).update(appt);
        return clinic;
      }
      return {};
    });
  } else {
    // TODO: check with realtime queue if it passes 3 hour mark
    let newBooking = {};
    return clinicRef.once("value").then((clinic) => {
      let clinicObj = clinic.val();
      appt.endTime = appt.startTime + clinicObj.estimatedServiceTime;
      newBooking[appt.startTime] = appt.endTime;
      admin.database().ref("appointments/" + context.params.entry).update(appt);
      return admin.database().ref("clinics/" + appt.clinic + "/bookedSlots").update(newBooking);
    });
  }
});


exports.updateClinicEstimate = functions.https.onRequest((req, res) => {
  console.log(req.query.clinicID);
  let clinicRef = admin.database().ref("clinics/" + req.query.clinicID);
  clinicRef.transaction((clinic) => {
    console.log(clinic);
    if (clinic) {
      // Obtain current slot times
      let startTime = clinic.nextEstimate;
      // REVERT ANY NEGATIVE TIMINGS TO ACTUAL ESTIMATE
      if (startTime < 0) {
        startTime = -startTime;
      }
      if (!clinic.hasOwnProperty('bookedSlots') || clinic.estimatedServiceTime === null) clinic.estimatedServiceTime = 600000;
      let endTime = startTime + clinic.estimatedServiceTime;

      // In form of a json object, key: starttime, value: endtime
      let bookingList = (!clinic.hasOwnProperty('bookedSlots') || clinic.bookedSlots === null) ? {} : clinic.bookedSlots;
      // Likely to cause problems if estimate is >3 hours (conflict with booking slots)
      // Check if estimatedStartTime is accurate
      if (!clinic.hasOwnProperty('nextEstimate') || clinic.nextEstimate === null || clinic.nextEstimate >= 0 &&
        clinic.nextEstimate < (Date.now() - 60000)) {
        // estimate is inaccurate, obtain better estimate from current time
        startTime = Date.now();
        endTime = startTime + clinic.estimatedServiceTime;
        // Get next timing after booked bookedSlots
        console.log(bookingList);
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

      // GIVE NEGATIVE NUMBER IF MORE THAN BOOKING THRESHOLD
      if (startTime > Date.now() + BOOKINGTHRESHOLD) {
        startTime = -startTime;
      }
      clinic.nextEstimate = startTime;
      console.log("AMENDED");
      console.log(clinic);
      return clinic;
    }
    return {};
  }, (error, committed, snapshot) => {
    if (snapshot.val() && Object.keys(snapshot.val()).length !== 0) {
      res.send(snapshot.val());
    }
  });
});
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
