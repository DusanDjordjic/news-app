import { factory } from "../../factory/factory";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";

export class SearchComponent extends BaseComponent {
  getTree() {
    const tree: DomElement = {
      tag: "div",
      classes: ["container"],
      children: [
        {
          tag: "h1",
          textContent: "Search",
        },
      ],
    };
    return tree;
  }
  render(): HTMLElement {
    const self = this;

    const domElement = factory(this.getTree());

    return domElement;
  }
}
