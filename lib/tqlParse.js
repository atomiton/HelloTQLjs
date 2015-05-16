
function fake() {
    return "<query>" +
                "<find>" +
                    "<parkingspace>" +
                        "<sid ne=''/>" +
                    "</parkingspace>" +
                "</find>" +
            "</query>"
}

function tQuery() {
    this.query = new Array('<query>', '</query>');
    this.insertPoint = 1;
}

tQuery.prototype.insertPair = function(pair) {
    var p1 = '<' + pair + '>';
    var p2 = '</' + pair + '>';
    Array.prototype.splice.apply(this.query, [this.insertPoint, 0, p1, p2]);
    this.insertPoint += 1;
}

tQuery.prototype.insertSingleton = function(item) {
    Array.prototype.splice.apply(this.query, [this.insertPoint, 0, item]);
    this.insertPoint += 2;
}

tQuery.prototype.get = function() {
    return this.query.join('');
}

module.exports.parse = function(transaction) {
    var translated = new tQuery();
    var type = Object.keys(transaction);
    if (type.length !== 1) {
        return {error: {class: "tql", text: "error in transaction - invalid type"}};
    }
    type = type[0];

    if (type !== 'select') {
        return {error: {class: "tql", text: "error in transaction - invalid type"}};
    }
    var tail = transaction[type];

    translated.insertPair('find');

    // TODO: this code doesn't work if there is more than one selector type
    // TODO: this code doesn't work if there are multiple singletons
    var items = Object.keys(tail);
    for (var i = 0; i < items.length; i++) {
        translated.insertPair(items[i]);
        translated.insertSingleton("<sid ne=''/>");

    }
    return translated.get();
}

//  {
//  select: {
//      parkingSpace: '*'
//  }
//}