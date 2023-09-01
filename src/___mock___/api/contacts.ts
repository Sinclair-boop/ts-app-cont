import { AxiosRequestConfig } from "axios";
import { contactList } from "../fakedb/contacts";
import mock from "../MockConfig";
import { Contact } from "../../models/Contact";

// ===>RECUPERER LA LISTE DES CONTACTS
mock.onGet("/contacts/list").reply((request: AxiosRequestConfig) => {
  return [200, { contacts: contactList }];
});

// ===>RECUPERER UN CONTACT
mock.onGet("/contact").reply((request: AxiosRequestConfig) => {
  const { id } = request.params;

  const contact = contactList.find((con) => con.id == id);

  if (contact) return [200, { daa: contact }];
  return [404, { message: "Le contact n'existe pas." }];
});

// ===>AJOUTER UN CONATACT
mock.onPost("/contact").reply((request: AxiosRequestConfig) => {
  let { contact } = JSON.parse(request.data);

  console.log(request.data);

  contact.id = Math.random();
  contactList.push(contact);

  return [200, { contacts: contactList }];
});

// ===>MODIFFIER UN CONTACT
mock.onPatch("/contact").reply((request: AxiosRequestConfig) => {
  // const { id, data: contacts } = JSON.parse(request.params);
  let { contact } = JSON.parse(request.data);
  let { idModif } = JSON.parse(request.data);
  console.log("===> NOUS SOMME DANS L'API POUR MODIFFIER <===");
  console.log("===> L'id des donnees dans l'API put", idModif);
  console.log("===> L'id des donnees dans l'API put", request.data);

  console.log("===> La donnee dans l'API put", contact);
  // console.log("===> La liste des donnees dans l'API put", contacts);
  const newContact = { ...contact, id: Math.floor(Math.random() * 100 + 15) };
  console.log("===> voiyons voir ca", newContact);
  const findContact = contactList.find(
    (contac: Contact) => contac.id == idModif
  );
  if (!findContact)
    return [
      404,
      { message: "le contact que vous souhaitez modifier n'existe pas" },
    ];
  const restContact = contactList.filter((con) => con.id != idModif);

  restContact.push(newContact);

  console.log("===> le jour des resultats", restContact);

  return [200, { data: restContact }];
});

// ===>SUPPRIMER UN CONTACT
mock.onDelete("/contactdel").reply((request: AxiosRequestConfig) => {
  const { id, data: currentContacts } = request.params;

  console.log("===> liste des contact supprimer", currentContacts);
  console.log("===> liste des contact supprimer", id);

  const findContact = contactList.find((con) => con.id == id);
  console.log("===> le contact selectioner", findContact);
  if (!findContact) return [404, { message: "le contact n'exiete pas" }];

  const restContact = currentContacts.filter((con: Contact) => con.id != id);
  console.log("===> nouvelle liste avec le contact supprimer", restContact);
  return [200, { data: restContact }];
});
