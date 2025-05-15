interface LoginFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
};

export interface LoginFormElement extends HTMLFormElement {
  readonly elements: LoginFormElements;
};

interface SignUpFormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  name: HTMLInputElement;
  password: HTMLInputElement;
  repeatPassword: HTMLInputElement;
};

export interface SignUpFormElement extends HTMLFormElement {
  readonly elements: SignUpFormElements;
};

type LoginRequestBody = {
  email: string;
  password: string;
};

type SignUpRequestBody = {
  email: string;
  name: string;
  password: string;
};

export type AuthRequestBody = LoginRequestBody | SignUpRequestBody;

export type AuthResponse = {
  success: boolean;
};

export type RequestMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

type ResponseStatus = {
  code: number;
  message: string;
};

export type ResponseBody<TData> = {
  status: ResponseStatus;
  data?: TData;
};