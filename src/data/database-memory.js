// an in-memory implementation of the database API

// initialize the users hash (current storage method)
const documents = {};

// get a document 
exports.getDocument = async (name) => {
  try {
    const doc = documents[name];
    return doc;
  } catch (error) {
    console.log(`getDocument: caught exception: ${error}`);
    return null;
  }
}

// remove a document 
exports.removeDocument = async (name) => {
  try {
    delete documents[name];
  } catch (error) {
    console.log(`removeDocument: caught exception: ${error}`);
  }
}

// store a document into a collection
exports.storeDocument = async (name, data) => {
  try {
    documents[name] = data;
  } catch (error) {
    console.log(`storeDocument: caught exception: ${error}`);
  }
}
