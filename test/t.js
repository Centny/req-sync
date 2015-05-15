var rsync = require("../lib/req-sync.js");
var as = require("assert");

// console.log("id-" + process.argv[2]);
rsync.cookie = process.argv[2] + ".cookie"
var res = rsync.req({
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
console.log("done...");