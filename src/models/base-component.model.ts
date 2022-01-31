export abstract class BaseComponent {
  protected parent: BaseComponent | null;
  constructor(
    /**
     * @description
     * Refernca na parent komponentu.
     * Parent od app je `null`
     */
    parent: BaseComponent | null,
    /**
     * @description
     * Props prosledjeni child komponenti koje mozemo proslediti iz parent componente
     * Na primer da u header componenti treba da bude disable-ovano menjaje `coutry-ja`
     */
    props?: { [key: string]: any }
  ) {
    this.parent = parent;
  }

  render() {}
  reRender() {
    if (this.parent === null) {
      this.render();
    } else {
      // console.log("Renderujem sebe iz ", this.parent);
      this.parent.reRender();
    }
  }
}
