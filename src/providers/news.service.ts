import { INewsQueryParams } from "../models/news-query-params.interface";

const baseUrl =
  "https://newsapi.org/v2/top-headlines?apiKey=418765e76c6e4cd0add53172d7dde895";

export class NewsService {
  private static instance: NewsService | undefined = undefined;

  constructor() {
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
  getNews(params: INewsQueryParams) {}
}
