import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyAe-kdYNRZJkY90rspVXhmCNqlbhAAncqg',
  authDomain: 'locatemd.firebaseapp.com',
  databaseURL: 'https://locatemd.firebaseio.com',
  projectId: 'locatemd',
  storageBucket: 'locatemd.appspot.com',
  messagingSenderId: '385392707364'
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const database = firebase.database();

export { auth, database };
