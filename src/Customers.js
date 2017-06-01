'use strict';

module.exports = (config) => {
	const CoreModule = require('./core')(config);
	const endpoint = 'customers';

	function get(id){
		if(typeof id === 'undefined'){
			return getAll();
		} else {
			return CoreModule.api('GET', endpoint + '/' + id);
		}
	}

	function getAll(){
		return CoreModule.api('GET', 'CustomerListItems');
	}

	function update(id, data){
		return CoreModule.api('PUT', endpoint + '/' + id, data);
	}

	function add(data){
		return CoreModule.api('POST', endpoint, data);
	}

	return {
		get,
		getAll,
		update,
		add
	}
};