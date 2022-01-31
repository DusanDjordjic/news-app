import { Observable } from "../lib/observable";
import { NewModel } from "../models/new.model";
import { INewsQueryParams } from "../models/news-query-params.interface";

const baseUrl = "http://localhost:3000/news";

export class NewsService extends Observable<INewsQueryParams> {
  private static instance: NewsService | undefined = undefined;

  setQueryParams(newQueryParams: INewsQueryParams) {
    Object.assign(this.value, newQueryParams);
    this.setValue(this.value);
  }

  constructor() {
    super({ country: "srb" });
    if (NewsService.instance === undefined) {
      NewsService.instance = this;
    } else {
      throw new Error("Use NewsService.getInstance() instead of 'new'");
    }
  }

  static getInstance() {
    if (!NewsService.instance) NewsService.instance = new NewsService();
    return NewsService.instance;
  }

  /**
   *
   * @param params Query parametri koji ce biti zakaceni za url
   *
   * @description
   * Salje http zahtev sa prosledjenim parametrima i vraca Promise
   */
  getNews() {
    let newUrl = baseUrl + "?";

    for (let key in this.value) {
      newUrl += `${key}=${this.value[key]}`;
    }
    console.log(newUrl);

    return new Promise((resolve, reject) => {
      fetch(newUrl)
        .then((response) => response.json())
        .then((data) => data.map((item: any) => new NewModel(item)))
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }
}
