import { SingleCategory } from "../../components/single-category.component";
import { factory } from "../../factory/factory";
import { Observer } from "../../lib/observer";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";
import { INewsQueryParams } from "../../models/news-query-params.interface";
import { OnDestroy } from "../../models/onDestroy.interface";
import { NewsService } from "../../providers/news.service";
import { Router } from "../../router";

export class AllCategoriesComponent extends BaseComponent implements OnDestroy {
  private newsService: NewsService = NewsService.getInstance();
  private allCategories: string[] = [];
  private router: Router = Router.getInstance();
  private usedComponents: { singleCategories: SingleCategory[] } = {
    singleCategories: [],
  };
  private onNewsParamsChange: Observer<INewsQueryParams> = new Observer(
    (value: INewsQueryParams) => {
      this.usedComponents.singleCategories = [];
      this.getCategories();
    }
  );
  constructor(parent: BaseComponent) {
    super(parent);
    this.newsService.subscribe(this.onNewsParamsChange);
    this.getCategories();
  }
  getCategories() {
    this.newsService
      .getAllCategories()
      .then((data) => {
        console.log(data);
        this.allCategories = data as string[];
        this.reRender();
        this.saveCategoryComponents();
      })
      .catch((err) => console.log(err));
  }
  saveCategoryComponents() {
    this.allCategories.forEach((cat) => {
      this.usedComponents.singleCategories.push(
        new SingleCategory(this, { category: cat })
      );
    });
  }
  getTree() {
    const tree: DomElement = {
      tag: "div",
      classes: ["container"],
      children: [
        {
          tag: "header",
          classes: ["sub-header", "child-spacing"],
          children: this.allCategories.map((cat) => {
            const element: DomElement = {
              tag: "span",
              classes: ["btn"],
              textContent: cat,
              events: [
                {
                  eventName: "click",
                  callback: (e) => {
                    e.preventDefault();
                    this.router.navigate("/categories", cat);
                  },
                },
              ],
            };
            return element;
          }),
        },
        {
          tag: "section",
          classes: ["categories-wrapper"],
          children: this.usedComponents.singleCategories.map((comp) => {
            return comp.getTree();
          }),
        },
      ],
    };
    return tree;
  }
  render(): HTMLElement {
    const domElement = factory(this.getTree());
    return domElement;
  }
  onDestroy() {
    this.newsService.unsubscribe(this.onNewsParamsChange);
  }
}
