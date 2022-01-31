import { ActivatedRoute } from "../../activatedRoute/activatedRoute";
import { factory } from "../../factory/factory";
import { Observer } from "../../lib/observer";
import { IActivatedRoute } from "../../models/activatedRoute.interface";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";
import { NewModel } from "../../models/new.model";
import { OnDestroy } from "../../models/onDestroy.interface";
import { NewsService } from "../../providers/news.service";
import { Router } from "../../router";

export class SingleCategoryComponent
  extends BaseComponent
  implements OnDestroy
{
  private newsService: NewsService = NewsService.getInstance();
  private category: string = "";
  private news: NewModel[] = [];
  private router: Router = Router.getInstance();
  private activatedRoute: ActivatedRoute = ActivatedRoute.getInstance();
  private activatedRouteObserver: Observer<IActivatedRoute> =
    new Observer<IActivatedRoute>((value: IActivatedRoute) => {
      this.category = value.params.category;
      this.getNews();
    });
  constructor(parent: BaseComponent) {
    super(parent);
    this.activatedRoute.subscribe(this.activatedRouteObserver);
    this.activatedRoute.notifyOne(this.activatedRouteObserver);
  }
  onDestroy() {
    this.newsService.unsubscribe(this.activatedRouteObserver);
  }
  getNews() {
    this.newsService
      .getCategoryNews(this.category)
      .then((data) => {
        this.news = (data as { maxLength: number; news: NewModel[] }).news;
        this.reRender();
      })
      .catch((err) => console.log(err));
  }

  getTree() {
    const tree: DomElement = {
      tag: "div",
      classes: ["container"],
      children: [
        {
          tag: "h1",
          textContent:
            this.category[0].toUpperCase() + this.category.substring(1),
        },
        {
          tag: "div",
          classes: ["posts-wrapper"],
          children: this.news.map((singleNew) => {
            const element: DomElement = {
              tag: "article",
              classes: ["single-post"],
              children: [
                {
                  tag: "h4",
                  textContent: singleNew.title,
                },
                {
                  tag: "div",
                  classes: ["img-wrapper"],
                  children: [
                    {
                      tag: "img",
                      attributes: [{ attName: "src", attValue: singleNew.url }],
                    },
                  ],
                },
                {
                  tag: "p",
                  textContent: singleNew.description,
                },
                {
                  tag: "a",
                  events: [
                    {
                      eventName: "click",
                      callback: (e) => {
                        e.preventDefault();
                        this.router.navigate(`${singleNew.id}`);
                      },
                    },
                  ],
                  textContent: "Read More",
                },
              ],
            };
            return element;
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
}
