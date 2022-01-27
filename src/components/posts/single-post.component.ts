import { ActivatedRoute } from "../../activatedRoute/activatedRoute";
import { Observer } from "../../lib/observer";
import { IActivatedRoute } from "../../models/activatedRoute.interface";
import { BaseComponent } from "../../models/base-component.model";
import { OnDestroy } from "../../models/onDestroy.interface";

export class SinglePostComponent extends BaseComponent implements OnDestroy {
  private activedRoute: ActivatedRoute = ActivatedRoute.getInstance();
  private activatedRouteObserver: Observer<IActivatedRoute> = new Observer(
    (newActivatedRoute: IActivatedRoute) => {
      console.log("SINGLE POST", newActivatedRoute.params);
    }
  );
  constructor(parent: BaseComponent | null) {
    super(parent);

    this.activedRoute.subscribe(this.activatedRouteObserver);
    this.activedRoute.notifyOne(this.activatedRouteObserver);
  }
  onDestroy() {
    this.activedRoute.unsubscribe(this.activatedRouteObserver);
    console.warn("SinglePost destroyed");
  }
  render(): void {}
}
