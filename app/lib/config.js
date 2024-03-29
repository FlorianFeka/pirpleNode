/*
 * Create and export configuration variables
 *
 */

// Container for all the evironments
var environments = {};

environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'stating',
    hashingSecret: 'thisIsASecret',
};

// Production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashingSecret: 'thisIsASecret',
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof process.env.NODE_ENV == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment above, if not, default to staging
var environmentToExport = typeof environments[currentEnvironment] == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
