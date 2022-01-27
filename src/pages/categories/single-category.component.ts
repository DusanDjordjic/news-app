import { FooterComponent } from "../../components/footer.component";
import { HeaderComponent } from "../../components/header.component";
import { factory } from "../../factory/factory";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";

export class SingleCategoryComponent extends BaseComponent {
  render(): HTMLElement {
    const self = this;

    const tree: DomElement = {
      tag: "div",
      children: [
        new HeaderComponent(self).getTree(),
        {
          tag: "div",
          classes: ["container"],
          children: [
            {
              tag: "h1",
              textContent: "Single Category",
            },
          ],
        },
        new FooterComponent(self).getTree(),
      ],
    };
    const domElement = factory(tree);

    return domElement;
  }
}
