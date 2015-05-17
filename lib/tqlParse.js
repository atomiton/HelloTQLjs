//
// this module implements conversion of a request object into the server's
// XML format query.
//
// {select: {
//      parkingSpace: '*'
// }}
//
// {create: {
//      stuff
// }}
//
// more to come...
//

//
// module private functions
//
/*
function tqlRequest() {

}

tqlRequest.prototype.init = function(type) {
    this.type = type;
    this.translated = null;
}

tqlRequest.prototype.parseSelectionCriteria = function(criteria) {
    var items = Object.keys(criteria);
    var value, selector, selectExpr;

    for (var i = 0; i < items.length; i++) {
        value = criteria[items[i]];
        selector = (value === '*') ? '<sid ne=""/>' : '<sid eq="' + value + '"/>'
        selectExpr = '<' + items[i] + '>' + selector + '</' + items[i] + '>';
        this.translated.insert(selectExpr);
    }
}
// */

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
        return {error: {class: "tql", text: "error in transaction - invalid type"}};
    }
    type = type[0];

    if (type !== 'select') {
        return {error: {class: "tql", text: "error in transaction - invalid type"}};
    }

    // start select-specific parsing logic
    // get a select object
    var translated = new tqlSelect();
    // leave only the criteria
    var criteria = transaction[type];

    // item-selection logic
    /*
    var items = Object.keys(criteria);
    for (var i = 0; i < items.length; i++) {
        var value = criteria[items[i]];
        var selector = (value === '*') ? '<sid ne=""/>' : '<sid eq="' + value + '"/>'
        var selectExpr = '<' + items[i] + '>' + selector + '</' + items[i] + '>';
        translated.insert(selectExpr);
    }
    // */
    parseSelectionCriteriaX(translated, criteria);

    return {success: translated.get()};
}

function parseSelectionCriteria(translated, criteria) {
    var items = Object.keys(criteria);
    var op, value, selector, selectExpr;

    for (var i = 0; i < items.length; i++) {
        value = criteria[items[i]];
        switch (value) {
            case '*':
                selector = '<sid ne=""/>';
                break;
            case '$or':
                throw "$or nyi";
            default:
                selector = '<sid eq="' + value + '"/>';
                break;
        }
        selectExpr = '<' + items[i] + '>' + selector + '</' + items[i] + '>';
        translated.insert(selectExpr);
    }
}

//*

var ops = {$or: '<or>'};

function parseSelectionCriteriaX(translated, criteria) {
    var items = Object.keys(criteria);
    var op, value, selector, selectExpr;

    for (var i = 0; i < items.length; i++) {
        // is it an operator?
        if (ops[items[i]]) {
            op = items[i];
            if (op !== '$or') {
                throw 'only $or is implemented';
            }
            translated.insert('<or>');
            criteria[op].forEach(function(criteria) {
                parseSelectionCriteriaX(translated, criteria);
            })
            translated.insert('</or>');
        } else {
            value = criteria[items[i]];
            if (value === '*') {
                selector = '<sid ne=""/>';
            } else {
                selector = '<sid eq="' + value + '"/>';
            }
            selectExpr = '<' + items[i] + '>' + selector + '</' + items[i] + '>';
            translated.insert(selectExpr);
        }
    }
}
// */