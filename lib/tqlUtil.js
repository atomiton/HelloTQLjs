
//
// return a shallow clone of an object
//
exports.clone = function(obj) {
    var nObj = {};
    var keys = Object.keys(obj);
    var i = keys.length;
    while (--i >= 0) {
        nObj[keys[i]] = obj[keys[i]];
    }
    return nObj
}

//
// update original with matching keys from overrides
//
exports.override = function(original, overrides) {
  // Don't do anything if add isn't an object
  if (!overrides || typeof overrides !== 'object') {
      return original;
  }

  var keys = Object.keys(overrides);
  var i = keys.length;
  while (--i >= 0) {
      original[keys[i]] = overrides[keys[i]];
  }
  return original;
};

//
// create errors that give a type as well as message
//
exports.TqlError = function(type, text) {
    this.type = type;
    this.text = text;
}
