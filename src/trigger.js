// trigger.js implements the provider-specific creation, deletion, and handling of triggers
//
// exports:
//   createTrigger: create the trigger
//   deleteTrigger: delete the trigger
//   handleTrigger: handle trigger invocation

const database = require('./data/database.js');

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
    webhookInfo.triggerUrl = `/httppost/webhook/${userId}/${activeSnapId}`;
    webhookInfo.triggerKey = triggerKey;

    await storeTrigger(triggerKey, webhookInfo);
    return webhookInfo;
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
    // TODO: make http call
    return null;
  } catch (error) {
    console.log(`handleTrigger: caught exception: ${error}`);
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

