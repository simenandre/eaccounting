'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'), {
  multiArgs: true,
});

module.exports = (config) => {

	function call(method, url, params){
		const options = Object.assign({}, {
			method,
			headers: {},
		}, config.http);

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

		options.headers.Authorization = `Bearer ${config.token}`;
		console.log(options);
		return request(options);
	};

	function api(method, url, params, callback) {
		if (typeof params === 'function') {
		  callback = params;
		  params = {};
		}

		return call(method, url, params)
		  // .spread(parseReponse)
		  .nodeify(callback);
	}

	return {
		call,
		api,
	};

};