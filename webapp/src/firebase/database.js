import { database } from './firebase';

export const updateInfo = (id, email, contactNumber="") =>
  database.ref(`clinics/${id}`).set({
    contactNumber: contactNumber,
    email: email
  }, function(error) {
    if (error) {
      console.log(error);
    } else {
      console.log("CHANGED");
    }
  });

export const getInfo = id =>
  database
    .ref(`clinic/${id}`)
    .once('value')
    .then(function(snapshot) {
      return snapshot.val();
    });
