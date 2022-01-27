import { BaseComponent } from "../../models/base-component.model";
import { OnDestroy } from "../../models/onDestroy.interface";

export class AllPostsComponent extends BaseComponent implements OnDestroy {
  constructor(parent: BaseComponent | null) {
    super(parent);
  }
  onDestroy() {
    console.log("AllPosts destroyed");
  }
}
