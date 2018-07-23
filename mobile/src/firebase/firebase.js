import * as firebase from 'firebase';
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL, FIREBASE_PROJECTID,
  FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDERID
} from 'react-native-dotenv';

const config = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECTID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDERID
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();
const database = firebase.database();

export { auth, database };
