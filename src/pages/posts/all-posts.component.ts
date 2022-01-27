import { factory } from "../../factory/factory";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";
import { INewsQueryParams } from "../../models/news-query-params.interface";

export class AllPostsComponent extends BaseComponent {
  constructor(parent: BaseComponent | null) {
    super(parent);
  }

  queryParamsChanged(newParams: INewsQueryParams) {
    console.log(newParams);
  }
  getTree() {
    const tree: DomElement = {
      tag: "div",
      classes: ["container"],
      children: [
        {
          tag: "h1",
          textContent: "All Posts",
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
