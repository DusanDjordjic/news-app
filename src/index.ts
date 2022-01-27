import { ActivatedRoute } from "./activatedRoute/activatedRoute";
import { Observer } from "./lib/observer";
import { IActivatedRoute } from "./models/activatedRoute.interface";
import { BaseComponent } from "./models/base-component.model";
import { IRoute } from "./models/route.interface";

import { Router } from "./router";

/**
 * @description
 * root nase aplikacije. sve komponente treba da se renderuju u nju
 */
const appRoot = document.getElementById("root") as HTMLDivElement;

class App extends BaseComponent {
  private activatedRoute: ActivatedRoute = ActivatedRoute.getInstance();
  private router: Router = Router.getInstance();
  private static instance: App | undefined = undefined;

  private activatedRouteObserver: Observer<IActivatedRoute> = new Observer(
    (newActivatedRoute: IActivatedRoute) => {
      const iRoute = this.router.getActiveComponent(newActivatedRoute.path);

      /**
       * Ovde treba da ucitamo komponentu
       */
      this.getNewActiveComponent(iRoute);
    }
  );

  private activatedComponentId: number = -1;
  private activatedComponent: any;

  constructor() {
    super(null);
    if (App.instance === undefined) {
      App.instance = this;
      this.activatedRoute.subscribe(this.activatedRouteObserver);
      /**
       * Pozivamo notify da bi uskladili app sa
       * trenutnom rutom.
       */
      // this.router.notify();
      this.router.navigate("/hello");
      this.router.navigate("/");
      // this.router.navigate("/");
      // this.router.navigate("/prvi-post");
      // this.router.navigate("/drugi-post");
      // this.router.navigate("/teci-post");
    } else {
      throw new Error("Use App.getInstance() instead of 'new'");
    }
  }
  static getInstance() {
    if (App.instance === undefined) App.instance = new App();
    return App.instance;
  }

  getNewActiveComponent(iRoute: IRoute) {
    if (!(this.activatedComponentId === iRoute.id)) {
      if (this.activatedComponent !== undefined) {
        // Ako komponenta implemetira interface OnDestory pozvati metodu onDestroy
        if (this.activatedComponent.onDestroy)
          this.activatedComponent.onDestroy();
      }
      this.activatedComponent = new iRoute.component(this);
    }
    this.render();
  }
  render() {
    this.activatedComponent.render();
  }
}

const app = new App();
