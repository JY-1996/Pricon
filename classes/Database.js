// const { createConnection } = require('mysql');
// const database = require('mysql')
const admin = require('firebase-admin')
const serviceAccount = require("../private_keys/test.json");

class Database {
  constructor() {
    this.db = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
      .firestore();
  }
}
module.exports = new Database().db