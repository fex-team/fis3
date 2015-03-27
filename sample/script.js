function each(obj, iterator) {
    if (Array.isArray(obj)) {
        obj.forEach(iterator);
    } else {
        var keys = Object.keys(obj);
        keys.forEach(function(key) {
            iterator(obj[key], key);
        });
    }
}

exports.each = each;
