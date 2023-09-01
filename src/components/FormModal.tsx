import React, { useEffect, useState } from "react";
import "../___mock___";
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
} from "@mui/material";
import { Contact, IFormInput } from "../models/Contact";
import axios from "axios";
import { GridRowId, GridViewColumnIcon } from "@mui/x-data-grid";
import FullFeaturedCrudGrid from "./DataTable";
import { SubmitHandler, useForm } from "react-hook-form";

const FormModal = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [modif, setModif] = useState<boolean>(false);
  const [idModif, setIdModif] = useState<GridRowId>(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formState, setFormState] = useState<Contact>({
    date: new Date(),
    email: "",
    father: null,
    firstName: "",
    lastName: "",
    mother: null,
  });

  const [defaultValues, setDefaultValues] = useState<IFormInput>({
    firstName: "Djomkam",
    lastName: "Maurice Bill",
    email: "djomkam@gmail.com",
    date: new Date(),
    father: "Tagne",
    mother: "Magne",
  });

  //===> METHOD// method qui verifie que le nom est unique
  const isFirstNameUnique = (firstName: string) =>
    contacts.every((contact) => contact.firstName !== firstName);

  //===> HOOK REACT-FORM-HOOK// initialisation du hook react-form-hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ defaultValues });

  const ongetContacts = async () => {
    try {
      const { data } = await axios.get("/contacts/list");
      console.log("response", data);
      setContacts(data.contacts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    ongetContacts();
  }, []);

  // ===> METHOD// method onSubmit pour l'ajout et la mise a jour d'un contact

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const { date, email, father, firstName, lastName, mother } = data;
    if (modif) {
      // METTRE A JOUR UN CONTACT
      let contact = data;
      const onPatchContact = async (idModif: GridRowId) => {
        try {
          const response = await axios.patch("/contact", { idModif, contact });
          if (response && response.data) {
            setContacts(response.data.data);
          }
        } catch (error) {}
      };
      onPatchContact(idModif);
      handlerClose();
    } else {
      // ===> L'AJOUT D'UN CONTACT
      axios
        .post("/contact", { contact: data })
        .then((data) => {
          const { contacts } = data.data;
          setContacts(contacts);
          setOpenModal(false);
        })
        .then((error) => console.log(error));

      handlerClose();
    }
  };

  console.log("pourquoi ca n'affiche pas??", contacts);

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlerClose = () => {
    setOpenModal(false);
  };

  return (
    <React.Fragment>
      <Container>
        <Grid
          container
          spacing={3}
          sx={{
            py: 5,
          }}
        >
          <Grid item md={9}>
            <Typography variant="h5" fontWeight="bold">
              Application de contact
            </Typography>
          </Grid>
          <Grid item md={3}>
            <Button
              variant="contained"
              sx={{ width: "100%" }}
              onClick={() => {
                setOpenModal(true);
                setModif(false);
              }}
            >
              Créer un contact
            </Button>
          </Grid>

          <Grid md={12} sx={{ mt: 5 }}>
            <FullFeaturedCrudGrid
              contacts={contacts}
              setContacts={setContacts}
              openModal={openModal}
              setOpenModal={setOpenModal}
              modif={modif}
              setModif={setModif}
              idModif={idModif}
              setIdModif={setIdModif}
            />
          </Grid>
        </Grid>
      </Container>

      <Dialog open={openModal} onClose={() => handlerClose()} fullWidth>
        <DialogTitle>Nouveau contact</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <TextField
                autoFocus
                margin="dense"
                id="firstName"
                // name="firstName"
                label="Nom"
                type="text"
                fullWidth
                // variant="outlined"
                variant="standard"
                {...register("firstName", {
                  required: {
                    value: true,
                    message: "Le nom est obligatoire",
                  },
                  minLength: {
                    value: 3,
                    message: "Votre nom doit avoir minimum 3 caractères",
                  },
                  validate: {
                    uniqueFirstName: (value) =>
                      isFirstNameUnique(value) || "Le nom doit étre unique",
                  },
                })}
                // onChange={(e) => handlerChange(e)}
              />
              {errors.firstName && (
                <span className="error-message">
                  {errors.firstName.message}
                </span>
              )}
            </Grid>
            <Grid item md={6}>
              <TextField
                autoFocus
                margin="dense"
                id="lastName"
                // name="lastName"
                label="Prénom"
                type="text"
                fullWidth
                variant="standard"
                {...register("lastName", {
                  required: {
                    value: true,
                    message: "Le Prenom est obligatoire",
                  },
                  minLength: {
                    value: 3,
                    message: "Votre Prenom doit avoir minimum 3 caractères",
                  },
                })}
                onChange={(e) => handlerChange(e)}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName.message}</span>
              )}
            </Grid>

            <Grid item md={6}>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                // name="email"
                label="Email"
                type="email"
                fullWidth
                // variant="outlined"
                variant="standard"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email obligatoire",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "email invalide",
                  },
                })}
                onChange={(e) => handlerChange(e)}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </Grid>

            <Grid item md={6}>
              <TextField
                autoFocus
                margin="dense"
                id="date"
                // label="Date de naissane"
                type="date"
                // name="date"
                fullWidth
                // variant="outlined"
                variant="standard"
                {...register("date", { required: true })}
                onChange={(e) => handlerChange(e)}
              />
              {errors.date && (
                <span className="error-message">
                  La date de naissance est obligatoire
                </span>
              )}
            </Grid>

            <Grid item md={6}>
              <Autocomplete
                options={[
                  "Tagne",
                  "Tibo",
                  "Phillip",
                  "Djoufack",
                  "Celestin",
                  "Didie",
                ]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoFocus
                    margin="dense"
                    id="father"
                    label="Nom du père"
                    type="text"
                    fullWidth
                    variant="standard"
                    key={params.id}
                    {...register("father", { required: true, min: 2 })}
                  />
                )}
              />
              {errors.father && (
                <span className="error-message">
                  S'il vous plait, veuillez renseigne le nom de votre père
                </span>
              )}
            </Grid>

            <Grid item md={6}>
              <Autocomplete
                options={[
                  "Tagne",
                  "Tibo",
                  "Phillip",
                  "Djoufack",
                  "Celestin",
                  "Didie",
                ]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoFocus
                    margin="dense"
                    id="mother"
                    label="Nom de la mere"
                    type="text"
                    key={params.id}
                    fullWidth
                    variant="standard"
                    {...register("mother", { required: true, min: 2 })}
                  />
                )}
              />
              {errors.mother && (
                <span className="error-message">
                  S'il vous plait, veuillez renseigne le nom de votre mère
                </span>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handlerClose();
            }}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained">
            {modif ? "Modifier" : "Enregistrer"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default FormModal;
