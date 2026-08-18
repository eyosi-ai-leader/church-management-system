import TextField from "./TextField";
import SelectField from "./SelectField";
import TextAreaField from "./TextAreaField";

const FieldRenderer = ({
  field,
  value,
  error,
  onChange,
}) => {
  const commonProps = {
    ...field,
    id: field.name,
    value,
    error,
    onChange,
  };

  switch (field.type) {
    case "select":
      return <SelectField {...commonProps} />;

    case "textarea":
      return <TextAreaField {...commonProps} />;

    case "email":
    case "tel":
    case "text":
    default:
      return <TextField {...commonProps} />;
  }
};

export default FieldRenderer;