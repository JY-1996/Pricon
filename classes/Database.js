// const { createConnection } = require('mysql');
// const database = require('mysql')
const admin = require('firebase-admin')
// const serviceAccount = require("../private_keys/pricon-38956-firebase-adminsdk-d6snq-994f1b8116.json");
const serviceAccount = require("../private_keys/pricon-315204-firebase-adminsdk-fbc2g-b32a6d3268.json");


class Database {
  constructor() {
    this.db = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
      .firestore();
  }
}
module.exports = new Database().db