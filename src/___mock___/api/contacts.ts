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
  let { contact, contacts } = JSON.parse(request.data);
  console.log(
    "===> les information du contact courant recuperer via le formulair",
    contact
  );

  console.log(request.data);
  contacts.push(contact);
  console.log("===> la list des contacts avec mise a jour", contactList);

  return [200, { contacts: contacts }];
});

// ===>MODIFFIER UN CONTACT
mock.onPatch("/contact").reply((request: AxiosRequestConfig) => {
  let { contacts } = JSON.parse(request.data);
  let { idModif } = JSON.parse(request.data);
  let { newContact } = JSON.parse(request.data);
  console.log("===> La donnee dans l'API put", contacts);
  const findContact = contacts.find((contac: Contact) => contac.id == idModif);
  if (!findContact)
    return [
      404,
      { message: "le contact que vous souhaitez modifier n'existe pas" },
    ];
  const updateContacts = contacts.filter((con: Contact) => con.id != idModif);
  updateContacts.push(newContact);
  console.log("===> le jour des resultats", updateContacts);
  return [200, { data: updateContacts }];
});

// ===>SUPPRIMER UN CONTACT
mock.onDelete("/contactdel").reply((request: AxiosRequestConfig) => {
  const { id, data: currentContacts } = request.params;
  const findContact = currentContacts.find((con: Contact) => con.id == id);
  console.log("===> le contact selectioner", findContact);

  if (!findContact) return [404, { message: "le contact n'exiete pas" }];
  const restContact = currentContacts.filter((con: Contact) => con.id != id);
  console.log("===> nouvelle liste avec le contact supprimer", restContact);
  return [200, { data: restContact }];
});
