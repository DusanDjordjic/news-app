import { Observable } from "../lib/observable";
import { IActivatedRoute } from "../models/activatedRoute.interface";

export class ActivatedRoute extends Observable<IActivatedRoute> {
  static instance: ActivatedRoute | undefined = undefined;
  constructor() {
    super({ path: location.pathname, params: {} });
    if (ActivatedRoute.instance === undefined) {
      ActivatedRoute.instance = this;
    } else {
      throw new Error("Use ActivatedRoute.getInstance() instead of 'new'");
    }
  }
  static getInstance() {
    return ActivatedRoute.instance;
  }
  constructRoute(data: { route: string; requested: string }) {
    const { route, requested } = data;
    /**
     * @description
     * Rezultat tipa IActivatedRoute koji treba da popunimo
     * u zavisnostni od postojece i trazene rute .
     */
    const result: IActivatedRoute = { path: route, params: {} };

    /**
     * @description
     * Postojeca ruta podeljenja po "/".
     * Bez prvog clana zato sto ruta pocinje sa "/"
     * i uvek ce prvi clan biti ""
     */

    const splitedRoute = route.split("/");
    splitedRoute.shift();

    /**
     * @description
     * Trazena ruta podeljenja po "/".
     * Bez prvog clana zato sto ruta pocinje sa "/"
     * i uvek ce prvi clan biti ""
     */
    const splitedRequested = requested.split("/");
    splitedRequested.shift();

    for (let i = 0; i < splitedRoute.length; i++) {
      /**
       * @description
       * Postojeca ruta podeljena na delove
       * i uzet deo na indeksu i
       */
      const splitedRoutePart = splitedRoute[i];
      /**
       * @description
       * Trazena ruta podeljena na delove
       * i uzet deo na indeksu i
       */
      const splitedRequestedPart = splitedRequested[i];

      // Dinamicki deo rute
      // Dodati u parametre
      if (splitedRoutePart.startsWith(":")) {
        // substring(1) da bi smo izbrisali ":"
        result.params[splitedRoutePart.substring(1)] = splitedRequestedPart;
        continue;
      }
    }
    return result;
  }
}

const activatedRoute = new ActivatedRoute();
