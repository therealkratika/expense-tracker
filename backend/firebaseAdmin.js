const admin = require("firebase-admin");

const serviceAccount = require("./src/expense-tracker-8d3fd-firebase-adminsdk-fbsvc-f7e740bc99.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
