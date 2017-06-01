'use strict';

const Promise = require('bluebird');
const request = require('request-promise');

module.exports = (config) => {

	const auth = require('./..').auth({
		client: config.client
	});

	function getToken(){
		return new Promise(function(forfill, reject){

			// check if token is expired.
			var token = auth.accessToken.create(config.token);

			if(typeof config.renewedTokenFunction === 'function'){
					if (token.expired()) {
					// Callbacks
					token.refresh((error, result) => {
						config.renewedTokenFunction(result);
						forfill(result);
					});
				} else {
					forfill(token);
				}
			} else {
				forfill(token);
			}
		});
	}

	function call(method, url, params){
		const options = Object.assign({}, {
			method,
			json: true,
			headers: {},
		}, config.http);

		return new Promise(function(forfill, reject){
			getToken().then(function(token){
				options.uri = options.uri + '/' + config.apiVersion + '/' + url;

				// if (Object.keys(params).length === 0) params = null;
			    if (method !== 'GET') {
					if (config.options.bodyFormat === 'form') {
						options.form = params;
					} else if (config.options.bodyFormat === 'json') {
						options.json = true;
						options.body = params;
					} else {
						// joi should prevent us from getting here, but throw to be safe.
						throw new Error(
							`Unknown bodyFormat value: ${config.options.bodyFormat}`
						);
					}
			    }

				options.headers.Authorization = `${token.token.token_type} ${token.token.access_token}`;

				forfill(request(options));
			});
		});
	};

	function api(method, url, params) {
		if (typeof params === 'function') {
		  callback = params;
		  params = {};
		}

		return call(method, url, params);
	}

	return {
		call,
		api,
	};

};