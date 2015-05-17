#!/usr/bin/env node

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
request1 = {select: {parkingspace: {sid: '*'}}};
request2 = {select: {parkingspace: {sid: 'WorldSensing.5385fc250cf2497dfe5679d1'}}};
request3 = {select: {"parkingspace.opparams.zonetype": "NoParking"}};
request4 = {select: {
        parkingspace: {
            $or: [
                {sid: "WorldSensing.5385fc250cf2497dfe5679d1"},
                {sid: "WorldSensing.5385ff2f0cf2497dfe567c0c"}
            ]
        }
}};

// execute the requests. the tql connection supports multiple simultaneous
// requests.

[request1, request2, request3, request4].forEach(function(req) {
    var parkingSpaces = tqlConnection.request(req);
    console.log("Executed:", req);
    parkingSpaces.then(function(response) {
        console.log('Completed:', req);
        console.log("parking spaces found:", response.result.length);
        if (false || response.result.length === 1) {
            console.log(JSON.stringify(response.result));
        }
    }).catch(function(error) {
        console.log('Completed:', req);
        console.log('[Error class:', error.class + '] error:', error.text);
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