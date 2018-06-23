import { database, auth } from './firebase';

export const updateInfo = (id, email, contactNumber = '') => {
  database.ref(`patients/${id}`).set(
    {
      // DEETS TBC
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
};

export const getInfo = id => {

  if (id === undefined) {
    id = auth.currentUser.uid;
  }

  database
  .ref(`patients/${id}`)
  .once('value')
  .then(function (snapshot) {
    return snapshot.val();
  });
};

export const bookAppointment = (timestamp, clinicID) => {
  let patientID = auth.currentUser.uid;
  let appointmentRef = database.ref('appointments').push();
  let newAppointment = {
    clinic: clinicID,
    patient: patientID,
    startTime: timestamp,
    isBooking: true
  };
  appointmentRef.set(newAppointment);
};

export const joinQueue = (clinicID) => {
  let patientID = auth.currentUser.uid;
  let appointmentRef = database.ref('appointments').push();
  let newAppointment = {
    clinic: clinicID,
    patient: patientID,
    // placeholder
    startTime: Date.now(),
    isBooking: false
  };
  clinicApptRef.set(newAppointment);
};
