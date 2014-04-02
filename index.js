var request = require('request'),
	CryptoJS = require('crypto-js');

function Pastee(key) {
	this.key = key || 'public';
}

Pastee.prototype.paste = function(data, callback) {
	if (typeof data == "string") {
		data = { paste : data };
	}
	var req = {
		key : this.key,
		format : 'json',
		description : data.description || '',
		language : data.language || 'plain',
		paste : data.paste
	};
	
	var ret = true;
	
	if (data.encrypt) {
		ret = this.encryptKey();
		req.paste = this.encrypt(req.paste, ret);
		req.encrypted = 1;
	}
	
	if (data.expire) {
		if (typeof data.expire == 'Date') {
			req.expire = this.getTimeSeconds() - this.getTimeSeconds(data.expire);
		} else {
			req.expire = data.expire;
		}
	}
	
	request.post('http://paste.ee/api', { form : req }, function(err, res, body) {
		var json = JSON.parse(body);
		
		if (json.status == 'success') {
			if (req.encrypted) {
				json.paste.key = ret;
				json.paste.link = json.paste.link + '#' + ret;
			}
			callback(false, json.paste);
		} else {
			callback(json.error, false);
		}
	});
	
	return ret;
};

Pastee.prototype.retrieve = function(paste, callback, key) {
	if (typeof callback == 'string') {
		// key
		var tmp = key;
		key = callback;
		callback = tmp;
	}
	
	var context = this;
	
	request.get('http://paste.ee/r/' + paste, function(err, res, body) {
		if (!err && res.statusCode == 200) {
			if (key) {
				body = context.decrypt(body, key);
			}
			
			callback(false, body);
		} else {
			callback('Error: HTTP Response ' + res.statusCode, false);
		}
	});
};

Pastee.prototype.encryptKey = function(string_length) {
	string_length = string_length || 32;
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
};

Pastee.prototype.encrypt = function(data, key) {
	return CryptoJS.AES.encrypt(data, key).toString();
};

Pastee.prototype.decrypt = function(data, key) {
	return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
};

Pastee.prototype.getTimeSeconds = function(date) {
	date = date || new Date();
	
	return date.getTime() / 1000;
};

Pastee.prototype.submit = Pastee.prototype.paste

module.exports = Pastee;
