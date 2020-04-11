// some generic database get/set functions for various entities
// 
// setup:
//   setProvider: sets the provider
// wrapper methods:
//   getDocument: get a document from a collection
//   removeDocument: remove a document from a collection
//   storeDocument: store a document into a collection

// import providers
const firestore = require('./database-firestore')
const memory = require('./database-memory')

// define providers hash
const providers = {
  firestore: firestore,
  memory: memory
}

// set the provider
var provider = providers['firestore']

// set the provider to use for persistence (default to firestore)
exports.setProvider = (prov = 'firestore') => {
  provider = providers[prov]
}

// get a document from a collection
exports.getDocument = async (name) => {
  return await provider.getDocument(name)
}

// remove a document from a particular entity collection
exports.removeDocument = async (id) => {
  return await provider.removeDocument(id)
}

// store a document into a collection
exports.storeDocument = async (name, data) => {
  return await provider.storeDocument(name, data)
}
