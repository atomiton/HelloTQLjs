TQL = require('./lib/tql');


console.log('Welcome to Hello TQL, JavaScript.');
console.log('Get parking spaces.');

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
request1 = {select: {parkingspace: '*'}};
request2 = {select: {parkingspace: 'WorldSensing.5385fc250cf2497dfe5679d1'}};
request3 = {select: {$or: [
    {parkingspace: "WorldSensing.5385fc250cf2497dfe5679d1"},
    {parkingspace: "WorldSensing.5385ff2f0cf2497dfe567c0c"}
    ]}
};

[request1, request2].forEach(function(req) {
    var parkingSpaces = tqlConnection.request(req);
    parkingSpaces.then(function(response) {
        console.log("Executed:", req);
        console.log("parking spaces found:", response.result.length);
    }).catch(function(error) {
        console.log('Error class:', error.class, ', error:', error.text);
    })
});

/*

parkingSpaces = tqlConnection.request(request2);

parkingSpaces.then(function(response) {
    console.log('SELECT:', response.status);
    var result = JSON.stringify(response.result, null, 4);
    console.log(result);
}).catch(function(error) {
    console.log('Error class:', error.class, ', error:', error.text);
})
// */

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