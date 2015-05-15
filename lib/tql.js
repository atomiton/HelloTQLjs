'use strict';

var http = require('http');
var url = require('url');
var Q = require('q');
var parseSelection = require('./parseSelection');
var x2js = require('xml2js').parseString;

// some options to tune the XML to JavaScript Object
var x2jsOpts = {mergeAttrs: true, explicitArray: false};

//
// return a TQL connection object that can be used to perform operations
//
function Connection(arg) {
    this._url = url.parse(arg.url);
}

var nyi = {
    error: {code: 0, text: "not yet implemented"}
}

var postOptions = {
    hostname: 'www.google.com',
    port: 80,
    path: '/upload',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 7 //postData.length
    }
};

//
// prototypical functions of Connection objects
//
Connection.prototype.select = function(selection) {
    var deferred;
    var body = parseSelection.parse(selection);
    var options = {
        hostname: this._url.hostname,
        port: this._url.port,
        path: this._url.path,
        method: "post",
        headers: {
            "content-length": body.length,
            "content-type": "text/plain;charset=UTF-8",
            /*
            accept: "* / *",
            Accept-Encoding:gzip, deflate
            Accept-Language:en-US,en;q=0.8
            Connection:keep-alive
            // */
        }
    }

    if (!body) {
        return Q.reject({class: "select", text: "syntax error in selection"});
    }

    deferred = Q.defer();

    var req = http.request(options, function(res) {
        var responseBody = [];
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));

        // TODO: need to handle errors (i.e., not 200 status)

        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            responseBody.push(chunk);
        });

        res.on('end', function() {
            console.log('END event fired');
            responseBody = '    ' + responseBody.join('');
            // TODO: handle end
            x2js(responseBody, x2jsOpts, function(e, js) {
                if (e) {
                    //console.log('x2js error:', e.message);
                    deferred.reject({class: "xml", text: e.message});
                } else {
                    deferred.resolve(js);                    
                }
            });
        });

        res.on('close', function () {
            // TODO: handle close
            console.log('CLOSE event fired');
        });
    });

    req.on('error', function(e) {
        deferred.reject({class: "http", text: e.message});
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.write(body);
    req.end();

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
