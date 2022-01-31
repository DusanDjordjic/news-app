import { factory } from "../../factory/factory";
import { Observer } from "../../lib/observer";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";
import { NewModel } from "../../models/new.model";
import { INewsQueryParams } from "../../models/news-query-params.interface";
import { OnDestroy } from "../../models/onDestroy.interface";
import { NewsService } from "../../providers/news.service";
import { Router } from "../../router";

export class AllPostsComponent extends BaseComponent implements OnDestroy {
  constructor(parent: BaseComponent | null) {
    super(parent);
    this.getNews();
    this.newsService.subscribe(this.onNewsParamsChange);
  }
  private router: Router = Router.getInstance();
  private news: NewModel[] = [];
  private newsService: NewsService = NewsService.getInstance();
  private onNewsParamsChange: Observer<INewsQueryParams> = new Observer(
    (value: INewsQueryParams) => {
      this.getNews();
    }
  );
  getNews() {
    // this.newsService.setQueryParams({})
    this.newsService
      .getNews()
      .then((data) => {
        this.news = data as NewModel[];
        this.reRender();
      })
      .catch((err) => {
        console.log({ err });
      });
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
        {
          tag: "div",
          classes: ["posts-wrapper"],
          children: this.news.map((singleNew) => {
            const element: DomElement = {
              tag: "article",
              classes: ["single-post"],
              children: [
                {
                  tag: "h3",
                  textContent: singleNew.title,
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
  onDestroy() {
    this.newsService.unsubscribe(this.onNewsParamsChange);
  }
}
