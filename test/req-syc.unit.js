var rsync = require("../lib/req-sync.js");
var as = require("assert");
describe('util', function() {
	//
	// rsync.req("POST", "http://www.baidu.com/?a=1");
	var res;
	res = rsync.req({
		method: "GET",
		url: "http://localhost:84/t",
		args: {
			val: "xxxxd-01",
		},
		cookie: true,
		json: true
	});
	as.ok(res.err && res.err.length, "not error")
	console.log(res);
	res = rsync.req({
		method: "GET",
		url: "http://localhost:8334/t",
		args: {
			val: "xxxxd-01",
		},
		cookie: true,
		json: true
	});
	as.ok(!res.err, res.err);
	as.equal(res.data.data.val, "xxxxd-01");
	//
	res = rsync.req({
		method: "GET",
		url: "http://localhost:8334/t?xxx=ss",
		args: {
			val: "xxxxd-03",
		},
		headers: {},
		cookie: true,
		json: true
	});
	as.ok(!res.err, res.err);
	as.equal(res.data.data.val, "xxxxd-03");
	//
	res = rsync.req({
		method: "POST",
		url: "http://localhost:8334/t",
		args: {
			val: "xxxxd-02",
		},
		headers: {},
		cookie: true,
		json: true
	});
	as.ok(!res.err, res.err);
	as.equal(res.data.data.val, "xxxxd-02");
	//
	rsync.req({
		url: "http://localhost:8334/set?val=abc",
		cookie: true,
		headers: [
			"Content-Type:bbb"
		],
	});
	res = rsync.req({
		url: "http://localhost:8334/get",
		json: true,
		cookie: true,
	});
	as.ok(!res.err, res.err);
	as.equal(res.data.data, "abc");
	//
	res = rsync.req({
		method: "POST",
		url: "http://localhost:8334/u",
		cookie: true,
		margs: {
			"aa": "bb",
		},
		mfs: {
			"file": "test/run.js",
		},
		headers: [
			"aaa:bbb"
		],
	});
	as.ok(!res.err, res.err);
	as.equal(res.data.data, "OK");
	//
	res = rsync.req({
		method: "POST",
		url: "http://localhost:8334/b",
		cookie: true,
		body: '{"val":"OK"}',
	});
	as.ok(!res.err, res.err);
	as.equal(res.data.val, "OK");
	//
	rsync.req({
		url: "http://localhost:8334/get",
		json: false,
	});
	rsync.cookie = ".ckk";
	console.log(rsync.req({
		url: "http://localhost:8334/get",
		json: false,
	}));
	rsync.post("http://www");
	rsync.post("http:/");
	rsync.post("http://www/?");
	rsync.post("http://www/?a=1");
	rsync.get("http://www");
	rsync.get("http:/");
	rsync.get("http://www/?");
	rsync.get("http://www/?a=1");
});