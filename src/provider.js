// POST provider service for triggering a snap on an HTTP POST

const { checkJwt, logRequest } = require('./requesthandler');

// define provider-specific constants
const providerName = 'post';
const entityName = `${providerName}:projects`;
const defaultEntityName = `${entityName}:default`;


exports.createHandlers = (app) => {
  // POST handler for invokeAction  
  app.post('/invokeAction', logRequest, checkJwt, function(req, res){
    const invoke = async (payload) => {
      const result = await invokeAction(payload);
      res.status(200).send(result);
    }

    invoke(req.body);
  });
}

const invokeAction = async (request) => {
  try {
    const activeSnapId = request.activeSnapId;
    const param = request.param;
    if (!activeSnapId || !param) {
      console.error('invokeAction: missing one of activeSnapId or param in request');
      return null;
    }

    // get required parameters
    const action = param.action;
    if (!action) {
      console.error('invokeAction: missing required parameter "action"');
      return null;
    }

    console.log(`${providerName}: executing action ${action}`);

    // construct script name and environment

    console.log(`gcp: finished executing action ${action}; output: ${outputString}`);

    // return output
    return output;
  } catch (error) {
    console.log(`invokeAction: caught exception: ${error}`);
    return null;
  }
}
