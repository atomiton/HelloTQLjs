
exports.clone = function(obj) {
    var nObj = {};
    var keys = Object.keys(obj);
    var i = keys.length;
    while (--i >= 0) {
        nObj[keys[i]] = obj[keys[i]];
    }
    return nObj
}

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
