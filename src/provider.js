// HTTPPOST provider service for triggering a snap on an HTTP POST

const { checkJwt, logRequest } = require('./requesthandler');
const trigger = require('./trigger.js');

// define provider-specific constants
const providerName = 'httppost';

exports.createHandlers = (app) => {
  app.post('/createTrigger', logRequest, checkJwt, function(req, res){
    const create = async (payload) => {
      const result = await trigger.createTrigger(payload);
      res.status(200).send(result);
    }

    create(req.body);
  });

  app.post('/deleteTrigger', logRequest, checkJwt, function(req, res){
    const del = async (payload) => {
      const result = await trigger.deleteTrigger(payload);
      res.status(200).send(result);
    }

    del(req.body);
  });

  // POST webhooks endpoint
  app.post(`/${providerName}/webhooks/:userId/:activeSnapId`, function(req, res){
    try {
      const userId = decodeURI(req.params.userId);
      const activeSnapId = req.params.activeSnapId;
      console.log(`POST /${providerName}/webhooks: userId ${userId}, activeSnapId ${activeSnapId}`);

      // handle the webhook
      const handle = async (payload) => {
        const response = await trigger.handleTrigger(userId, activeSnapId, 'post', payload);
        res.status(200).send(response);
      }

      handle(req.body);
    } catch (error) {
      console.error(`${providerName} webhook caught exception: ${error}`);
      res.status(500).send(error);
    }
  });
}
