import { BaseComponent } from "../models/base-component.model";
import { DomElement } from "../models/dom-element.interface";
import { Router } from "../router";

export class HeaderComponent extends BaseComponent {
  private domTree: DomElement;
  private router: Router = Router.getInstance();
  constructor(parent: BaseComponent | null) {
    super(parent);
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
          ],
        },
      ],
    };
    this.domTree = domTree;
  }
  getTree(): DomElement {
    return this.domTree;
  }
  render() {
    console.log("HEADER COMPONENT CANNOT BE RENDERED");
  }
}
