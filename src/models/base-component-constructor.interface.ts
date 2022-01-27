import { BaseComponent } from "./base-component.model";

export interface IBaseComponentConstructor {
  new (parent: BaseComponent | null): any;
}
