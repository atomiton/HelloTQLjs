'use strict';

var http = require('http');
var parseSelection = require('./parseSelection');

//
// return a TQL connection object that can be used to perform operations
//
function Connection(endPoint) {
    this._endPoint = endPoint;
}

var nyi = {
    error: {code: 0, text: "not yet implemented"}
}

//
// prototypical functions of Connection objects
//
Connection.prototype.request = {

    create: function(content) {
        return nyi
    },

    select: function(selection) {
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
