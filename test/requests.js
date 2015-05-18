//
// Requests to test the conversion to TQL-form XML
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
    "space.total": 62
    }
}};
request7 = {select: {parkingspace: {$or: [
    {label: "Parking lot 2"},
    {"state.total": 184}
    ]
}}};



exports.requests = [
    request1, request2, request3, request4, request5, request6, request7
];


