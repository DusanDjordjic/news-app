import { factory } from "../../factory/factory";
import { Observer } from "../../lib/observer";
import { IActivatedRoute } from "../../models/activatedRoute.interface";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";
import { OnDestroy } from "../../models/onDestroy.interface";
import { ActivatedRoute } from "../../activatedRoute/activatedRoute";

export class SinglePostComponent extends BaseComponent implements OnDestroy {
  private activedRoute: ActivatedRoute = ActivatedRoute.getInstance();

  private activatedRouteObserver: Observer<IActivatedRoute> = new Observer(
    (newActivatedRoute: IActivatedRoute) => {
      console.log("SINGLE POST", newActivatedRoute.params);
    }
  );

  constructor(parent: BaseComponent | null) {
    super(parent);

    this.activedRoute.subscribe(this.activatedRouteObserver);
    this.activedRoute.notifyOne(this.activatedRouteObserver);
  }

  onDestroy() {
    this.activedRoute.unsubscribe(this.activatedRouteObserver);
    console.warn("SinglePost destroyed");
  }
  getTree() {
    const tree: DomElement = {
      tag: "div",
      classes: ["container"],
      children: [
        {
          tag: "h1",
          textContent: "Single Post",
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
