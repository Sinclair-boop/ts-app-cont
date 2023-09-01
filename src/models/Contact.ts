export type Contact = {
  id?: number;
  lastName: string;
  firstName: string;
  date: Date | null;
  dateDeces?: Date;
  // isNew?: boolean;
  email: string;
  father: Contact | null;
  mother: Contact | null;
};

export interface IFormInput {
  _id?: string;
  firstName: string;
  lastName: string;
  date: Date;
  email: string;
  father: string;
  mother: string;
}
