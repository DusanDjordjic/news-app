import { ActivatedRoute } from "../activatedRoute/activatedRoute";
import { Observable } from "../lib/observable";
import { Observer } from "../lib/observer";
import { IActivatedRoute } from "../models/activatedRoute.interface";
import { ComponentProps } from "../types/component-props.type";

const routesToDisableHeader = ["/categories", "/search"];

export class HeaderService extends Observable<ComponentProps> {
  private static instance: HeaderService | undefined = undefined;
  private activatedRoute: ActivatedRoute = ActivatedRoute.getInstance();
  private activatedRouteObserver: Observer<IActivatedRoute> = new Observer(
    (newActivatedRoute: IActivatedRoute) => {
      if (routesToDisableHeader.includes(newActivatedRoute.path)) {
        this.setNewProps({ areButtonsDisabled: true });
      } else {
        this.setNewProps({ areButtonsDisabled: false });
      }
    }
  );
  constructor() {
    super({
      areButtonsDisabled: false,
    });
    if (HeaderService.instance === undefined) {
      HeaderService.instance = this;
      this.activatedRoute.subscribe(this.activatedRouteObserver);
    } else {
      throw new Error("Use HeaderService.getInstance() instead of 'new'");
    }
  }

  static getInstance() {
    if (!HeaderService.instance) HeaderService.instance = new HeaderService();
    return HeaderService.instance;
  }
  setNewProps(newProps: ComponentProps) {
    this.setValue(newProps);
  }
}
