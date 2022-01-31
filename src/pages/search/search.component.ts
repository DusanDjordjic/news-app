import { factory } from "../../factory/factory";
import { BaseComponent } from "../../models/base-component.model";
import { DomElement } from "../../models/dom-element.interface";
import { NewModel } from "../../models/new.model";
import { NewsService } from "../../providers/news.service";
import { Router } from "../../router";

export class SearchComponent extends BaseComponent {
  private newsService: NewsService = NewsService.getInstance();
  private news: NewModel[] = [];
  private router: Router = Router.getInstance();
  private q: string = "";
  private getNews() {
    console.log(this.q);

    this.newsService
      .getSearchResults(this.q)
      .then((data) => {
        this.news = data as NewModel[];
        console.log(this.news);

        this.reRender();
      })
      .catch((err) => console.log(err));
  }
  constructor(parent: BaseComponent | null) {
    super(parent);
    this.getNews();
  }
  getTree() {
    const tree: DomElement = {
      tag: "div",
      classes: ["container"],
      children: [
        {
          tag: "form",
          classes: ["search-form"],
          events: [
            {
              eventName: "submit",
              callback: (e) => {
                e.preventDefault();
                console.log(this.q);
                this.getNews();
              },
            },
          ],
          children: [
            {
              tag: "div",
              classes: ["form-group"],
              children: [
                {
                  tag: "label",
                  textContent: "Enter to search",
                  attributes: [{ attName: "id", attValue: "desc" }],
                },
                {
                  tag: "input",
                  attributes: [
                    { attName: "placeholder", attValue: "Search string" },
                    { attName: "id", attValue: "desc" },
                  ],
                  events: [
                    {
                      eventName: "input",
                      callback: (e) => {
                        const target = e.target as HTMLInputElement;
                        const value = target.value;
                        this.q = value;
                      },
                    },
                  ],
                },
              ],
            },
          ],
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
