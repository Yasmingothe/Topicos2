export interface ErroApi {
  status: number;
  message: string;
  errors: { field: string; message: string }[];
}