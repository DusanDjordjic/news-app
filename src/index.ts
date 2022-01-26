import { ActivatedRoute } from "./activatedRoute/activatedRoute";
import { Observer } from "./lib/observer";
import { IActivatedRoute } from "./models/activatedRoute.interface";
import { Router } from "./router";

const activatedRoute = ActivatedRoute.getInstance();
const activatedRouteObserver = new Observer<IActivatedRoute>(
  (value: IActivatedRoute) => {
    console.log("ActivatedRouteObserver:", value);
  }
);
activatedRoute.subscribe(activatedRouteObserver);

const router = Router.getInstance();
router.navigate("/");
router.navigate("categories", "health", "109");
router.navigate("categories/business/100/details");
router.navigate("/search", "health");
router.navigate("my-post-id");
