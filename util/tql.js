http = require('http')

function Connection(endPoint) {
    'use strict';
    this._endPoint = endPoint;
}

var nyi = {
    error: {code: 0, text: "not yet implemented"}
}

Connection.prototype.request = {
    select: function(selection) {
        return {
            //error: {code: 101, text: "big bad error"},
            selection: "here's some parking spaces"
        }
    },

    update: function(sequence) {
        return nyi
    },

    delete: function(selection) {
        return nyi
    }
}

module.exports.Connection = Connection;

/*
module.exports = function(subs, opts) {
    'use strict';


    var files = subs.files;
    var regexes = subs.regexes;
    var regkeys = subs.order || Object.keys(subs.regexes);
    var options = opts || {};


    var doMapping = function(file, enc, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        function doMapping() {
            // TODO: improve filename matching. use full path?
            // allow globs for specific file type?
            var basename = path.basename(file.path);
            if (!subs.files[basename]) {
                // don't do a substitution if no file match
                null;
            } else if (file.isStream()) {
                //console.log(file.path, "is stream");
                throw "per-file-mapping is untested with streams";
                regkeys.forEach(function(k) {
                    // if this key doesn't exist for the file skip it
                    if (!files[basename][k]) {
                        return
                    }
                    file.contents =
                        file.contents.pipe(rs(regexes[k], files[basename][k]));
                });
            } else if (file.isBuffer()) {
                //console.log(file.path, "is buffer");
                var text = String(file.contents);
                regkeys.forEach(function(k) {
                    // if this key doesn't exist for the file skip it
                    if (!files[basename][k]) {
                        return
                    }
                    if (options.debug) {
                        console.log('fsr: replacing', basename, k, "with", files[basename][k]);
                    }
                    text = text.replace(regexes[k], files[basename][k]);
                });
                file.contents = new Buffer(text);
            }

            callback(null, file);
        }

        doMapping();
    };

    return through.obj(doMapping);
};
// */