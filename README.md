![SnapMaster](https://github.com/snapmaster-io/snapmaster/blob/master/public/SnapMaster-logo-220.png)
# Provider-HTTPPOST

This repository contains an HTTP POST provider for SnapMaster.  It handles POST requests to 
a webhook-like URL which a user can call, and acts as a trigger to a SnapMaster snap (workflow).  The main work it does is to validate a shared secret, and then invoke 
the appropriate snap hosted by the [SnapMaster-API](https://github.com/snapmaster-io/snapmaster-api) service.

Provider-HTTPPOST utilizes the express web server, and relies on [Auth0](https://auth0.com) for authenticating calls (which can only be made with authorization tokens obtained from the Auth0 token endpoint).

It is a Google Cloud Platform app, with dependencies on Google Cloud Build, Google Cloud Run, and Google Cloud Pubsub. 

## Available scripts

### `npm start` (or `npm run start:dev`)

Runs the backend with ENV=dev, which invokes the dev environment.  

The express webserver will default to listening on port 8082.  Override with PORT=xxxx variable.

### `npm run start:prod`

Runs the backend with ENV=prod, which invokes the production environment. 

The express webserver will default to listening on port 8080.  Override with PORT=xxxx variable.

### `npm run start:devhosted`

Runs the backend with dev account credentials but with the `prod` configuration, which runs 
a production-like hosted environment in the dev account. 

### `npm run build:dev | build:prod` and `npm run deploy:dev | deploy:prod`

These will build the Docker container for the provider using Google Cloud Build, and deploy it to Google Cloud Run.  

### `npm run push:dev | push:prod`

This combines the `build` and `deploy` operations to automate the deployment of the current source code with one command into the respective environment.

## Directory structure

The app is bootstrapped out of `index.js`, which pulls in all other source dependencies out of the `src` directory.

### `config`

Contains all the config for the project.  These files aren't committed to source control since they contain secrets.

The provider expects an `auth0_config_{dev|prod}.json` file for application keys and secret keys for your Auth0 tenant.

```
{
  "domain": "YOURDOMAIN.auth0.com",
  "client_id": "THE CLIENT ID FOR YOUR DOMAIN",
  "client_secret": "THE CLIENT SECRET FOR YOUR DOMAIN",
  "audience": "https://api.snapmaster.io"
}
```

### `scripts`

Contains scripts to build and deploy the provider to GCP.

### `src`

Contains scaffolding source files (`environment.js`, `requesthandler.js`) that can be reused across provider implementations.

### `src/provider.js`

Contains the provider-specific code.  
