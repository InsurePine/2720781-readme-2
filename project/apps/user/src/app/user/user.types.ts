export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser extends LoginUser {
  firstName: string;
  lastName: string;
}
