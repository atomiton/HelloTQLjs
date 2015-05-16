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
// prototypical functions of Connection objects
//
Connection.prototype.select = function(selection) {
    var body = tqlParse.parse(selection);

    if (!body) {
        return Q.reject({class: "select", text: "syntax error in selection"});
    }

    var deferred = Q.defer();

    //
    // post
    //
    this._http.post(body, {}).then(function(obj){
        // see if something is wrong with the response
        if (!obj.find || !obj.find.status || obj.find.status != "Success") {
            deferred.reject({class: "tql", text: JSON.stringify(obj)})
            return;
        }
        // get rid of the find wrapper. should it go in a select wrapper?
        obj = obj.find;
        obj.status = "success";
        // make sure results are always an array.
        if (obj.result && obj.result.constructor !== Array) {
            obj.result = [obj.result];
        }
        deferred.resolve(obj);
    });

    // return our promise
    return deferred.promise;
}

Connection.prototype.request = {

    create: function(content) {
        return nyi
    },

    select: function(selection) {
        var deferred = Q.defer();
        var tqlSyntax = parseSelection.parse(selection);
        //httpPost()

        return {
            //error: {code: 101, text: "big bad error"},
            selection: parseSelection.parse(selection)
        }
    },

    update: function(sequence) {
        return nyi
    },

    delete: function(selection) {
        return nyi
    },

}

module.exports.Connection = Connection;
