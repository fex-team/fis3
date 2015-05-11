var IS_WIN = process.platform.indexOf('win') === 0;
var colors = [
        "000000",
        "800000",
        "008000",
        "808000",
        "000080",
        "800080",
        "008080",
        "c0c0c0",
        "808080",
        "ff0000",
        "00ff00",
        "ffff00",
        "0000ff",
        "ff00ff",
        "00ffff",
        "ffffff",
        "000000",
        "00005f",
        "000087",
        "0000af",
        "0000d7",
        "0000ff",
        "005f00",
        "005f5f",
        "005f87",
        "005faf",
        "005fd7",
        "005fff",
        "008700",
        "00875f",
        "008787",
        "0087af",
        "0087d7",
        "0087ff",
        "00af00",
        "00af5f",
        "00af87",
        "00afaf",
        "00afd7",
        "00afff",
        "00d700",
        "00d75f",
        "00d787",
        "00d7af",
        "00d7d7",
        "00d7ff",
        "00ff00",
        "00ff5f",
        "00ff87",
        "00ffaf",
        "00ffd7",
        "00ffff",
        "5f0000",
        "5f005f",
        "5f0087",
        "5f00af",
        "5f00d7",
        "5f00ff",
        "5f5f00",
        "5f5f5f",
        "5f5f87",
        "5f5faf",
        "5f5fd7",
        "5f5fff",
        "5f8700",
        "5f875f",
        "5f8787",
        "5f87af",
        "5f87d7",
        "5f87ff",
        "5faf00",
        "5faf5f",
        "5faf87",
        "5fafaf",
        "5fafd7",
        "5fafff",
        "5fd700",
        "5fd75f",
        "5fd787",
        "5fd7af",
        "5fd7d7",
        "5fd7ff",
        "5fff00",
        "5fff5f",
        "5fff87",
        "5fffaf",
        "5fffd7",
        "5fffff",
        "870000",
        "87005f",
        "870087",
        "8700af",
        "8700d7",
        "8700ff",
        "875f00",
        "875f5f",
        "875f87",
        "875faf",
        "875fd7",
        "875fff",
        "878700",
        "87875f",
        "878787",
        "8787af",
        "8787d7",
        "8787ff",
        "87af00",
        "87af5f",
        "87af87",
        "87afaf",
        "87afd7",
        "87afff",
        "87d700",
        "87d75f",
        "87d787",
        "87d7af",
        "87d7d7",
        "87d7ff",
        "87ff00",
        "87ff5f",
        "87ff87",
        "87ffaf",
        "87ffd7",
        "87ffff",
        "af0000",
        "af005f",
        "af0087",
        "af00af",
        "af00d7",
        "af00ff",
        "af5f00",
        "af5f5f",
        "af5f87",
        "af5faf",
        "af5fd7",
        "af5fff",
        "af8700",
        "af875f",
        "af8787",
        "af87af",
        "af87d7",
        "af87ff",
        "afaf00",
        "afaf5f",
        "afaf87",
        "afafaf",
        "afafd7",
        "afafff",
        "afd700",
        "afd75f",
        "afd787",
        "afd7af",
        "afd7d7",
        "afd7ff",
        "afff00",
        "afff5f",
        "afff87",
        "afffaf",
        "afffd7",
        "afffff",
        "d70000",
        "d7005f",
        "d70087",
        "d700af",
        "d700d7",
        "d700ff",
        "d75f00",
        "d75f5f",
        "d75f87",
        "d75faf",
        "d75fd7",
        "d75fff",
        "d78700",
        "d7875f",
        "d78787",
        "d787af",
        "d787d7",
        "d787ff",
        "d7af00",
        "d7af5f",
        "d7af87",
        "d7afaf",
        "d7afd7",
        "d7afff",
        "d7d700",
        "d7d75f",
        "d7d787",
        "d7d7af",
        "d7d7d7",
        "d7d7ff",
        "d7ff00",
        "d7ff5f",
        "d7ff87",
        "d7ffaf",
        "d7ffd7",
        "d7ffff",
        "ff0000",
        "ff005f",
        "ff0087",
        "ff00af",
        "ff00d7",
        "ff00ff",
        "ff5f00",
        "ff5f5f",
        "ff5f87",
        "ff5faf",
        "ff5fd7",
        "ff5fff",
        "ff8700",
        "ff875f",
        "ff8787",
        "ff87af",
        "ff87d7",
        "ff87ff",
        "ffaf00",
        "ffaf5f",
        "ffaf87",
        "ffafaf",
        "ffafd7",
        "ffafff",
        "ffd700",
        "ffd75f",
        "ffd787",
        "ffd7af",
        "ffd7d7",
        "ffd7ff",
        "ffff00",
        "ffff5f",
        "ffff87",
        "ffffaf",
        "ffffd7",
        "ffffff",
        "080808",
        "121212",
        "1c1c1c",
        "262626",
        "303030",
        "3a3a3a",
        "444444",
        "4e4e4e",
        "585858",
        "606060",
        "666666",
        "767676",
        "808080",
        "8a8a8a",
        "949494",
        "9e9e9e",
        "a8a8a8",
        "b2b2b2",
        "bcbcbc",
        "c6c6c6",
        "d0d0d0",
        "dadada",
        "e4e4e4",
        "eeeeee"
    ]
    .map(function(hex) {
        var r = parseInt(hex.slice(0, 2), 16);
        var g = parseInt(hex.slice(2, 4), 16);
        var b = parseInt(hex.slice(4, 6), 16);
        return [r, g, b];
    });

var x256 = function(r, g, b) {
    var c = Array.isArray(r) ? r : [r, g, b];
    var best = null;

    for (var i = 0; i < colors.length; i++) {
        var d = distance(colors[i], c)
        if (!best || d <= best.distance) {
            best = {
                distance: d,
                index: i
            };
        }
    }

    return best.index;
};
x256.colors = colors;

function distance(a, b) {
    return Math.sqrt(
        Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2)
    )
}

String.prototype.segment = function(length, offset) {
    "use strict";
    var output = [];
    // Make sure offset < length, then move the pointer to that position
    var position = offset % length - length;
    for (; position < this.length;) output.push(this.slice(Math.max(0, position), position += length));
    return output;
}

function lolcat(string) {
    if (IS_WIN) {
      return string;
    }

    var segmentLength = 11;
    var spread = 3;
    var freq = 0.1;
    var seed = Math.random() * 20;
    // Make tabs display as spaces
    var output = string.replace(/\t/g, "        ").split("\n");
    var color, string;
    for (var line = 0; line < output.length; line++) {
        output[line] = output[line].segment(segmentLength, line * spread + 2);
        for (var segment = 0; segment < output[line].length; segment++) {
            string = output[line][segment];
            color = rainbow(freq, (segment - line - seed) * spread);
            output[line][segment] = color + 'm' + string;
        }
        output[line] = output[line].join("");
    }
    return output.join("\n");
}

// Ported directly from lol.rb:rainbow
function rainbow(freq, i) {
    var red = Math.round(Math.sin(freq * i + 0) * 127 + 128);
    var green = Math.round(Math.sin(freq * i + 2 * Math.PI / 3) * 127 + 128);
    var blue = Math.round(Math.sin(freq * i + 4 * Math.PI / 3) * 127 + 128);
    var ix = x256(red, green, blue);
    return '\x1b[38;5;' + ix;
}

module.exports = lolcat;