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
  .ref(`clinic/${id}`)
  .once('value')
  .then(function (snapshot) {
    return snapshot.val();
  });
};

export const parseAppointmentsForDisplay = data => {

  return Object.keys(data).map(i => {
    let srcAppt = data[i];
    let dateTime = new Date(srcAppt.time);
    return {
      date: dateTime.getFullYear() + "-" + dateTime.getMonth() + "-" + dateTime.getDate()
            + " " + dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds(),
      patient: srcAppt.patient
    };
  });
};

// ADDING APPOINTMENTS

export const addAppointment = (timestamp, patientID) => {
  let clinicID = auth.currentUser.uid;
  let clinicRef = database.ref('appointmentsclinic/' + clinicID).push();
  let patientRef = database.ref('appointmentspatient/' + patientID).push();
  let newAppointment = {
    clinic: clinicID,
    patient: patientID,
    time: timestamp
  };
  clinicRef.set(newAppointment);
  patientRef.set(newAppointment);
};

export const joinQueue = (patientID) => {
  let estimatedWaitTime = 600000;
  let clinicID = auth.currentUser.uid;
  let clinicApptRef = database.ref('appointmentsclinic/' + clinicID).push();
  let patientRef = database.ref('appointmentspatient/' + patientID).push();
  let clinicRef = database.ref('clinics/' + clinicID);
  database.ref('clinics/' + clinicID).once('value').then(function(snapshot) {
    let prevTime = (snapshot.val() && snapshot.val().lastStamp) || Date.now();
    let newAppointment = {
      clinic: clinicID,
      patient: patientID,
      time: prevTime + estimatedWaitTime
    }
    clinicApptRef.set(newAppointment);
    patientRef.set(newAppointment);
    clinicRef.update({lastStamp: prevTime + estimatedWaitTime});
  });

};
