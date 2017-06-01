'use strict';

const customerInvoiceDraftsModule = require('./src/CustomerInvoiceDrafts');

const globalOptions = {
	http: {
		uri: 'https://eaccountingapi-sandbox.test.vismaonline.com'
	},
	apiVersion: 'v1',
};

const globalCredentials = {
	auth: {
		tokenHost: 'https://auth-sandbox.test.vismaonline.com/eaccountingapi/oauth',
		tokenPath: '/eaccountingapi/oauth/token',
		revokePath: '/eaccountingapi/oauth/revoke',
		authorizePath: '/eaccountingapi/oauth/authorize'
	}
}

module.exports = {

	auth(credentials) {
		credentials = Object.assign({}, credentials, globalCredentials);
		return require('simple-oauth2').create(credentials);
	},
	/**
	 * @param  {Object}
	 * @return {Object}
	 */
	create(options) {
		options = Object.assign({}, globalOptions, options);

 		return {
 			customerInvoiceDrafts: customerInvoiceDraftsModule(options),
 		};
	},
};

// 1. authenticate
// 2. make a request
// 3. parse it
