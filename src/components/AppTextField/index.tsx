import { TextField } from "@mui/material";
import { TextFieldProps } from "@mui/material/TextField/TextField";
import { FieldHookConfig, useField } from "formik";

export const AppTextField = (
  props: TextFieldProps & FieldHookConfig<string>
) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  return (
    <TextField
      {...props}
      {...field}
      helperText={errorText}
      error={!!errorText}
    />
  );
};
