const admin = require('firebase-admin');
const {PRIVATE_KEY} = JSON.parse(process.env.PRIVATE_KEY) // Do for Long String ENV var also see ENV var in .env file or try delete ("") or ('') in ENV variable value

// Your web app's Firebase configuration
const firebaseConfig = {
  // From Web Connectivity
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  // from Service Account JSON
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
  client_x509_cert_url: process.env.CLIENT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

// Access Firestore
const db = admin.firestore();

// For testing
//const fbconf = firebaseConfig;

module.exports = {admin, db};

/*
Note: firebase package is for client, for server prefer to use firebase-admin
Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
*/

