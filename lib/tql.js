'use strict';

var url = require('url');
var Q = require('q');

var tqlHTTP = require('./tqlHTTP');
var tqlParse = require('./tqlParse');


var nyi = {class: "tqljs", text: "not yet implemented"};


//
// return a TQL connection object that can be used to perform operations
//
function Connection(arg) {
    this._urlObj = url.parse(arg.url);
    this._http = new tqlHTTP(this._urlObj);
}


//
// Execute a transaction against the server
//
// request - an object definining the transaction to be executed
//
Connection.prototype.request = function(transaction) {
    // convert the transaction to the server's format
    var body = tqlParse.parse(transaction);

    if (!body) {
        return Q.reject({class: "tql", text: "error in transaction object"});
    }

    var deferred = Q.defer();

    //
    // post the translated request
    //
    this._http.post(body, {}).then(function(obj){
        // see if something is wrong with the response
        if (!obj.find || !obj.find.status || obj.find.status != "Success") {
            deferred.reject({class: "tql", text: JSON.stringify(obj)})
            return;
        }

        // get rid of the find wrapper and lowercase the result status.
        obj = obj.find;
        obj.status = "success";

        // make sure results are always an array.
        if (obj.result && obj.result.constructor !== Array) {
            obj.result = [obj.result];
        }

        // resolve the request
        deferred.resolve(obj);
    });

    // return our promise
    return deferred.promise;
}


module.exports.Connection = Connection;
