import { factory } from "../factory/factory";
import { BaseComponent } from "../models/base-component.model";
import { DomElement } from "../models/dom-element.interface";
import { NewModel } from "../models/new.model";
import { NewsService } from "../providers/news.service";
import { Router } from "../router";

export class SingleCategory extends BaseComponent {
  private category: string = "";
  private news: NewModel[] = [];
  private maxLength: number = 0;
  private newsService: NewsService = NewsService.getInstance();
  private router: Router = Router.getInstance();
  constructor(parent: BaseComponent, props: { [key: string]: any }) {
    super(parent);
    this.category = props.category;
    this.getNews();
  }
  getNews() {
    this.newsService
      .getCategoryNews(this.category, { pageSize: 4 })
      .then((data) => {
        this.news = (data as { maxLength: number; news: NewModel[] }).news;

        this.maxLength = (
          data as { maxLength: number; news: NewModel[] }
        ).maxLength;

        this.reRender();
      });
  }
  isDialogOpen: boolean = true;
  getTree(): DomElement {
    const domTree: DomElement = {
      tag: "div",
      classes: ["single-category"],
      children: [
        {
          tag: "header",
          classes: ["category-header"],
          children: [
            {
              tag: "h3",
              classes: ["text-link"],
              textContent:
                this.category[0].toUpperCase() + this.category.substring(1),
              events: [
                {
                  eventName: "click",
                  callback: (e) => {
                    e.preventDefault();
                    this.router.navigate("/categories", this.category);
                  },
                },
              ],
            },
            {
              tag: "button",
              classes: [this.isDialogOpen ? "open" : "closed", "btn"],
              textContent: this.isDialogOpen ? "Close" : "Open",
              events: [
                {
                  eventName: "click",
                  callback: (e) => {
                    e.preventDefault();
                    this.isDialogOpen = !this.isDialogOpen;
                    this.reRender();
                  },
                },
              ],
            },
          ],
        },
        {
          tag: "div",
          classes: ["dialog", this.isDialogOpen ? "open" : "closed"],
          children: [
            {
              tag: "div",
              classes: ["dialog-posts-wrapper"],
              children: [
                {
                  tag: "div",
                  classes: ["dialog-slider"],
                  attributes: [
                    { attName: "id", attValue: `id-${this.category}-dialog` },
                  ],
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
                                this.router.navigate(`/${singleNew.id}`);
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
            },
          ],
        },
      ],
    };
    return domTree;
  }

  render(): HTMLElement {
    return factory(this.getTree());
  }
}
