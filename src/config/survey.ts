const survey = [
    {
        type: "TEXT",
        tag: "qrFirstName",
        prompt: "First Name",
        required: true
    },
    {
        type: "TEXT",
        tag: "qrLastName",
        prompt: "Last Name",
        required: true
    },
    {
        type: "TEXT",
        tag: "qrCompany",
        prompt: "Company",
        required: false
    },
    {
        type: "PICKONE",
        tag: "qrFollowUp",
        prompt: "How should we follow-up?",
        required: false,
        options: [
            {
                tag: "qrFollowUp_1",
                prompt: "Meeting"
            }, {
                tag: "qrFollowUp_2",
                prompt: "Salesperson call"
            }, {
                tag: "qrFollowUp_3",
                prompt: "Product Demo"
            }, {
                tag: "qrFollowUp_4",
                prompt: "No follow-up"
            }
        ]
    },
    {
        type: "CHECKBOX",
        tag: 'qrInfoRequest',
        prompt: 'Information requested?',
        required: false,
        options: [{
            tag: 'qrInfoRequest_Yes',
            prompt: ''
        }]
    },
    {
        type: 'PICKMANY',
        tag: 'qrProductInterest',
        prompt: 'Product Interest',
        required: false,
        options: [
            {
                tag: 'qrProductInterest_1',
                prompt: 'Check-in application'
            },
            {
                tag: 'qrProductInterest_2',
                prompt: 'Session Scanning'
            },
            {
                tag: 'qrProductInterest_3',
                prompt: 'Lead Capture'
            }
        ]
    },
    {
        type: 'TEXTAREA',
        tag: 'qrNotes',
        prompt: 'Notes',
        required: false
    }
];

export default { survey };