import { auth } from './firebase';
import * as database from './database';
// Sign Up
export const doCreateUserWithEmailAndPassword = (email, password) =>
  auth.createUserWithEmailAndPassword(email, password).then(function(newUser) {
    console.log(newUser.user.uid);
    database.updateInfo(newUser.user.uid, email);
    console.log(newUser.idToken);
  });

export const doCreateClinicAccount = (form, password) =>
 auth.createUserWithEmailAndPassword(form.email, password).then(function(newUser) {
   console.log(newUser.user.uid);
   database.submitClinicForm(newUser.user.uid, form);
 });

// Sign In
export const doSignInWithEmailAndPassword = (email, password) =>
  auth.signInWithEmailAndPassword(email, password);

// Sign out
export const doSignOut = () => auth.signOut();

// Password Reset
export const doPasswordReset = email => auth.sendPasswordResetEmail(email);

// Password Change
export const doPasswordUpdate = password =>
  auth.currentUser.updatePassword(password);
