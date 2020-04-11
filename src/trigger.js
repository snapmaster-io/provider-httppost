// trigger.js implements the provider-specific creation, deletion, and handling of triggers
//
// exports:
//   createTrigger: create the trigger
//   deleteTrigger: delete the trigger
//   handleTrigger: handle trigger invocation

const database = require('./data/database');
const auth0 = require('./auth0');
const environment = require('./environment');
const axios = require('axios');

// define provider-specific constants
const providerName = 'httppost';
const entityName = `${providerName}:webhooks`;
const defaultEntityName = `${entityName}:default`;

exports.createTrigger = async (request) => {
  try {
    const userId = request.userId;
    const activeSnapId = request.activeSnapId;
    const connectionInfo = request.connectionInfo;
    const param = request.param;
    if (!userId || !activeSnapId || !param) {
      console.error('createTrigger: missing one of userId, activeSnapId, or param in request');
      return null;
    }

    // get required parameters
    const event = param.event;
    if (!event) {
      console.error('createTrigger: missing required parameter "event"');
      return null;
    }

    if (event !== 'post') {
      console.error(`createTrigger: unknown event "${event}"`);
      return null;
    }

    const webhook = param.webhook;
    if (!webhook) {
      console.error('createTrigger: missing required parameter "webhook"');
      return null;
    }

    // get the correct secret for the webhook (either passed explicitly, or the default)
    const webhookInfo = (webhook === defaultEntityName) ? 
      connectionInfo :
      param[entityName];

    if (!webhookInfo) {
      console.error(`createTrigger: missing required parameter ${entityName}`);
      return null;
    }

    const triggerKey = `${userId}:${activeSnapId}`;
    webhookInfo.triggerUrl = 
      encodeURI(`${environment.getProviderUrl(providerName)}/httppost/webhook/${userId}/${activeSnapId}`);
    webhookInfo.triggerKey = triggerKey;

    // store the trigger 
    await storeTrigger(triggerKey, webhookInfo);

    // return just the trigger URL 
    return { triggerUrl: webhookInfo.triggerUrl };
  } catch (error) {
    console.log(`createTrigger: caught exception: ${error}`);
    return null;
  }
}

exports.deleteTrigger = async (request) => {
  try {
    const triggerData = request.triggerData;

    // get required parameters
    if (!triggerData) {
      console.error('deleteTrigger: missing triggerData in request');
      return null;
    }

    const triggerKey = triggerData.triggerKey;
    if (!triggerKey) {
      console.error('deleteTrigger: triggerData missing required parameter "triggerKey"');
    }

    const response = await removeTrigger(triggerKey);
    return response;
  } catch (error) {
    console.log(`deleteTrigger: caught exception: ${error}`);
    return null;
  }
}

exports.handleTrigger = async (userId, activeSnapId, event, payload) => {
  try {
    if (event !== 'post') {
      console.error(`handleTrigger: unknown event ${event}`);
      return null;
    }
    
    const triggerKey = `${userId}:${activeSnapId}`;
    console.log(`${providerName}: triggered ${triggerKey} webhook`);

    // since this provider must track the state of its triggers, check first
    // whether the trigger is still active before invoking the snap engine
    const triggerInfo = await getTrigger(triggerKey);
    if (!triggerInfo) {
      console.error(`handleTrigger: could not find trigger key ${triggerKey}`);
      return null;
    }

    // check secret (which is a simple property on the body)
    if (payload.secret !== triggerInfo.secret) {
      console.error(`handleTrigger: secret in request did not match trigger info`);
      return null;
    }

    // invoke the snap engine
    const response = await callSnapEngine(userId, activeSnapId, event, payload)
    return response;
  } catch (error) {
    console.log(`handleTrigger: caught exception: ${error}`);
    return null;
  }
}

const callSnapEngine = async (userId, activeSnapId, event, payload) => {
  try {
    // get an access token for the provider service
    // currently  provider services all do auth via Auth0, and all share an Auth0 API service clientID / secret
    const token = await auth0.getAPIAccessToken();
    if (!token) {
      console.error('createTrigger: could not retrieve API access token');
      return null;
    }

    // remove the secret passed in
    delete payload.secret;

    // construct snap engine dispatch URL
    const snapEngineUrl = `${environment.getUrl()}/executesnap/${userId}/${activeSnapId}`;
    const body = {
      event: event,
      ...payload
    };

    const headers = { 
      'content-type': 'application/json',
      'authorization': `Bearer ${token}`
    };

    const response = await axios.post(
      snapEngineUrl,
      body,
      {
        headers: headers
      });

    console.log(`${providerName}: invoked snap engine at ${snapEngineUrl}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error(`callSnapEngine: caught exception: ${error}`);
    return null;
  }    
}

const getTrigger = async (triggerKey) => {
  return await database.getDocument(triggerKey);
}

const removeTrigger = async (triggerKey) => {
  return await database.removeDocument(triggerKey);
}

const storeTrigger = async (triggerKey, webhookInfo) => {
  return await database.storeDocument(triggerKey, webhookInfo);
}

