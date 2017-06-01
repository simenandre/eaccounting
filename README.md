# eAccounting-node

A simple client module for accessing Visma eAccounting's API. It is still early stages in development, please refer to [Current Development Stage](#current-development-stage) for  

## Authentication

eAccounting-node tries to keep a small fotprint, so [simple-oauth2](https://github.com/lelylan/simple-oauth2) have been used for authentication. You can access the authentication variable by `eaccounting.auth()`. API documentation for simple-oauth2 is available [here](http://lelylan.github.io/simple-oauth2/).

## Installation

	npm install eaccounting

## Usage
    
    const authConfig = {
        {  
           "client":{  
              id: "ayr",
              secret: "a string"
           },
           "token":{  
                access_token: "a long string",
                token_type: "Bearer",
                expires_in: 3600,
                refresh_token: "a shorter string",
                expires_at: "2017-06-01T08:32:46.394Z"
           }
        }
    };
    
    const eaccounting = require('eaccounting').create(authConfig);

### Refresh your token
We have built in a `renewedTokenFunction`, what that does is use the `expired` function from simple-oauth2 to refresh it automaticly and return you a Promise so you can store it.

    var authConfig = require('./auth.json');
    const jsonfile = require('jsonfile');
    
    authConfig.renewedTokenFunction = (token) => {
    	jsonfile.writeFile('./auth.json', {
    		client: authConfig.client,
    		token: token.token
    	}, function (err){
    		console.error(err);
    	});
    };
    var eaccounting = require('eaccounting').create(authConfig)
    

## Current Development Stage
Currently the module has the following endpoints added:
- Articles
- CustomerInvoiceDrafts
- Customers

## API Documentation
The updated documentation for Visma eAccounting API is available publicly [here](https://developer.vismaonline.com/). eaccounting-node uses the same name as the endpoint, but with camelCasing.

### Function names
All of the functions have the same function names, as of now.

*Get all*
    
    var customers = eaccounting.customers.getAll()

*Get all (alias)*
    
    var customers = eaccounting.customers.get()

*Get one*
    
    var customer = eaccounting.customers.get(1337)

*Update*
    
    var customer = eaccounting.customers.update(1337)

*Add*
    
    var customer = eaccounting.customers.add({
        name: "Github Inc."
    })



## Contribute!

It is super easy to add the other endpoints, because of the simple API of the module. So please submit pull request if you have implemented more.

### Todo
- feels like everything.
