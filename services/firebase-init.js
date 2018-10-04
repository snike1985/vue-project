import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: process.env.firebaseKey,
  authDomain: process.env.firebaseDomain,
  databaseURL: process.env.firebaseUrl
};

!firebase.apps.length ? firebase.initializeApp(config) : ''
export default firebase
