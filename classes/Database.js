// const { createConnection } = require('mysql');
// const database = require('mysql')
const admin = require('firebase-admin')
// const serviceAccount = require("../private_keys/pricon-a910a-firebase-adminsdk-8a7eg-720ebd3f77.json");
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