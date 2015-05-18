#!/usr/bin/env node

TQL = require('./lib/tql');
chalk = require('chalk');


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
request5 = {select: {parkingspace: {
    label: "Parking lot 2",
    demarcated: "true"
    }
}};
request6 = {select: {parkingspace: {
    label: "Parking lot 2",
    "state.total": 62
    }
}};

requests = [
    request1, request2, request3, request4, request5, request6,
];

//
// change the following function to show the desired results from each select.
//
function show(ps) {
    //console.log(JSON.stringify(ps, null, 4));
    console.log(ps.parkingspace.label, 'total spaces:', ps.parkingspace.state.total);
}


//
// execute the requests. the tql connection supports multiple simultaneous
// requests.
//
requests.forEach(function(req) {
    // get a promise back from the request.
    var parkingSpaces = tqlConnection.request(req);
    console.log("Executed:", JSON.stringify(req));

    // when each request is done handle the result
    parkingSpaces.then(function(response) {
        console.log(chalk.green('Success:', JSON.stringify(req)));
        console.log("parking spaces found:", response.result.length);
        // change the following test to view more or fewer results
        for (var i = 0; i < 10 && i < response.result.length; i++) {
            show(response.result[i]);
        }
        /*
        if (true && response.result.length <= 10) {
            console.log('total spots:', reponse.result.)
        }
        // */
    }).catch(function(error) {
        console.log(chalk.red('Failure:', JSON.stringify(req)));
        if (error instanceof Error) {
            console.log(chalk.red(error));
        } else {
            console.log(chalk.red('[Error type:', error.type + '] error:', error.text));
        }
    })
});

