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

//method, url, args, headers, cookie, json
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
    if (exports.cookie && exports.cookie.length) {
        options.cookie = exports.cookie;
    } else if (options.cookie && options.cookie === true) {
        options.cookie = ".cookie";
    }
    if (options.qargs) {
        if (urls.query && urls.query.length) {
            options.url += "&" + qs.stringify(options.args);
        } else {
            options.url += "?" + qs.stringify(options.args);
        }
        urls = url_.parse(options.url);
    }
    if (options.args) {
        if (options.method === "GET") {
            if (urls.query && urls.query.length) {
                options.url += "&" + qs.stringify(options.args);
            } else {
                options.url += "?" + qs.stringify(options.args);
            }
        } else {
            options.body = qs.stringify(options.args);
        }
    }
    if (!options.margs) {
        options.margs = {};
    }
    if (!options.mfs) {
        options.mfs = {};
    }
    var ret = CurlR(options);
    if (ret.err && ret.err.length) {
        return ret;
    }
    var ret_h = {};
    var _sre = /HTTP\/[0-9].[0-9] ([0-9]{3})/;
    for (var hidx in ret.headers) {
        var line = ret.headers[hidx];
        var _m = line.match(_sre);
        if (_m) {
            ret.status = parseInt(_m[1], 10);
            continue;
        }
        var kvs = ret.headers[hidx].trim().split(":", 2);
        if (kvs.length > 1) {
            ret_h[kvs[0].trim()] = kvs[1].trim();
        }
    }
    ret.headers = ret_h;
    if (options.json) {
        ret.data = JSON.parse(ret.data);
    } else if (options.json === undefined) {
        try {
            ret.data = JSON.parse(ret.data);
        } catch (e) {}
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
exports.cookie = "";
exports.req = req;
exports.get = get;
exports.post = post;
exports.CurlR = CurlR;