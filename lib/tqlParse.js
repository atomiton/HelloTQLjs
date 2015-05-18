//
// this module implements conversion of a request object into the server's
// XML format query.
//
// {select: {
//      parkingSpace: {sid: '*'}
// }}
//
// {create: {
//      stuff
// }}
//
// more to come...
//

TqlError = require('./tqlUtil').TqlError;

//
// module private functions
//

// select transaction
function tqlSelect() {
    this.xmlPrefix = '<query><find>';
    this.xmlSuffix = '</find></query>';
    this.xmlInside = [];
}

tqlSelect.prototype.insert = function(item) {
    this.xmlInside.push(item);
}

tqlSelect.prototype.get = function() {
    return this.xmlPrefix + this.xmlInside.join('') + this.xmlSuffix;
}


function fake() {
    return "<query>" +
                "<find>" +
                    "<parkingspace>" +
                        "<sid ne=''/>" +
                    "</parkingspace>" +
                "</find>" +
            "</query>"
}

//
// parse an object representation of a transaction with the server and convert it
// to an XML expression that the server uses.
//
// transactions
// {select: {criteria}}
// {create: {createInfo}}
// {update: {updateInfo}}
// {delete: {criteria}}
//
module.exports.parse = function(transaction) {
    var type = Object.keys(transaction);
    if (type.length !== 1) {
        return {error: new TqlError("tql", "error in transaction - invalid type")};
    }
    type = type[0];

    if (type !== 'select') {
        return {error: new TqlError("tql", "error in transaction - invalid type")};
    }

    // start select-specific parsing logic
    // get a select object
    var translated = new tqlSelect();
    // leave only the criteria
    var criteria = transaction[type];

    // item-selection logic
    try {
        parseSelect(translated, criteria);
    } catch (e) {
        if (!(e instanceof TqlError)) {
            e = new TqlError("js", e);
        }
        return {error: e};
    }

    return {success: translated.get()};
}


var ops = {$or: '<or>'};
var conditionals = {$eq: 'eq', $ne: 'ne', $lt: 'lt', $le: 'le', $gt: 'gt', $ge: 'ge'};

function allConditionals(keys) {
    for (var i = 0; i < keys.length; i++) {
        if (!(keys[i] in conditionals)) {
            return false
        }
    }
    return true
}

//
// receive an object that defines the selection criteria
//
function parseSelect(translated, criteria) {
    var keys = Object.keys(criteria);
    var op, subkeys, nextitem, nextkeys, value, selector;

    for (var k = 0; k < keys.length; k++) {
        // is it an operator?
        if (ops[keys[k]]) {
            op = keys[k];
            if (op !== '$or') {
                throw 'only $or is implemented';
            }
            translated.insert('<or>');
            criteria[op].forEach(function(criteria) {
                parseSelect(translated, criteria);
            });
            translated.insert('</or>');
            continue;
        };

        // it might be the form path.to.key. insert all but the last key
        subkeys = keys[k].split('.');
        for (var i = 0; i < subkeys.length - 1; i++) {
            translated.insert('<' + subkeys[i] + '>');
        }

        // if the value with the key is not an object then it's selection criteria. use
        // the final key in subkeys with the selection criteria.
        // TODO: handle case where value is an object (allConditionals === true)
        nextitem = criteria[keys[k]];
        nextkeys = typeof nextitem === 'object' && Object.keys(nextitem);

        if (!nextkeys || allConditionals(nextkeys)) {
            value = criteria[keys[k]];
            if (value === '*') {
                selector = '<' + subkeys[i] + ' ne=""/>'
            } else {
                selector = '<' + subkeys[i] + ' eq="' + value + '"/>'
            }
            translated.insert(selector);
        } else {
            translated.insert('<' + subkeys[i] + '>');
            parseSelect(translated, criteria[keys[k]]);
            translated.insert('</' + subkeys[i] + '>');
            i = i - 1;
        }

        // close with unused keys
        while(i > 0) {
            i = i - 1;
            translated.insert('</' + subkeys[i] + '>');
        }
    }
}
