import {
  Autocomplete,
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Pagination,
  paginationClasses,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
} from "@mui/material";
// import { Formik, useFormik } from "formik";
import {
  Formik,
  Form,
  Field,
  FormikErrors,
  FormikTouched,
  useFormik,
} from "formik";
import { AppTextField } from "./AppTextField";
import { Contact } from "../models/Contact";
import { RadioButtonGroup } from "./AppTextField/RadioButtonGroupe";
interface LeFormulaireProps {
  getFieldProps: any;
  fatherSelect: Contact | null;
  motherSelect: Contact | null;
  setFatherSelect: React.Dispatch<React.SetStateAction<Contact | null>>;
  setMotherSelect: React.Dispatch<React.SetStateAction<Contact | null>>;
  values: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    minPublishDate: Date;
    father: null;
    mother: null;
    nbr: number;
    gender: string;
  };
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void | FormikErrors<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    minPublishDate: Date;
    father: null;
    mother: null;
    nbr: number;
    gender: string;
  }>>;
  errors: FormikErrors<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    minPublishDate: Date;
    father: null;
    mother: null;
    nbr: number;
    gender: string;
  }>;
  touched: FormikTouched<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    minPublishDate: Date;
    father: null;
    mother: null;
    nbr: number;
    gender: string;
  }>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  modif: boolean;
  setModif: React.Dispatch<React.SetStateAction<boolean>>;
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}
export const LeFormulaire: React.FC<LeFormulaireProps> = ({
  modif,
  setModif,
  openModal,
  setOpenModal,
  errors,
  touched,
  contacts,
  setContacts,
  setFieldValue,
  values,
  fatherSelect,
  setFatherSelect,
  motherSelect,
  setMotherSelect,
  getFieldProps,
}) => {
  console.log(fatherSelect);
  return (
    <>
      <Form autoComplete="off">
        <DialogTitle>Nouveau contact</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <AppTextField
                fullWidth
                autoFocus
                label="Nom"
                variant="filled"
                type="text"
                name="firstName"
                margin="dense"
              />
            </Grid>

            <Grid item md={6}>
              <AppTextField
                fullWidth
                autoFocus
                label="Prenom"
                name="lastName"
                variant="filled"
                type="text"
                margin="dense"
              />
            </Grid>
            <Grid item md={6}>
              <AppTextField
                fullWidth
                autoFocus
                name="email"
                label="Email"
                type="email"
                variant="filled"
                margin="dense"
              />
            </Grid>

            <Grid item md={6}>
              <AppTextField
                fullWidth
                autoFocus
                margin="dense"
                name="minPublishDate"
                type="date"
                variant="filled"
                autoComplete="off"
              />
            </Grid>
            <Grid item md={12}>
              <FormControl component="fieldset">
                <FormLabel id="demo-row-radio-buttons-group-label">
                  gender
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="gender"
                  {...getFieldProps("gender")}
                  error={touched.gender && Boolean(errors.gender)}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Feminin"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Masculin"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item md={6}>
              <Autocomplete
                id="father"
                options={contacts.filter(
                  (contact) => contact.gender === "male"
                )}
                getOptionLabel={(option) => option.firstName}
                value={fatherSelect}
                onChange={(e, value) => {
                  console.log(value);
                  setFatherSelect(value);
                  setFieldValue("father", value ? value.firstName : "");
                }}
                renderInput={(params) => (
                  <AppTextField
                    {...params}
                    error={Boolean(touched.father && errors.father)}
                    helperText={touched.father && errors.father}
                    fullWidth
                    margin="dense"
                    label="Nom du pere"
                    name="father"
                    autoFocus
                    variant="filled"
                    type="text"
                  />
                )}
              />
            </Grid>

            <Grid item md={6}>
              <Autocomplete
                id="mother"
                // name="father"
                options={contacts.filter(
                  (contact) => contact.gender === "female"
                )}
                getOptionLabel={(option) => option.firstName}
                value={motherSelect}
                onChange={(e, value) => {
                  console.log(value);
                  setMotherSelect(value);
                  setFieldValue("mother", value ? value.firstName : "");
                }}
                renderInput={(params) => (
                  <AppTextField
                    {...params}
                    error={Boolean(touched.mother && errors.mother)}
                    helperText={touched.mother && errors.mother}
                    margin="dense"
                    label="Nom de la mere"
                    name="mother"
                    variant="filled"
                    autoFocus
                    fullWidth
                    type="text"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModal(false);
            }}
            variant="outlined"
          >
            Annuler
          </Button>

          <Button variant="contained" type="submit">
            {modif ? "Modifier" : "Enregistrer"}
          </Button>
        </DialogActions>
      </Form>
    </>
  );
};
