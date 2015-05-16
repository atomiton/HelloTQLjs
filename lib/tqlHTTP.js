"use strict";

var http = require('http');
var Q = require('q');
var x2js = require('xml2js').parseString;
var tqlu = require('./tqlUtil');

// some options to tune the XML to JavaScript conversion
var x2jsOpts = {
    mergeAttrs: true,            // merge attr and children as props of parent
    explicitArray: false,        // only create arrays when multiple children
    normalizeTags: true,         // lowercase tag names for javascript sanity
    attrNameProcessors: [        // no option to normalize attributes, so this
        function(name) {
            debugger;
            return name.toLowerCase();
        }
    ]
};

//
// Constructor function for the tqlHTTP class
//
function tqlHTTP(urlObj) {
    this._urlObj = urlObj;
}


//
// Returns the default options in node's http module format.
//
tqlHTTP.prototype.getDefaultHTTPOptions = function() {
    return {
        hostname: this._urlObj.hostname,
        port: this._urlObj.port,
        path: this._urlObj.path,
        method: null,
        headers: {
            "content-length": 0,
            "content-type": "text/plain;charset=UTF-8",
            /*
            accept: "* / *",
            Accept-Encoding:gzip, deflate
            Accept-Language:en-US,en;q=0.8
            Connection:keep-alive
            // */
        }
    };
}

//
// Combines the default options with options specified in options
//
tqlHTTP.prototype.getHTTPOptions = function(options) {
    var opts = this.getDefaultHTTPOptions();
    return tqlu.override(opts, options);
}

//
// function to execute GET and POST and handle low level errors
//
function httpRequest(options) {
    var deferred = Q.defer();

    var req = http.request(options, function(res) {
        var responseBody = [];

        //
        // the TQL server only issues 200s for success
        //
        if (res.statusCode !== 200) {
            var text = {status: res.statusCode, headers: res.headers};
            deferred.reject({class: "http", text: JSON.stringify(text)});
            return;
        }
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');

        // handle incoming data
        res.on('data', function(chunk) {
            responseBody.push(chunk);
        });

        // until there is no more data
        res.on('end', function() {
            //console.log('END event fired');
            // put any chunks back together and convert the XML to an object
            responseBody = responseBody.join('');
            x2js(responseBody, x2jsOpts, function(e, js) {
                if (e) {
                    deferred.reject({class: "xml", text: e.message});
                } else {
                    deferred.resolve(js);                    
                }
            });
        });

        res.on('close', function () {
            // TODO: handle close - is there anything to do?
            //console.log('CLOSE event fired');
        });
    });

    req.on('error', function(e) {
        deferred.reject({class: "http", text: e.message});
        //console.log('problem with request: ' + e.message);
    });

    // return the request so a post can write additional data if needed
    return {req: req, promise: deferred.promise};
}

//
// execute http get with additional options
//
// returns promise
//
tqlHTTP.prototype.get = function(options) {
    var opts = this.getHTTPOptions(options);
    opts.method = "get";

    var ret = httpRequest(opts);

    // no body to write for a get. kick off the request.
    ret.req.end();

    // return the promise we were given
    return ret.promise;
}

//
// Post body with optional options
//
// returns promise
//
tqlHTTP.prototype.post = function(body, options) {
    var opts = this.getHTTPOptions(options);
    opts.method = "post";
    opts.headers["content-length"] = body.length;

    var ret = httpRequest(opts);

    // write the body and kick off the request
    // TODO: handle false return and drain event to write mode?
    // large bodies might require
    ret.req.write(body);
    ret.req.end();

    // and return the promise we were given
    return ret.promise;
}

module.exports = tqlHTTP;
