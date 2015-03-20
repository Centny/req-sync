// var caseless = require('caseless');
var url_ = require("url");
var qs = require("querystring");

var _cl = null;
try {
    _cl = require('../build/Release/curlr.node');
} catch (error) {
    _cl = require('../build/default/curlr.node');
}

var CurlR = _cl.CurlR;

//method, url, args, headers, cookie, isjson
function req(options) {
    var urls = url_.parse(options.url);
    if (options.method) {
        options.method = options.method.toUpperCase();

    } else {
        options.method = "GET";
    }
    if (!options.headers) {
        options.headers = {};
    }
    if (options.cookie && options.cookie === true) {
        options.cookie = ".cookie";
    }
    if (options.args) {
        if (options.method === "GET") {
            if (urls.query && urls.query.length) {
                options.url += "&" + qs.stringify(options.args);
            } else {
                options.url += "?" + qs.stringify(options.args);
            }
            options.args = {};
        }
    } else {
        options.args = {};
    }
    var ret = CurlR(options);
    var ret_h = {};
    for (var hidx in ret.headers) {
        var kvs = ret.headers[hidx].trim().split(":", 2);
        if (kvs.length > 1) {
            ret_h[kvs[0].trim()] = kvs[1].trim();
        }
    }
    ret.headers = ret_h;
    if (options.json) {
        ret.data = JSON.parse(ret.data);
    }
    return ret;
}

function get(url, json) {
    return req({
        method: "GET",
        url: url,
        json: json
    });
}

function post(url, args, json) {
    return req({
        method: "POST",
        url: url,
        args: args,
        json: json
    });
}
// exports.ParseOptions = ParseOptions;
// exports.request = HTTPSync;
exports.req = req;
exports.get = get;
exports.post = post;
exports.CurlR = CurlR;