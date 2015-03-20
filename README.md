# req-sync

req-sync is Node.js extension that provides syncronous http request.

# Installing

You must have libcurl installed in order to compile this extension.

Ubuntu: `sudo apt-get install libcurl4-openssl-dev`

CentOS/redhat: `sudo yum install libcurl libcurl-devel`

Mac:`brew install libcurl`

# Using

```
var rsync = require('req-sync');

//full options.
var ret=rsync.req({
	method: "POST",
	url: "http://xxxx.com/api/",
	args: {
		arg1: "",
	},// or using custom body
	headers: {}, 
	timeout:30000,
	timeout_c:30000,
	cookie: true,//using cookie
	json: true //parse return as json.
});
console.log(ret);
//post/get
rsync.post("http://www.com/api",{},true);
rsync.get("http://www.com/api",true);
```

# Function
* `req(options)` see `Options`
* `get(url,[json])` send get request.
* `post(url,[args],[json])` send post request.


# Options
* `method`: POST/GET.
* `url`: target URL address.
* `args`: the request arguments.
* `headers`: the http headers.
* `timeout`: the http timeout.
* `timeout_c`: the connection timeout.
* `cookie`: if setting true, it will using the `.cookie` as cookie file name. or setting cookie file paht like `/tmp/a.cookie`.
* `json`:whether parse return string as json to javascript object.
* `body`: the request body,if it is not empty,the `args` will be ignore when using POST method.


# Return
* `err`: the error message,when error occur.
* `length`: the reponse content length.
* `headers`: the response headers.
* `data`: the reponse data.
* `status`: the http status code.

## Other
* enable global cookie:`require('req-sync').cookie=".cookie"`
