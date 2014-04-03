var Pastee = require('pastee');

var paste = new Pastee(); // Add a single string param to set the api key

// Submit a normal paste
paste.paste('paste contents', function(err, res) {
	// res is a json object with "id", "link", "raw", "download" (and "key" for encrypted)
});

// Retrieve a normal paste
paste.retrieve('paste id', function(err, res) {
	if (err) { // Invalid paste (404)
		return;
	}
	
	// res now contains the paste contents
});

// Submit an encrypted paste
var key = paste.paste({ paste : 'paste contents', encrypt : true }, function(err, res) {
	// res is the same as above, but with "key", and "link" has the key appended to it (paste also returns key)
});

// Retrieve an encrypted paste
paste.retrieve('paste id', key, function(err, res) {
	if (err) { // Invalid paste (404)
		return;
	}
	
	// res now contains the decrypted contents
});
