import { database, auth } from './firebase';

export const updateInfo = (id, email, contactNumber = '') =>
  database.ref(`clinics/${id}`).set(
    {
      contactNumber: contactNumber,
      email: email
    },
    function(error) {
      if (error) {
        console.log(error);
      } else {
        console.log('CHANGED');
      }
    }
  );

// GETTING DATA

export const getInfo = id => {

  if (id === undefined) {
    id = auth.currentUser.uid;
  }

  database
  .ref(`clinics/${id}`)
  .once('value')
  .then(function (snapshot) {
    return snapshot.val();
  });
};

export const parseAppointmentsForDisplay = data => {
  if (data != null) {
    return Object.keys(data).map(i => {
      let srcAppt = data[i];
      let dateTime = new Date(srcAppt.startTime);
      return {
        date:
          ((dateTime.getDate() < 10) ? '0' : '') + dateTime.getDate() + "-" +
          ((dateTime.getMonth() < 10) ? '0' : '') + dateTime.getMonth() + "-" +
          dateTime.getFullYear() + " " +
          ((dateTime.getHours() < 10) ? '0' : '') + dateTime.getHours() + ":" +
          ((dateTime.getMinutes() < 10) ? '0' : '') + dateTime.getMinutes() + ":" +
          ((dateTime.getSeconds() < 10) ? '0' : '') + dateTime.getSeconds(),
        patient: srcAppt.patient
      };
    });
  } else {
    return null;
  }
};

// ADDING APPOINTMENTS

export const addAppointment = (timestamp, patientID) => {
  let clinicID = auth.currentUser.uid;
  let clinicRef = database.ref('appointmentsclinic/' + clinicID).push();
  // let patientRef = database.ref('appointmentspatient/' + patientID).push();
  let newAppointment = {
    clinic: clinicID,
    patient: patientID,
    startTime: timestamp,
    isBooking: true
  };
  clinicRef.set(newAppointment);
  // patientRef.set(newAppointment);
};

export const joinQueue = (patientID) => {
  let clinicID = auth.currentUser.uid;
  let clinicApptRef = database.ref('appointmentsclinic/' + clinicID).push();
  database.ref('clinics/' + clinicID).once('value').then(function(snapshot) {
    let estimatedAppointmentTime = (snapshot.val() && snapshot.val().nextEstimate) || Date.now();
    estimatedAppointmentTime = (estimatedAppointmentTime < Date.now()) ? Date.now() : estimatedAppointmentTime;
    let newAppointment = {
      clinic: clinicID,
      patient: patientID,
      startTime: estimatedAppointmentTime,
      isBooking: false
    };
    clinicApptRef.set(newAppointment);
  });

};


export const addAppointmentGeneric = (timestamp, patientID) => {
  let clinicID = auth.currentUser.uid;
  let clinicRef = database.ref('appointments').push();
  // let patientRef = database.ref('appointmentspatient/' + patientID).push();
  let newAppointment = {
    clinic: clinicID,
    patient: patientID,
    startTime: timestamp,
    isBooking: true
  };
  clinicRef.set(newAppointment);
  // patientRef.set(newAppointment);
};

export const joinQueueGeneric = (patientID) => {
  let clinicID = auth.currentUser.uid;
  let clinicApptRef = database.ref('appointments').push();
  database.ref('clinics/' + clinicID).once('value').then(function(snapshot) {
    let estimatedAppointmentTime = (snapshot.val() && snapshot.val().nextEstimate) || Date.now();
    estimatedAppointmentTime = (estimatedAppointmentTime < Date.now()) ? Date.now() : estimatedAppointmentTime;
    let newAppointment = {
      clinic: clinicID,
      patient: patientID,
      startTime: estimatedAppointmentTime,
      isBooking: false
    };
    clinicApptRef.set(newAppointment);
  });
};
