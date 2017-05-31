'use strict';

module.exports = (config) => {
	const CoreModule = require('./core')(config);

	function get(id){
		if(typeof id === 'undefined'){
			return CoreModule.api('GET', 'customerinvoicedrafts');
		} else {
			return CoreModule.api('GET', 'customerinvoicedrafts/' + id);
		}
	}

	return {
		get,
	}
};