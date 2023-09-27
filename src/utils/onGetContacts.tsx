import axios, { AxiosResponse } from "axios";
import { Contact } from "../models/Contact";

const onGetContacts = async () => {
  try {
    const { data } = await axios.get("/contacts/list");
    return data.contacts;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export { onGetContacts };
