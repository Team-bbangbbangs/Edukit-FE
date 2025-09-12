export interface ApiResponseWithData<T> {
  code: string;
  message: string;
  data: T;
}

export interface ApiResponseWithoutData {
  code: string;
  message: string;
}
