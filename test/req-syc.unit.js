var rsync = require("../lib/req-sync.js");
describe('util', function() {
	//
	// rsync.req("POST", "http://www.baidu.com/?a=1");
	rsync.req({
		method: "GET",
		url: "http://localhost:8334/set",
		args: {
			val: "xxxxd-01",
		},
		headers: {},
		cookie: true,
		json: true
	});
	rsync.req({
		method: "POST",
		url: "http://localhost:8334/set",
		args: {
			val: "xxxxd-02",
		},
		headers: {},
		cookie: true,
		json: true
	});
	rsync.req({
		method: "GET",
		url: "http://localhost:8334/set?xxx=ss",
		args: {
			val: "xxxxd-03",
		},
		headers: {},
		cookie: true,
		json: true
	});
	console.log(rsync.req({
		method: "GET",
		url: "http://localhost:8334/get",
		cookie: true,
		json: true
	}));
	console.log(rsync.req({
		url: "http://localhost:8334/get",
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