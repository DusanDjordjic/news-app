import { IBaseComponentConstructor } from "./base-component-constructor.interface";

export interface IRoute {
  id: number;
  path: string;
  component: IBaseComponentConstructor;
}
