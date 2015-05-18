parse = require('../lib/tqlParse');
tqlUtil = require('../lib/tqlUtil');

error = new tqlUtil.TqlError('system', 'text of error');

console.log("Instanceof?", error instanceof tqlUtil.TqlError ? "yes" : "no");

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
    "space.total": 62
    }
}};
request7 = {select: {parkingspace: {$or: [
    {label: "Parking lot 2"},
    {"state.total": 184}
    ]
}}};



requests = [
    request1, request2, request3, request4, request5, request6, request7
];

requests.forEach(function(req) {
    var translation = parse.parse(req);

    if (!translation.success) {
        console.log(translation.error);
        return
    }

    console.log(translation.success);
})
