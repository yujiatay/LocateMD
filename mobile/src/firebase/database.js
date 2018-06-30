import { database, auth } from './firebase';

// 3 hours
const BOOKINGTHRESHOLD = 10800000;
// 5 minutes
const OUTDATEDTHRESHOLD = -5;

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


// TODO : change to proper https request
export const updateClinicEstimate = (clinicID) => {
  fetch(`https://us-central1-locatemd.cloudfunctions.net/updateClinicEstimate?clinicID=${encodeURIComponent(clinicID)}`, {
    method: "GET"
  });
};

export const getInfo = (authUser) => {
  id = authUser.uid;
  database
  .ref(`patients/${id}`)
  .once('value')
  .then(function (snapshot) {
    return snapshot.val();
  });
};

export const getAppointments = (authUser) => {
  let id = authUser.uid;
  let appointmentRef = database.ref('appointments').orderByChild('patient').equalTo(id);
  let objOfAppointmentObjs = null;
  return appointmentRef.once('value', (snapshot) => {
    let arr = [];
    objOfAppointmentObjs = snapshot.val();
    if (objOfAppointmentObjs != null) {
      arr = Object.keys(objOfAppointmentObjs).map(i => {
        return objOfAppointmentObjs[i];
      })
    }
    return arr;
  }, (error) => {
    throw error;
  })
};

export const parseClinics = dataObj => {
  if (dataObj != null) {
    return Object.keys(dataObj).map(i => {
      let srcClinic = dataObj[i];

      let timeEstimateString = resolveEstimatedTime(srcClinic.nextEstimate);

      return {
        estimatedWaitTime: timeEstimateString,
        clinicID: i,
        ...dataObj[i]
      }
      // return {
      //   name: srcClinic.clinicName,
      //   address: srcClinic.address.blockNo + " " + srcClinic.address.streetName +
      //   " S" + srcClinic.address.postalCode,
      //   // TODO: figure out how to display opening hours nicely
      //   openingHours: "9am to 5pm",
      //   contactNumber: srcClinic.contactNumber,
      //   estimatedWaitTime: timeEstimateString,
      //   clinicID: i,
      //   lon: srcClinic.coords.lon,
      //   lat: srcClinic.coords.lat
      // };
    });
  } else {
    return null;
  }
};


function resolveEstimatedTime(estimateMilliseconds) {
  if (estimateMilliseconds < 0) {
    if (-estimateMilliseconds > Date.now() + BOOKINGTHRESHOLD) {
      return "More than 3 hours, try booking instead.";
    } else {
      return "Poor estimate, please refresh to get updated estimate.";
    }
  }
  let estimate = Math.floor((estimateMilliseconds - Date.now()) / 60000);
  if (estimate < 0) {
    if (estimate < OUTDATEDTHRESHOLD) {
      return "Poor estimate, please refresh to get updated estimate.";
    } else {
      estimate = 0;
    }
  }
  return estimate + " min";
}



export const bookAppointment = (timestamp, clinicID) => {
  let patientID = auth.currentUser.uid;
  let appointmentRef = database.ref('appointments').push();
  let newAppointment = {
    clinic: clinicID,
    patient: patientID,
    startTime: timestamp,
    isBooking: true
  };
  return appointmentRef.set(newAppointment);
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
  return appointmentRef.set(newAppointment, (error) => {
    if (error) {
      return {error: error, appointment: null};
    } else {
      return appointmentRef.once('value', (snapshot) => {
        return {error: null, appointment: snapshot.val()};
      });
    }
  });
};
