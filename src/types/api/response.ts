export interface ApiResponseWithData<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface ApiResponseWithoutData {
  status: number;
  code: string;
  message: string;
}
