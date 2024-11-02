export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'admin' | 'accountant' | 'employee';
}
