# Pastee -- A simple Paste.ee API

## Node.js (Install)

Requirements:
* Node.js
* npm (Node.js package manager)

```bash
npm install pastee
```

## Super simple to use

Pastee is designed to be easy to submit and retrieve pastes.

```javascript
var Pastee = require('pastee');

var paste = new Pastee('api key or not set for public');

// Submit a normal paste
paste.submit('paste contents', function(err, res) {
	// res is a json object with "id", "link", "raw", "download" (and "key" for encrypted)
});

// Retrieve a normal paste
paste.retrieve('paste id', function(err, res) {
	if (err) { // Invalid paste (404)
		return;
	}
	
	// res now contains the paste contents
});
```

## Extra options

The following fields can be passed into an object for the first argument of paste.submit

* paste
* description
* language (syntax highlighting, see the page source of paste.ee for valid options - list coming soon!)
* encrypt (encrypts the paste and returns the randomly generated key)
* expire (expiration time in seconds, or a Date object of when it should expire)