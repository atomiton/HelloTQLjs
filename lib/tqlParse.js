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
module.exports.parse = function(transaction) {
    var type = Object.keys(transaction);
    if (type.length !== 1) {
        return {error: {class: "tql", text: "error in transaction - invalid type"}};
    }
    type = type[0];

    if (type !== 'select') {
        return {error: {class: "tql", text: "error in transaction - invalid type"}};
    }

    // start select-specific logic
    var translated = new tqlSelect();
    var criteria = transaction[type];

    var items = Object.keys(criteria);
    for (var i = 0; i < items.length; i++) {
        var value = criteria[items[i]];
        var selector = (value === '*') ? '<sid ne=""/>' : '<sid eq="' + value + '"/>'
        var selectExpr = '<' + items[i] + '>' + selector + '</' + items[i] + '>';
        translated.insert(selectExpr);
    }

    return {success: translated.get()};
}


