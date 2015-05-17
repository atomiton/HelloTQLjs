parse = require('../lib/tqlParse');

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

/*
request1 = {select: {parkingspace: '*'}};
request2 = {select: {parkingspace: 'WorldSensing.5385fc250cf2497dfe5679d1'}};
request3 = {select: {"parkingspace.opparams.zonetype": "NoParking"}};
request4 = {select: {
        $or: [
            {parkingspace: "WorldSensing.5385fc250cf2497dfe5679d1"},
            {parkingspace: "WorldSensing.5385ff2f0cf2497dfe567c0c"}
        ]
}};
// */

requests = [
    request1, request2, request3, request4
];

requests.forEach(function(req) {
    var translation = parse.parse(req);

    if (!translation.success) {
        console.log(translation.error);
        return
    }

    console.log(translation.success);
})
