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

// // TODO: Check if really necessary (alot cheaper without)
// exports.syncAppointment = functions.database.ref("appointmentsclinic/{uid}/{entry}").onWrite((change, context) => {
//   let snapshot = {};
//   let patientUID = "";
//   console.log(context);
//   if (!change.before.exists()) {
//     // Create operation
//     snapshot = change.after.val();
//     patientUID = change.after.val().patient;
//   } else if (!change.after.exists()) {
//     // Delete operation
//     snapshot = change.after.val();
//     patientUID = change.before.val().patient;
//   } else {
//     let beforeUID = change.before.val().patient;
//     let afterUID = change.after.val().patient;
//
//     // Update operation (same patientUID)
//     if (beforeUID === afterUID) {
//       patientUID = afterUID;
//       snapshot = change.after.val();
//     } else {
//       patientUID = afterUID;
//       snapshot = change.after.val();
//       admin.database().ref("appointmentspatient/" + context.params.uid + "/" + context.params.entry).update(null);
//     }
//   }
//   console.log("DUPE DATA");
//   console.log(snapshot);
//   console.log(context.params.entry);
//   if (snapshot === null) {
//     return admin.database().ref("appointmentspatient/" + patientUID + "/" + context.params.entry).remove();
//   } else {
//     return admin.database().ref("appointmentspatient/" + patientUID + "/" + context.params.entry).update(snapshot);
//   }
// });
//
// // Function for joining queue, to determine the next queue time, correlate with advance booking slots with buffer
// exports.updateRealTimeEstimatesOnClinicEntry = functions.database.ref("appointmentsclinic/{uid}/{entry}").onCreate((snapshot, context) => {
//   const appt = snapshot.val();
//   let clinicRef = admin.database().ref("clinics/" + appt.clinic);
//   // TODO: possible cleanup on old booking slots
//   if (!appt.isBooking) {
//     return clinicRef.transaction((clinic) => {
//       if (clinic) {
//         // Obtain current slot times
//         let startTime = clinic.nextEstimate;
//         if (!clinic.hasOwnProperty('bookedSlots') || clinic.estimatedServiceTime === null) clinic.estimatedServiceTime = 600000;
//         let endTime = startTime + clinic.estimatedServiceTime;
//
//         // In form of a json object, key: starttime, value: endtime
//         let bookingList = (!clinic.hasOwnProperty('bookedSlots') || clinic.bookedSlots === null) ? {} : clinic.bookedSlots;
//         // Likely to cause problems if estimate is >3 hours (conflict with booking slots)
//         // Check if estimatedStartTime is accurate
//         if (!clinic.hasOwnProperty('nextEstimate') || clinic.nextEstimate === null ||
//           clinic.nextEstimate < (Date.now() - 60000)) {
//           // estimate is inaccurate, obtain better estimate from current time
//           startTime = Date.now();
//           endTime = startTime + clinic.estimatedServiceTime;
//           // Get next timing after booked bookedSlots
//           Object.keys(bookingList)
//           .sort()
//           .forEach((key) => {
//             // The additional = in comparisons intended to resolve exact overlap
//             // If start of queue time is between booked appointment start and end or
//             // end of queue time is between booked appointment start and end,
//             // Push queue to after booked appointment
//             if ((key >= startTime && key < endTime) ||
//               (bookingList[key] > startTime && bookingList[key] <= endTime)) {
//               startTime = bookingList[key];
//               endTime = bookingList[key] + clinic.estimatedServiceTime;
//             }
//           });
//         }
//
//         // Obtain next slot (resolving for booking) after current queue
//         let nextStartTime = endTime;
//         let nextEndTime = endTime + clinic.estimatedServiceTime;
//         Object.keys(bookingList)
//         .sort()
//         .forEach((key) => {
//           // The additional = in comparisons intended to resolve exact overlap
//           // If start of queue time is between booked appointment start and end or
//           // end of queue time is between booked appointment start and end,
//           // Push queue to after booked appointment
//           if ((key >= nextStartTime && key < nextEndTime) ||
//             (bookingList[key] > nextStartTime && bookingList[key] <= nextEndTime)) {
//             nextStartTime = bookingList[key];
//             nextEndTime = bookingList[key] + clinic.estimatedServiceTime;
//           }
//         });
//         // TODO: GIVE NEGATIVE NUMBER IF MORE THAN BOOKING THRESHOLD
//         clinic.nextEstimate = nextStartTime;
//         appt.startTime = startTime;
//         appt.endTime = endTime;
//         admin.database().ref("appointmentsclinic/" + context.params.uid + "/" + context.params.entry).update(appt);
//         return clinic;
//       }
//       return {};
//     });
//   } else {
//     // TODO: check with realtime queue if it passes 3 hour mark
//     let newBooking = {};
//     return clinicRef.once("value").then((clinic) => {
//       let clinicObj = clinic.val();
//       appt.endTime = appt.startTime + clinicObj.estimatedServiceTime;
//       newBooking[appt.startTime] = appt.endTime;
//       admin.database().ref("appointmentsclinic/" + context.params.uid + "/" + context.params.entry).update(appt);
//       return admin.database().ref("clinics/" + appt.clinic + "/bookedSlots").update(newBooking);
//     });
//   }
// });

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
        if (!clinic.hasOwnProperty('bookedSlots') || clinic.estimatedServiceTime === null) clinic.estimatedServiceTime = 600000;
        let endTime = startTime + clinic.estimatedServiceTime;

        // In form of a json object, key: starttime, value: endtime
        let bookingList = (!clinic.hasOwnProperty('bookedSlots') || clinic.bookedSlots === null) ? {} : clinic.bookedSlots;
        // Likely to cause problems if estimate is >3 hours (conflict with booking slots)
        // Check if estimatedStartTime is accurate
        if (!clinic.hasOwnProperty('nextEstimate') || clinic.nextEstimate === null ||
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
        // TODO: GIVE NEGATIVE NUMBER IF MORE THAN BOOKING THRESHOLD
        clinic.nextEstimate = nextStartTime;
        appt.startTime = startTime;
        appt.endTime = endTime;
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
      if (!clinic.hasOwnProperty('bookedSlots') || clinic.estimatedServiceTime === null) clinic.estimatedServiceTime = 600000;
      let endTime = startTime + clinic.estimatedServiceTime;

      // In form of a json object, key: starttime, value: endtime
      let bookingList = (!clinic.hasOwnProperty('bookedSlots') || clinic.bookedSlots === null) ? {} : clinic.bookedSlots;
      // Likely to cause problems if estimate is >3 hours (conflict with booking slots)
      // Check if estimatedStartTime is accurate
      if (!clinic.hasOwnProperty('nextEstimate') || clinic.nextEstimate === null ||
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

      // TODO: GIVE NEGATIVE NUMBER IF MORE THAN BOOKING THRESHOLD
      clinic.nextEstimate = startTime;
      console.log("AMENDED");
      console.log(clinic);
      return clinic;
    }
    return {};
  }, (error, committed, snapshot) => {
    console.log(snapshot.val());
    console.log(committed);
    if (snapshot.val()) {
      res.send(snapshot.val());
    }
  });
});
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
