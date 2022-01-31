import { BaseComponent } from "../models/base-component.model";
import { DomElement } from "../models/dom-element.interface";
import { Router } from "../router";

export class FooterComponent extends BaseComponent {
  private router: Router = Router.getInstance();
  constructor(parent: BaseComponent | null) {
    super(parent);
  }
  getTree() {
    const domTree: DomElement = {
      tag: "footer",
      children: [
        {
          tag: "small",
          classes: ["text-center"],
          textContent: "Copyright 2022. Dusan Djordjic",
        },
      ],
    };
    return domTree;
  }
  render() {
    console.log("HEADER COMPONENT CANNOT BE RENDERED");
  }
}
