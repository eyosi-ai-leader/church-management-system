export const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  occupation: "",
  member: "",
  attendanceDuration: "",
  experience: "",
  availability: "",
  motivation: "",
  agreement: false,
};

export const validateApplication = (values) => {
  const errors = {};

  if (!values.firstName.trim()) {
    errors.firstName = "First name is required.";
  }

  if (!values.lastName.trim()) {
    errors.lastName = "Last name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required.";
  }

  if (!values.gender) {
    errors.gender = "Please select your gender.";
  }

  if (!values.occupation.trim()) {
    errors.occupation = "Occupation is required.";
  }

  if (!values.member) {
    errors.member = "Please choose an option.";
  }

  if (!values.attendanceDuration.trim()) {
    errors.attendanceDuration =
      "Attendance duration is required.";
  }

  if (!values.availability.trim()) {
    errors.availability = "Availability is required.";
  }

  if (!values.motivation.trim()) {
    errors.motivation = "Please tell us why you want to join.";
  }

  if (!values.agreement) {
    errors.agreement =
      "You must agree before submitting.";
  }

  return errors;
};