var admin = require("firebase-admin");
var serviceAccount = require("./secret/serviceAccountKey.json");
var { getFirestore } = require("firebase-admin/firestore");

// set up firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://codeway-case-be-default-rtdb.europe-west1.firebasedatabase.app/",
});
var db = getFirestore();

module.exports = { admin, db };
