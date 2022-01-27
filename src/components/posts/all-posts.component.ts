import { factory } from "../../factory/factory";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";
import { OnDestroy } from "../../models/onDestroy.interface";

export class AllPostsComponent extends BaseComponent {
  constructor(parent: BaseComponent | null) {
    super(parent);
  }

  render(): HTMLElement {
    const tree: DomElement = {
      tag: "p",
      textContent: "ALL POSTS COMPONENT",
    };
    const domElement = factory(tree);

    return domElement;
  }
}
