// simple environment management
// 
// exports:
//   getEnv(): gets the current environment (dev | prod)
//   setEnv(): sets the current environment (dev | prod)
//   getConfig(type): gets the config of type 'type' for the current env (dev | prod)
//   getCloudPlatformConfigFile(): gets the GCP config for the current env (dev | prod)
//   getProjectId(): gets the GCP project ID for the current env (dev | prod)
//   getProviderUrl(): gets the URL for this provider, running in the current env (dev | prod)
//   getUrl(): gets the URL for the snapmaster api / engine running in the current env (dev | prod)

var environment;
var devMode;

// constants for environment types
exports.dev = 'dev';
exports.prod = 'prod';

// constants for config types
exports.auth0 = 'auth0';
exports.google = 'google';

const configs = {
  auth0: {
    dev: require(`../config/auth0_config_dev.json`),
    prod: require(`../config/auth0_config_prod.json`)
  },
  /*
  gcp: {
    dev: require(`../config/google_auth_config_dev.json`),
    prod: require(`../config/google_auth_config_prod.json`)
  },
  google: {
    dev: require(`../config/google_auth_config_dev.json`),
    prod: require(`../config/google_auth_config_prod.json`)
  },*/
};

// get the environment (dev or prod)
exports.getEnv = () => environment;

// set the environment (dev or prod)
exports.setEnv = (env) => {
  environment = env;
}

// get devMode state (true or false)
exports.getDevMode = () => devMode;

// set the devMode state
exports.setDevMode = (mode) => {
  devMode = mode;
}

exports.getConfig = (type) => {
  const config = configs[type][environment];
  return config;
}

// note - keyFilename below assumes a path relative to the app root, NOT the current directory
exports.getCloudPlatformConfigFile = () => {
  const cloudConfigFileName = `./config/cloud_platform_config_${environment}.json`;
  return cloudConfigFileName;
}

exports.getProjectId = () => {
  const projectId = environment === 'prod' ? 'snapmaster' : `snapmaster-${environment}`;
  return projectId;
}

exports.getProviderUrl = (providerName) => {
  if (exports.getDevMode()) {
    return 'http://localhost:8081';
  } else {
    const endpoint = `https://provider-${providerName}${environment === 'dev' && '-dev'}.snapmaster.io`;
    return endpoint;  
  }
}

exports.getUrl = () => {
  if (exports.getDevMode()) {
    return 'http://localhost:8080';
  } else {
    const endpoint = environment === 'dev' ? 'https://dev.snapmaster.io' 
                                           : 'https://www.snapmaster.io';
    return endpoint;
  }
}
