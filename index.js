'use strict';

const customerInvoiceDraftsModule = require('./src/CustomerInvoiceDrafts');
const ArticlesModule = require('./src/Articles');
const CustomersModule = require('./src/Customers');

module.exports = (environment) => {

	if(typeof environment == 'undefined'){
		var APIURL = 'https://eaccountingapi-sandbox.test.vismaonline.com';
		var AUTHURL = 'https://auth-sandbox.test.vismaonline.com/eaccountingapi/oauth';
	} else if (environment == 'production'){
		var APIURL = 'https://eaccounting.vismaonline.com/api/';
		var AUTHURL = 'https://auth.vismaonline.com/eaccountingapi/oauth/token';
	}

	const globalOptions = {
		http: {
			uri: ''
		},
		apiVersion: 'v1',
	};

	const globalCredentials = {
		auth: {
			tokenHost: '',
			tokenPath: '/eaccountingapi/oauth/token',
			revokePath: '/eaccountingapi/oauth/revoke',
			authorizePath: '/eaccountingapi/oauth/authorize'
		}
	}

	return {

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
	 			customers: CustomersModule(options),
	 			articles: CustomersModule(options)
	 		};
		},

	};
};

// 1. authenticate
// 2. make a request
// 3. parse it
