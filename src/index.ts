import { ActivatedRoute } from "./activatedRoute/activatedRoute";
import { Observer } from "./lib/observer";
import { IActivatedRoute } from "./models/activatedRoute.interface";
import { Router } from "./router";

class App {
  private activatedRoute: ActivatedRoute = ActivatedRoute.getInstance();
  private router: Router = Router.getInstance();
  private static instance: App | undefined = undefined;
  private routerObserver: Observer<string> = new Observer(
    (newRoute: string) => {
      console.log({ newRoute });
    }
  );
  private activatedRouteObserver: Observer<IActivatedRoute> = new Observer(
    (newActivatedRoute: IActivatedRoute) => {
      console.log(newActivatedRoute);
      const component = this.router.getActiveComponent(
        newActivatedRoute.path
      ).component;
      console.log({ component });
      /**
       * Ovde treba da ucitamo komponentu
       */
    }
  );
  constructor() {
    if (App.instance === undefined) {
      App.instance = this;
      this.router.subscribe(this.routerObserver);
      this.activatedRoute.subscribe(this.activatedRouteObserver);
      /**
       * Pozivamo notify da bi uskladili app sa
       * trenutnom rutom.
       */
      this.router.notify();
      this.router.navigate("hello");
      this.router.navigate("categories", "123");
    } else {
      throw new Error("Use App.getInstance() instead of 'new'");
    }
  }
  static getInstance() {
    if (App.instance === undefined) App.instance = new App();
    return App.instance;
  }
}

const app = new App();
