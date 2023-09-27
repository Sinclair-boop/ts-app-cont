import { useState, useEffect } from "react";
import { Formik, Form, Field, useFormik } from "formik";
import { LeFormulaire } from "./LeFormulaire";
import { Contact } from "../models/Contact";
import { onGetContacts } from "../utils/onGetContacts";
import { GridRowId } from "@mui/x-data-grid";
// import { SignupSchema } from "../utils/validationSchema";
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
import DataTable from "./DataTable";
import axios from "axios";
import { contactList } from "../___mock___/fakedb/contacts";

import * as yup from "yup";
import { object, date } from "yup";
import dayjs from "dayjs";

// const minPublishDate = dayjs().add(2, "day").format("YYYY-MM-DD");
// const maxPublishDate = dayjs().add(2, "day").format("YYYY-MM-DD");
// const laListeDescontacts = onGetContacts();

const minPublishDate = dayjs().add(2, "day").format("YYYY-MM-DD");
const maxPublishDate = dayjs().add(2, "day").format("YYYY-MM-DD");

export const ContactsApp = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modif, setModif] = useState<boolean>(false);
  const [idModif, setIdModif] = useState<GridRowId>(1);
  const [fatherSelect, setFatherSelect] = useState<Contact | null>(null);
  const [motherSelect, setMotherSelect] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(contactList);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await onGetContacts();

        console.log("===> La response est", data);
        setContacts(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
  }, []);

  const SignupSchema = yup.object().shape({
    firstName: yup
      .string()
      .min(2, "Trop Court!")
      .max(50, "Trop Long!")
      .required("Requis")
      .test("est unique ", "ce nom est deja utilisé", function (value) {
        let verif: boolean = contacts.every(
          (contact) => contact.firstName !== value
        );
        return verif;
      }),
    lastName: yup
      .string()
      .min(2, "Trop Court!")
      .max(50, "Trop Long!")
      .required("Requis"),
    email: yup
      .string()
      .email("L'email est Invalid!")
      .required("Requis")
      .test(
        "L'email Est Enique ",
        "Cet Email Est Deja Utilisé!",
        function (value) {
          let verif: boolean = contacts.every(
            (contact) => contact.email !== value
          );
          return verif;
        }
      ),
    minPublishDate: date()
      .min(
        minPublishDate,
        "La date minimale doit être dans 2 jours à compter d'aujourd'hui"
      )
      .required("Requis"),
    gender: yup.string().required("Sélectionnez une option"),

    father: yup
      .string()
      .min(2, "Trop Court!")
      .max(50, "Trop Long!")
      .required("Requis"),
    mother: yup
      .string()
      .min(2, "Trop Court!")
      .max(50, "Trop Long!")
      .required("Requis"),
  });

  const handlerSaveContact = (contact: Contact) => {
    console.log(
      "Les informations du pere ou celle de la mere sont la ou non 2 :",
      contact
    );
    if (modif) {
      // METTRE A JOUR UN CONTACT
      const onPatchContact = async (idModif: GridRowId) => {
        try {
          const response = await axios.patch("/contact", {
            idModif,
            contacts,
            newContact: contact,
          });
          if (response && response.data) {
            setContacts(response.data.data);
          }
        } catch (error) {}
      };

      onPatchContact(idModif);
      setOpenModal(false);
    } else {
      const onSaveContact = (data: Contact): any => {
        console.log(
          "Les informations du pere ou celle de la mere sont la ou non ",
          data
        );
        // ===> L'AJOUT D'UN CONTACT
        axios
          .post("/contact", { contact: data, contacts: contacts })
          .then((data) => {
            const { contacts } = data.data;
            setContacts(contacts);

            console.log("la response post", contacts);
            console.log("la val est", contacts);
            // LOGIQUE POUR AVOIR LE NOMBRE D'ENFANTS
            const newContacts: any = contacts.map((item: Contact) => {
              if (contact.father?.id === item.id) {
                return { ...item, nbr: item.nbr! + 1 };
              } else if (contact.mother?.id === item.id) {
                return { ...item, nbr: item.nbr! + 1 };
              } else {
                return item;
              }
            });
            setContacts(newContacts);
            console.log("====> La valeur du contact id est de:", contact?.id);

            console.log("contenu de contacts apres setcontacts", contacts);
            setOpenModal(false);
            console.log("la val 2 est", contacts);
          })
          .then((error) => {
            console.log(error);
          });
      };
      onSaveContact(contact);
    }
  };

  const handleClickOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <div>
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
              Application de contacts
            </Typography>
          </Grid>
          <Grid item md={3}>
            <Button variant="contained" onClick={handleClickOpen}>
              Créer un contact
            </Button>{" "}
          </Grid>
          <Grid md={12} sx={{ mt: 5 }}>
            <DataTable
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

      <Dialog open={openModal} onClose={handleClose}>
        <Formik
          validateOnBlur={false}
          validateOnMount={false}
          initialValues={{
            id: contacts[contacts.length - 1].id! + 1,
            firstName: "",
            lastName: "",
            email: "",
            minPublishDate: new Date(),
            father: null,
            mother: null,
            nbr: 0,
            gender: "female",
          }}
          validationSchema={SignupSchema}
          validateOnChange={true}
          onSubmit={(values) => {
            // same shape as initial values
            const saveContact: Contact = {
              id: values.id,
              date: values.minPublishDate,
              email: values.email,
              father: fatherSelect,
              firstName: values.firstName,
              lastName: values.lastName,
              mother: motherSelect,
              nbr: values.nbr,
              gender: values.gender,
            };
            handlerSaveContact(saveContact);
            handleClose();
            console.log(saveContact);
          }}
        >
          {({ errors, touched, setFieldValue, values, getFieldProps }) => (
            <LeFormulaire
              values={values}
              setFieldValue={setFieldValue}
              contacts={contacts}
              setContacts={setContacts}
              errors={errors}
              touched={touched}
              modif={modif}
              setModif={setModif}
              openModal={openModal}
              setOpenModal={setOpenModal}
              fatherSelect={fatherSelect}
              motherSelect={motherSelect}
              setFatherSelect={setFatherSelect}
              setMotherSelect={setMotherSelect}
              getFieldProps={getFieldProps}
            />
          )}
        </Formik>
      </Dialog>
    </div>
  );
};
