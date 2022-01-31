import { factory } from "../../factory/factory";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";
import { NewsService } from "../../providers/news.service";

export class SingleCategoryComponent extends BaseComponent {
  private newsService: NewsService = NewsService.getInstance();
  constructor(parent: BaseComponent) {
    super(parent);
  }
  getNews() {}
  getTree() {
    const tree: DomElement = {
      tag: "div",
      classes: ["container"],
      children: [
        {
          tag: "h1",
          textContent: "Single Category",
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
