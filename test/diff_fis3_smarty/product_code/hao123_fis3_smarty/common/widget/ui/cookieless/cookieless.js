/**
 * all data store in one key(GSTORE), and the value split by "; ".
 *        The value is like: "a=b,expire=1403767282089; c=d,expire=1403767282089"
 *        
 * not support session store(session storage seems to a little ugly), use cookie instead
 * 
 * Internet Explorer 10 in Windows 8 access the localStorage is denied. Leave it alone!
 *
 *
 * 
 * Create a local Data with the given key and value and other optional parameters.
 *
 * @example $.store('the_store', 'the_value', { expires: 7});
 * @desc Create a store with all available options.
 * 
 * @example $.store('the_store', null);
 * @desc Delete a store by passing null as value
 *
 * @example $.store('the_store');
 * @desc get a store value 
 */


window.jQuery || (window.jQuery = {});

;;(function ($, WIN, NAME) {
	var STORENAME = "GSTORE", // the key
	    STORE  = "localStorage",
        encode = encodeURIComponent,
        decode = decodeURIComponent;

    /**
     * get value
     * @param  {String} key  the key
     * @return {Null}        null
     */
    function getItem(key) {
    	var data = WIN[STORE].getItem(STORENAME),
    	    result = new RegExp('(?:^|; )' + encode(key) + '=([^,;]*),expire=([0-9]*)').exec(data);

    	if(result && +result[2] >= +new Date) {
    		return decode(result[1]);
    	} else {
    		deleteItem(key);
    		return null;
    	}
    }

    /**
     * get position of data has the key in array
     * @param  {Array}     arr where data group
     * @param  {String}    key key The key of the store
     * @return {Number}    key's position, without is -1
     */
    function posItem(arr, key) {
    	var reg  = new RegExp('^' + encode(key) + '=[^,;]*,expire='),
    	    pos  = -1, i = 0, j = arr.length;

		for (; i < j; i++) {
			if (reg.exec(arr[i])) {
				pos = i;
				break;
			}
		}
		return pos;
    }

    /**
     * [cleanDirty description]
     * @param  {[type]} arr [description]
     * @return {[type]}     [description]
     */
    function cleanDirty(arr) {
    	var tmp = [];
    	for(var i = 0, j = arr.length; i < j; i++) {
    		arr[i] && tmp.push(arr[i]);
    	}
    	return tmp;
    }
    /**
     * store data
     * @param {[type]} key    [description]
     * @param {[type]} value  [description]
     * @param {[type]} expire [description]
     */
    function setItem(key, value, expire) {
		var data = cleanDirty((WIN[STORE].getItem(STORENAME) || "").split("; ")),
    	    pos  = posItem(data, key),
    	    j    = data.length;


		if (isNumber(expire)) {
            var days = expire;
            expire = new Date();
            expire.setDate(expire.getDate() + days);
        }

		if (Object.prototype.toString.call(expire) === '[object Date]') {
			data[(pos > -1) ? pos : j] = encode(key) + "=" + encode(value) + ",expire=" + expire.getTime();
			WIN[STORE].setItem(STORENAME, data.join("; "));
		}
    }

    /**
     * delete the store data in localStorage with the key
     * @param  {String}   key The key of the store
     * @return {null}     null
     */
    function deleteItem(key) {
    	var data = cleanDirty((WIN[STORE].getItem(STORENAME) || "").split("; ")),
    	    pos  = posItem(data, key);

    	if(pos > -1) {
    		data.splice(pos, 1);
    	}

    	data = data.join("; ");
    	data && WIN[STORE].setItem(STORENAME, data);
    }

    function isNumber(o) {
    	return typeof o === 'number';
    }
	/**
	 * @param String key The key of the store
	 * @param String value The value of the store
	 * @param Object options An object containing key/value pairs to provide expires attributes
	 *   @option Number|Date expires Either an integer specifying the expiration date from now on
	 *           in days or a Date object
	 *   If a negative value is specified (e.g. a date in the past), the store will be deleted
	 *                            
	 */
	$[NAME] = function (key, value, options) {
		try {
			WIN[STORE]; // win8 IE10. http://www.baidufe.com/item/0b74532d151f6dc9308e.html
		} catch(e) {
			return false;
		}
		
		if (arguments.length > 1) {
			if (value === null || (options && isNumber(options.expires) && options.expires <= 0)) {
				deleteItem(key);
			} else {
				options && setItem(key, String(value), options.expires);
			}
		} else {
			return getItem(key);
		}

	};
})(jQuery, window, "store");