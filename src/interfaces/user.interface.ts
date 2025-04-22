export interface User {
  id?: string; // doc id as user id
  uid?: string; // user id
  displayName?: string;
  search?: string; // display name lowercase for search
  email?: string;
  photoURL?: string;
  [key: string]: unknown;
}
