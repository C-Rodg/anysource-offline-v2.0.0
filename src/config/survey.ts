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
        tag: "qrEmail",
        prompt: "Email",
        required: false
    },
    {
        type: "TEXT",
        tag: "qrCompany",
        prompt: "Company",
        required: false
    },
    {
        type: "TEXT",
        tag: "qrTitle",
        prompt: "Title",
        required: false
    },
    {
        type: "TEXT",
        tag: "qrPhone",
        prompt: "Phone",
        required: false
    },
    {
        type: "TEXT",
        tag: "qrAddress1",
        prompt: "Address 1",
        required: false
    },
    {
        type: "TEXT",
        tag: "qrAddress2",
        prompt: "Address 2",
        required: false
    },
    {
        type: "TEXT",
        tag: "qrCity",
        prompt: "City",
        required: false
    },
    {
        type: "TEXT",
        tag: "qrState",
        prompt: "State",
        required: false
    },
    {
        type: "TEXT",
        tag: "qrZip",
        prompt: "Zip Code",
        required: false
    },
    {
        type: "TEXT",
        tag: "qrCountry",
        prompt: "Country",
        required: false
    }, 
    {
        type: "PICKONE",
        tag: "qrFollowUp",
        prompt: "How should we follow-up? We have a ton of different options to meet your needs!",
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
        prompt: 'Which products and services are you interested in?',
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
            },
            {
                tag: 'qrProductInterest_4',
                prompt: 'Registration Data Management'
            },
            {
                tag: 'qrProductInterest_5',
                prompt: '2WAY Stick Building'
            },
            {
                tag: 'qrProductInterest_6',
                prompt: 'Other'
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

export { survey };