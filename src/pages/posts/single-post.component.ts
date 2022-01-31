import { factory } from "../../factory/factory";
import { Observer } from "../../lib/observer";
import { IActivatedRoute } from "../../models/activatedRoute.interface";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";
import { OnDestroy } from "../../models/onDestroy.interface";
import { ActivatedRoute } from "../../activatedRoute/activatedRoute";
import { NewsService } from "../../providers/news.service";
import { NewModel } from "../../models/new.model";
import { Router } from "../../router";

export class SinglePostComponent extends BaseComponent implements OnDestroy {
  private activedRoute: ActivatedRoute = ActivatedRoute.getInstance();
  private newsService: NewsService = NewsService.getInstance();
  private singleNew: NewModel = new NewModel();
  private router: Router = Router.getInstance();
  private activatedRouteObserver: Observer<IActivatedRoute> = new Observer(
    (newActivatedRoute: IActivatedRoute) => {
      console.log("SINGLE POST", newActivatedRoute.params);
      this.getOneNew(newActivatedRoute.params.id);
    }
  );
  getOneNew(id: string) {
    this.newsService.getOneNew(id).then((data) => {
      this.singleNew = data as NewModel;
      this.reRender();
    });
  }
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
          tag: "header",
          classes: ["sub-header"],
          children: [
            {
              tag: "a",
              events: [
                {
                  eventName: "click",
                  callback: (e) => {
                    e.preventDefault();
                    this.router.navigate("/");
                  },
                },
              ],
              textContent: "Back",
              classes: ["btn"],
            },
          ],
        },
        {
          tag: "div",
          classes: ["new-wrapper"],
          children: [
            {
              tag: "h1",
              textContent: this.singleNew.title,
            },
            {
              tag: "p",
              textContent: this.singleNew.content,
            },
          ],
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
