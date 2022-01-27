import { CategoryType } from "../types/category.type";

export interface INewsQueryParams {
  country: "us" | "gb";
  category?: CategoryType;
  page?: number;
  pageSize?: number;
  q?: string;
  sources?: string;
  [key: string]: any;
}
