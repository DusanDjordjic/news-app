export interface DomElement {
  tag: string;
  textContent?: string;
  classes?: string[];
  events?: { eventName: string; callback: (e: Event) => void }[];
  attributes?: { attName: string; attValue: string }[];
  children?: DomElement[];
}
