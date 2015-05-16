TQL = require('./lib/tql');


console.log('Welcome to Hello TQL, JavaScript.');
console.log('Getting all parking spaces.');

//
// establish a TQL connection context
//
tqlConnection = new TQL.Connection(
	{url: 'http://cisco.atomiton.com:8080/fid-CIMTQLInterface-JVH2ZQ7YAAAH6AABAE2I4NJR'}
);

//
// get all the parking spaces from that context.
// TODO resources OR just parkingSpace
// TODO server must echo submitted case or we must lowercase everything.
//
/*
parkingSpaces = tqlConnection.request.select({
	resources: {parkingSpace: '*'}
});
// */
parkingSpaces = tqlConnection.select({
	resources: {parkingSpace: '*'}
});

parkingSpaces.then(function(response) {
	console.log('SELECT:', response.status);
	console.log(JSON.stringify(response.result, null, 4));
}).catch(function(error) {
	console.log('Error class:', error.class, ', error:', error.text);
})

//
// this used the synchronous version of the function so parkingSpaces returns
// the results of the request.
//
/*
if (parkingSpaces.error) {
	console.log('Error:', parkingSpaces.error.code, parkingSpaces.error.text);
} else {
	console.log(parkingSpaces.url);
	console.log(parkingSpaces.selection);
}
// */