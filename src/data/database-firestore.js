// a firestore-based implementation of the database API

const Firestore = require('@google-cloud/firestore');
const environment = require('../environment');
const cloudConfigFile = environment.getCloudPlatformConfigFile();
const projectId = environment.getProjectId();

const db = new Firestore({
  projectId: projectId,
  keyFilename: cloudConfigFile,
});

var triggers = db.collection('triggers');

// get a document from a collection
exports.getDocument = async (name) => {
  try {
    const doc = await triggers.doc(name).get();
    if (!doc.exists) {
      return null;
    }
    const data = doc.data();
    return data;
  } catch (error) {
    console.log(`getDocument: caught exception: ${error}`);
    return null;
  }  
}

// remove a document from a collection
exports.removeDocument = async (name) => {
  try {
    // address the document in the collection
    const doc = triggers.doc(name);

    // remove the document
    await doc.delete();
  } catch (error) {
    console.log(`removeDocument: caught exception: ${error}`);
    return null;
  }
}

// store a document into a collection
exports.storeDocument = async (name, data) => {
  try {
    const doc = triggers.doc(name);
    await doc.set(data);
  } catch (error) {
    console.log(`storeDocument: caught exception: ${error}`);
    return null;
  }  
}

