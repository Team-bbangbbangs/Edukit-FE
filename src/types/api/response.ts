export type Response<T> = {
  status: number;
  code: string;
  message: string;
  data?: T;
};
