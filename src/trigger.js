// trigger.js implements the provider-specific creation, deletion, and handling of triggers
//
// exports:
//   createTrigger: create the trigger
//   deleteTrigger: delete the trigger
//   handleTrigger: handle trigger invocation

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

    if (event !== `${providerName}:post`) {
      console.error(`createTrigger: unknown event "${event}"`);
      return null;
    }

    const secret = param.secret;
    if (!secret) {
      console.error('createTrigger: missing required parameter "secret');
    }

    const triggerUrl = `/post/webhook/${userId}/${activeSnapId}`;

    const response = await storeTrigger(triggerUrl, secret);
    return response;
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

    const triggerUrl = param.triggerUrl;
    if (!triggerUrl) {
      console.error('deleteTrigger: triggerData missing required parameter "triggerUrl"');
    }

    const response = await removeTrigger(triggerUrl);
    return response;
  } catch (error) {
    console.log(`deleteTrigger: caught exception: ${error}`);
    return null;
  }
}

exports.handleTrigger = async (request) => {
  try {
    // since this provider must track the state of its triggers, check first
    // whether the trigger is still active before invoking the snap engine
    const trigger = getTrigger()


  } catch (error) {
    console.log(`handleTrigger: caught exception: ${error}`);
    return null;
  }
}

const getTrigger = async (triggerUrl) => {
    
}

const removeTrigger = async (triggerUrl) => {
  
}

const storeTrigger = async (triggerUrl, secret) => {

}

