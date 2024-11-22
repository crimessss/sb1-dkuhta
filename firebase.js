const admin = require('firebase-admin');

// Initialize Firebase Admin with service account
const serviceAccount = {
  "type": "service_account",
  "project_id": "blackjack-bot-db",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@blackjack-bot-db.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40blackjack-bot-db.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// For development, we'll use an in-memory database instead of Firebase
const inMemoryDB = new Map();

async function writeUserData(userId, userData) {
  inMemoryDB.set(userId, userData);
  return userData;
}

async function readUserData(userId) {
  return inMemoryDB.get(userId) || {};
}

async function getAllUserData() {
  return Object.fromEntries(inMemoryDB);
}

module.exports = {
  writeUserData,
  readUserData,
  getAllUserData
};