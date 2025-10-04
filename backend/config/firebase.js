const admin = require('firebase-admin');

let db = null;

const initializeFirebase = () => {
  try {
    if (!admin.apps.length) {
      const serviceAccount = {
        type: "service_account",
        project_id: "celebratehub-mvp",
        private_key_id: "e4e69e7e5ecad4bf09afe6a381e52105373bbedb",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuBQcK2csmNyag\ny8hPElzehNorXOjBNGCPEt/GiTIhLya70NA8FaJzaXJIDrxxDIMvTWc5hpFSkIql\n7ZTEuaRKqTtPcm+eNj8xv1w7B0K8Yiia30nGCy1rSlLuVUiQiYArwWdzuzu9SqIN\n14NoLl8p42vhjmc8FxKXRLO1HBUFvCcZAGRXv8u3VQmZF4wG4KDMFrOn36V5txl9\nGCrUgMw8+oG7hhHWMG/MuIiRAV4ZQ1OWn8Y8zwsqDoGcRHsUHzIZXUL5Niuif/1j\nK3fXsXHblBIIptFrgoxEYXhDiwZGYkEOkUXW4oD8JBJH+83FSOWEjYM5gnlZxWX/\nAQ3gRLjHAgMBAAECggEAEgBkI5u3F6tx3AVoocFhCQXOOdkhHMdpy7MkofmUTXl+\ntMQbnnOQfAbm8wxPMxSbx3tm170TcGqSZSrIDnezxqNuBsBsSn4LGH7WsCaGoU04\nLRk3HP0QBD7KiGwbFxSaRSx7Iq42NlUvoWXvaooNfxxPDyS3ijBK1IofWvdeN1r8\nyw+xrD21yJb0/29kNSpE2uIwfYhfYesHiae0OHf+75PPjh66rC6jGTsFkvDD7+2c\nSNVgr6loRy6Wqlr9HeBcdAg9wvbLFN1gaEzqPblaqGkGk+KcLqZvdstLBNIhpAt1\nNeUgmbSLI5h8lXeWN64IUZyu+Dc+0aRKQtT+SGxYXQKBgQDyje7iv6hUWfGDqoxC\ncdw126gSE01JzSnFEP2jcAc6uXTXb9D5VRT/APng0h5HtFx5WaIS4/EzQSJMxev5\nKqlGL2olZ5+bnPHNE0I5H2d46riaMU011n7HvMp2/R67BB2czCrK9qqAsx51JQPP\nySP1NB7CKqO5vot4t+BrceLWtQKBgQC3qoYQtdoHQqBG82G1EPy2uDRaHAZ1CdMm\nvlZ1yhTOm64G0ALHGF2bIX7FbVk1S0xO2JQjpYSFs3VSbNEsaFG3G/m7QB3vBauY\nHDRLD/wrqaIg8BhfjSMa3HxL1GX4cUuspdmJoLfnNO2qqCBGqiMWp6kEIA/kmPAI\nT15ehXfjCwKBgFZwBDCkMl2VC/9q+L75Cova8oM2g7WIOply26Cx3LGtw5i+zU79\nZhUWCPZ4irfs64OHUL3Ao4UrcgjAA77w2BAd94rK6dMv0+/MLC5lJZ+urgitByHn\nhZiyi8hpndjxt4fYLmvUCaEBtBn1De2vdXP9lfSF84DPCa8EgCJqHHd9AoGBAK4F\nHPeSRh1g7FmtWqNjj/5UNA44xYl5IJ5x85uxN9u2t8HuruMTXAWTS/klrUOIr6l5\nHYtU1WaU7ZGGVv57bQlQsWLQ0kvZlIcQGiAQ6j44gMwykPVf1aYqyH5UpbUrK6dO\nkPoM1JJ1nMZ4e/RYWdyqSMMG2egfXDaTdPecAEaXAoGAIPG9LKJJChoc7XPwoEVx\nr8GnRrzNHBaWgZugE1Jg9QwOOlgI3F7gzxQbehBTnly/bIqjy40Cac81GC8Ay4nD\nua9I8cpw1c20pgYzYYTZLJqIuTp1Wl5EcgKCGXqGW+KPyPWQ2/vZNE4/rqAoKoOF\nxFQlCht+RXCc7BuG9Y0ZiL0=\n-----END PRIVATE KEY-----\n",
        client_email: "firebase-adminsdk-fbsvc@celebratehub-mvp.iam.gserviceaccount.com",
        client_id: "105003685746687128629",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://celebratehub-mvp-default-rtdb.firebaseio.com`
      });
    }

    db = admin.firestore();
    console.log('🔥 Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

const getFirestore = () => {
  if (!db) {
    throw new Error('Firebase not initialized');
  }
  return db;
};

module.exports = {
  initializeFirebase,
  getFirestore
};
