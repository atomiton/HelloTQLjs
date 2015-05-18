#!/usr/bin/env node

TQL = require('./lib/tql');


console.log('\n\nWelcome to Hello TQL, JavaScript.');
console.log('Get parking spaces.');

//
// establish a TQL connection context
//
tqlConnection = new TQL.Connection(
    {url: 'http://cisco.atomiton.com:8080/fid-CIMTQLInterface-JVH2ZQ7YAAAH6AABAE2I4NJR'}
);

//
// get all the parking spaces from that context.
//
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

//
// execute the requests. the tql connection supports multiple simultaneous
// requests.
//
[request1, request2, request3, request4].forEach(function(req) {
    // get a promise back from the request.
    var parkingSpaces = tqlConnection.request(req);
    console.log("Executed:", JSON.stringify(req));

    // when the request is done handle the result
    parkingSpaces.then(function(response) {
        console.log('Success:', JSON.stringify(req));
        console.log("parking spaces found:", response.result.length);
        // change the following test to view more or fewer results
        if (true && response.result.length === 1) {
            console.log(JSON.stringify(response.result, null, 4));
        }
    }).catch(function(error) {
        console.log('Failure:', JSON.stringify(req));
        if (error instanceof Error) {
            console.log(error);
        } else {
            console.log('[Error type:', error.type + '] error:', error.text);            
        }
    })
});

