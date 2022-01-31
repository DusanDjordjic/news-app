import { CategoryType } from "../types/category.type";

export interface INewsQueryParams {
  country?: "srb" | "cro";
  category?: CategoryType;
  page?: number;
  pageSize?: number;
  q?: string;
  skip?: string;
  [key: string]: any;
}
