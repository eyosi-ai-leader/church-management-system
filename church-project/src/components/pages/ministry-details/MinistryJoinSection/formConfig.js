export const ministryApplicationFields = [
  {
    name: "firstName",
    label: "First Name",
    type: "text",
    required: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    type: "text",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    required: true,
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: [
      {
        label: "Male",
        value: "Male",
      },
      {
        label: "Female",
        value: "Female",
      },
    ],
  },
  {
    name: "occupation",
    label: "Occupation",
    type: "text",
    required: true,
  },
  {
    name: "member",
    label: "Church Member",
    type: "select",
    required: true,
    options: [
      {
        label: "Yes",
        value: "true",
      },
      {
        label: "No",
        value: "false",
      },
    ],
  },
  {
    name: "attendanceDuration",
    label: "How long have you attended?",
    type: "text",
    placeholder: "Example: 2 years",
    required: true,
  },
  {
    name: "experience",
    label: "Previous Ministry Experience",
    type: "textarea",
    rows: 4,
    required: false,
  },
  {
    name: "availability",
    label: "Availability",
    type: "text",
    placeholder: "Weekends, Wednesdays, Evenings",
    required: true,
  },
  {
    name: "motivation",
    label: "Why do you want to join this ministry?",
    type: "textarea",
    rows: 6,
    required: true,
  },
];