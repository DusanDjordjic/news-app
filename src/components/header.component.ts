import { Observer } from "../lib/observer";
import { BaseComponent } from "../models/base-component.model";
import { DomElement } from "../models/dom-element.interface";
import { HeaderService } from "../providers/header.service";
import { NewsService } from "../providers/news.service";
import { Router } from "../router";
import { ComponentProps } from "../types/component-props.type";

export class HeaderComponent extends BaseComponent {
  private router: Router = Router.getInstance();
  private headerService: HeaderService = HeaderService.getInstance();
  private newsService: NewsService = NewsService.getInstance();

  private headerServiceObsrever: Observer<ComponentProps> = new Observer(
    (newProps: ComponentProps) => {
      this.areButtonsDisabled = newProps.areButtonsDisabled;
    }
  );

  areButtonsDisabled = false;
  activeButton: "srb" | "cro" = "srb";

  countryButtonClick(newValue: "srb" | "cro") {
    console.log(newValue);
    console.log(this.areButtonsDisabled);
    if (this.areButtonsDisabled) return;
    this.newsService.setQueryParams({ country: newValue });
    this.activeButton = newValue;
    this.reRender();
  }
  constructor(parent: BaseComponent | null) {
    super(parent);
    this.headerService.subscribe(this.headerServiceObsrever);
  }
  getTree(): DomElement {
    const self = this;
    const domTree: DomElement = {
      tag: "header",
      children: [
        {
          tag: "nav",
          classes: ["main-nav"],
          children: [
            {
              tag: "ul",
              classes: ["nav-links-wrapper"],
              children: [
                {
                  tag: "li",
                  children: [
                    {
                      tag: "a",
                      attributes: [{ attName: "href", attValue: "/" }],
                      textContent: "All posts",
                      events: [
                        {
                          eventName: "click",
                          callback: (e) => {
                            e.preventDefault();
                            self.router.navigate("/");
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  tag: "li",
                  children: [
                    {
                      tag: "a",
                      attributes: [
                        { attName: "href", attValue: "/categories" },
                      ],
                      textContent: "Categories",
                      events: [
                        {
                          eventName: "click",
                          callback: (e) => {
                            e.preventDefault();
                            self.router.navigate("/categories");
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  tag: "li",
                  children: [
                    {
                      tag: "a",
                      attributes: [{ attName: "href", attValue: "/search" }],
                      textContent: "Search",
                      events: [
                        {
                          eventName: "click",
                          callback: (e) => {
                            e.preventDefault();
                            self.router.navigate("/search");
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
              classes: ["buttons-wrapper"],
              children: [
                {
                  tag: "button",
                  textContent: "SRB",
                  classes: [
                    this.activeButton === "srb" ? "active" : "inactive",
                    this.areButtonsDisabled ? "disabled" : "enabled",
                  ],
                  events: [
                    {
                      eventName: "click",
                      callback: this.countryButtonClick.bind(this, "srb"),
                    },
                  ],
                },
                {
                  tag: "button",
                  textContent: "CRO",
                  classes: [
                    this.activeButton === "cro" ? "active" : "inactive",
                    this.areButtonsDisabled ? "disabled" : "enabled",
                  ],
                  events: [
                    {
                      eventName: "click",
                      callback: this.countryButtonClick.bind(this, "cro"),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    return domTree;
  }
  render() {
    console.log("HEADER COMPONENT CANNOT BE RENDERED");
  }
}
