
function InfoSpaceRequestSigner(token) {
    this.token = token;
}


InfoSpaceRequestSigner.prototype.signQueryTerm = function (queryTerm) {
    return this.getSignature(queryTerm);
}


InfoSpaceRequestSigner.prototype.getSignature = function (queryTerm) {
    var value = this.getFormattedDateString() + this.token + queryTerm;
    return this.hashValue(value);
}

/**
 * Gets the date/time to the nearest minute as YYYYMMDDHHMM
 *
 * @return string
 */
InfoSpaceRequestSigner.prototype.getFormattedDateString = function () {
    var pad = function (i) {
        return i < 10 ? '0' + i : '' + i;
    }
    var dt = this.getTimeToNearestMinute();
    var year = dt.getUTCFullYear();
    var month = pad(dt.getUTCMonth() + 1);
    var day = pad(dt.getUTCDate());
    var hour = pad(dt.getUTCHours());
    var minute = pad(dt.getUTCMinutes());
    var val = year + month + day + hour + minute;
    return val;
}

/**
 * Gets the date/time +30 seconds as a unix timestamp
 *
 * @return int
 */
InfoSpaceRequestSigner.prototype.getTimeToNearestMinute = function () {
    return new Date(new Date().getTime() + 30000);
}

/**
 * Gets a base64 encoded SHA1 hash
 *
 * @param string $input
 *
 * @return string
 */
InfoSpaceRequestSigner.prototype.hashValue = function (input) {
    bytes = this.hashSHA1(input);
    return this.encodeUrlSafeBase64(bytes);
}

/**
 * UTF8 encode
 *
 * @see http://kevin.vanzonneveld.net
 *   original by: Webtoolkit.info (http://www.webtoolkit.info/)
 *   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *   improved by: sowberry
 *    tweaked by: Jack
 *   bugfixed by: Onno Marsman
 *   improved by: Yves Sucaet
 *   bugfixed by: Onno Marsman
 *   bugfixed by: Ulrich
 *   bugfixed by: Rafal Kukawski
 *   improved by: kirilloid
 *   bugfixed by: kirilloid
 */
InfoSpaceRequestSigner.prototype.utf8_encode = function (argString) {
    if (argString === null || typeof argString === "undefined") {
        return "";
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if (c1 & 0xF800 != 0xD800) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if (c1 & 0xFC00 != 0xD800) {
                throw new RangeError("Unmatched trail surrogate at " + n);
            }
            var c2 = string.charCodeAt(++n);
            if (c2 & 0xFC00 != 0xDC00) {
                throw new RangeError("Unmatched lead surrogate at " + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
}

/**
 * Gets a SHA1 hash
 *
 * @param string $input
 *
 * @return string
 *
 * @see http://kevin.vanzonneveld.net
 *   original by: Webtoolkit.info (http://www.webtoolkit.info/)
 * namespaced by: Michael White (http://getsprink.com)
 *      input by: Brett Zamir (http://brett-zamir.me)
 *   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *    depends on: utf8_encode
 */
InfoSpaceRequestSigner.prototype.hashSHA1 = function (str) {
    var rotate_left = function (n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    var cvt_hex = function (val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    str = this.utf8_encode(str);
    var str_len = str.length;

    var word_array = [];
    for (i = 0; i < str_len - 3; i += 4) {
        j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (str_len % 4) {
    case 0:
        i = 0x080000000;
        break;
    case 1:
        i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
        break;
    case 2:
        i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
        break;
    case 3:
        i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
        break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) {
        word_array.push(0);
    }

    word_array.push(str_len >>> 29);
    word_array.push((str_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) {
            W[i] = word_array[blockstart + i];
        }
        for (i = 16; i <= 79; i++) {
            W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        }


        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }

    temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return temp.toLowerCase();
}

/**
 * Creates a URL safe base64 encoded string
 *
 * @param string $input
 *
 * @return string
 *
 * @see http://kevin.vanzonneveld.net
 *   original by: Tyler Akins (http://rumkin.com)
 *   improved by: Bayron Guevara
 *   improved by: Thunder.m
 *   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *   bugfixed by: Pellentesque Malesuada
 *   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
 *   improved by: Rafa? Kukawski (http://kukawski.pl)
 *   made url safe and changed to hex input by: Marc Gray (http://lamped.co.uk)
 */
InfoSpaceRequestSigner.prototype.encodeUrlSafeBase64 = function (data) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = "",
        tmp_arr = [];

    if (!data) {
        return data;
    }

    do { // pack three octets into four hexets
        o1 = parseInt(data.substr(i, 2), 16);
        i += 2;
        o2 = parseInt(data.substr(i, 2), 16);
        i += 2;
        o3 = parseInt(data.substr(i, 2), 16);
        i += 2;

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = (data.length / 2) % 3;

    return ((r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)).replace(/=/g, '');
}