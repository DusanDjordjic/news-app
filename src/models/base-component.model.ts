export abstract class BaseComponent {
  private parent: BaseComponent | null;
  constructor(parent: BaseComponent | null) {
    this.parent = parent;
  }
  update() {
    if (this.parent === null) return;
    console.log("Renderujem sebe iz ", this.parent);

    this.parent.render();
  }
  render() {}
}
