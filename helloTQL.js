TQL = require('./util/tql');


console.log('Welcome to Hello TQL, JavaScript.');
console.log('Getting all parking spaces.');

//
// establish a TQL connection context
//
tqlConnection = new TQL.Connection('http://cisco.atomiton.com:8080/fid-CIMTQLInterface-JVH2ZQ7YAAAH6AABAE2I4NJR');

//
// get all the parking spaces from that context
//
parkingSpaces = tqlConnection.request.select({
	resources: {parkingSpace: '*'}
});

if (parkingSpaces.error) {
	console.log('Error:', parkingSpaces.error.code, parkingSpaces.error.text);
} else {
	console.log(parkingSpaces.selection);
}

update = tqlConnection.request.update({});
if (update.error) {
	console.log('Error:', update.error.code, update.error.text);
}