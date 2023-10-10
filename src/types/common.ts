export interface IMeta{
    limit: number;
    page: number;
    total:number
}

export type ResponseSuccessType = {
    data: any;
    meta?:IMeta
}

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};
export interface ICategory {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface IProduct {
  id:           String; 
  name :        String;
  price:        number;
  flavor:       String;
  productImage: String;
  discount :    number;
  size :        String;
  createdAt:  String;
  updatedAt:  String;
  categoryId: String
  __v: number;
}