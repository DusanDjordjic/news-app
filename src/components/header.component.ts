import { Observer } from "../lib/observer";
import { BaseComponent } from "../models/base-component.model";
import { DomElement } from "../models/dom-element.interface";
import { HeaderService } from "../providers/header.service";
import { Router } from "../router";
import { ComponentProps } from "../types/component-props.type";

export class HeaderComponent extends BaseComponent {
  private router: Router = Router.getInstance();
  private headerService: HeaderService = HeaderService.getInstance();
  private headerServiceObsrever: Observer<ComponentProps> = new Observer(
    (newProps: ComponentProps) => {
      this.areButtonsDisabled = newProps.areButtonsDisabled;
    }
  );

  areButtonsDisabled = false;
  activeButton: "us" | "gb" = "us";

  countryButtonClick(newValue: "us" | "gb") {
    console.log(newValue);
    console.log(this.areButtonsDisabled);
    if (this.areButtonsDisabled) return;

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
                  textContent: "US",
                  classes: [
                    this.activeButton === "us" ? "active" : "inactive",
                    this.areButtonsDisabled ? "disabled" : "enabled",
                  ],
                  events: [
                    {
                      eventName: "click",
                      callback: this.countryButtonClick.bind(this, "us"),
                    },
                  ],
                },
                {
                  tag: "button",
                  textContent: "GB",
                  classes: [
                    this.activeButton === "gb" ? "active" : "inactive",
                    this.areButtonsDisabled ? "disabled" : "enabled",
                  ],
                  events: [
                    {
                      eventName: "click",
                      callback: this.countryButtonClick.bind(this, "gb"),
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
