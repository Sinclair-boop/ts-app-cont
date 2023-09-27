export type Contact = {
  id?: number;
  lastName: string;
  firstName: string;
  date: Date | null;
  dateDeces?: Date;
  email: string;
  father: Contact | null;
  mother: Contact | null;
  nbr?: number;
  gender: string;
};
