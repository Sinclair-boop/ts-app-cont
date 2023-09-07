import { FieldHookConfig, useField } from "formik";
import { FormControlLabel, Radio } from "@mui/material";
import * as yup from "yup";

export function RadioButtonGroup(props: any) {
  const [field] = useField({
    name: props.name,
    type: "radio",
    value: props.value,
  });
  return (
    <FormControlLabel
      control={<Radio {...props} {...field} />}
      label={props.label}
    />
  );
}
