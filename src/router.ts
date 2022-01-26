import { ActivatedRoute } from "./activatedRoute/activatedRoute";
import { Observable } from "./lib/observable";
import { IRoute } from "./models/route.interface";

/**
 * @description
 * Router klasa je singleton;
 *
 * pRoutes => privatne rute. Ne postoji get
 *
 * navigate => metoda koja salje novu vrednost rutu pretvara
 * u IActivatedRoute. Taj objekat salje ActivatedRoute klasi
 * a svom obsrevable-u salje novu putanju
 *
 * activatedRoute => observable koji cuva trenutnu rutu u
 * obliku IActivatedRoute. Salje mu se nova vrendost kada se promeni ruta
 * i ta ruta prodje svu validaciju.
 */

export class Router extends Observable<string> {
  private static instance: Router | undefined = undefined;
  /**
   * @description privatne rute, postoji samo set
   */
  private pRoutes: IRoute[] = [];
  private activatedRoute = ActivatedRoute.getInstance();

  set routes(routes: IRoute[]) {
    this.pRoutes = routes;
  }

  constructor(firstValue: any) {
    super(firstValue);
    if (Router.instance === undefined) {
      Router.instance = this;
    } else {
      throw new Error("Use Router.getInstance() instead of 'new'");
    }
  }
  static getInstance() {
    if (!Router.instance) Router.instance = new Router(location.pathname);
    return Router.instance;
  }

  override notify(): void {
    const route = this.getRequestedRouteObject();
    if (route == null) {
      /**
       * Bilo bi dobro da se napravi Logger class
       * koji ce da prikazuje greske paput ove
       *
       * Nije primarno!
       */
      console.warn(`Ne postoji ruta ${this.value}`);
      return;
    }

    // Nasli smo trenutnu rutu sad treba da napravimo activatedRoute Objekat od te rute

    const activatedRoute = this.activatedRoute.constructRoute({
      route: route.path,
      requested: this.value,
    });
    // Saljemo novu vrednost nasem observable-u
    this.activatedRoute.setActivatedRoute(activatedRoute);

    // Saljemo novu putanju observerima
    this.observers.forEach((obs) => obs.update(route.path));
  }

  navigate(...routeParts: string[]) {
    // Spojimo rutu u jedan string
    let nextUrl = routeParts.join("/");

    // Ako ne pocinje sa "/" dodacemo ga
    if (!nextUrl.startsWith("/")) {
      nextUrl = "/" + nextUrl;
    }

    this.setValue(nextUrl);
  }
  /**
   * @description
   * Prvo podelimo zahtevanu rutu po "/" da bi smo dobili delove koji cine putanju.
   * Zatim to isto uradimo za sve registrovane rute.
   *
   * Ako su duzine nizova koje smo dobili isti onda se rute mozda poklapaju.
   * Ako duzine nisu iste sigurno se ne poklapaju.
   *
   * Treba da prodjemo jedan po jedan element i da vidimo da se poklapaju
   * Ako element koji dolazi iz registrovane putanje pocinje sa ":" znaci da je dinamicka ruta.
   *
   * Ako se naletni na dimacku rutu, proverava se da li se parametar na indeksu "i" (drugi, treci , deseti, ...)
   * poklapa sa nekim drugim parametrom na tom istom indeksu u bilo kojoj drugoj ruti.
   *
   * Ako se poklapa znaci da je ta requested ruta namenjena nekom drugom endpoint-u
   * (u sustini nekoj drugoj ruti sa kojom se poklapa, a ne sa tom dinamickom).
   *
   * Ako ne onda je gledamo kao dinamicku!
   */
  private getRequestedRouteObject() {
    const requestedPathValues = this.value.split("/");
    // Shift zato sto svaka ruta pozinje sa "/" tako da ce biti jedan prazan string na pocetku
    requestedPathValues.shift();

    for (let r = 0; r < this.pRoutes.length; r++) {
      /**
       * @description
       * Trenutna ruta u petlji
       */
      const route = this.pRoutes[r];
      /**
       * @description
       * Delovi trenutne rute podeljeni po "/"
       * i bez prvog clana zato sto je on uvek "",
       * jer nam svaka ruta pocinje sa "/"
       */
      const routePathValues = route.path.split("/");
      routePathValues.shift();

      // Ako duzine nisu iste nema potrebe da se gleda bilo sta jer sigurno nisu iste
      if (routePathValues.length === requestedPathValues.length) {
        let routesMatch = true;
        // Prolazimo kroz sve clanove niza routePathValues i requestedPathValues
        for (let i = 0; i < routePathValues.length; i++) {
          /**
           * @description
           * Trenutni deo rute koju trazimo
           * Deo na index-u i
           */
          let requestedRoutePart = requestedPathValues[i];
          /**
           * @description
           * Trenutni deo registrovane rute koju proveravamo
           * Deo na index-u i
           */
          let routePart = routePathValues[i];

          if (routePart.startsWith(":")) {
            /**
             * @see
             * Dinamicka ruta
             * Proveriti da li trenuti requestedRoutePart na indeksu "i" vec postoji u
             * nekoj drugoj ruti. Ako postoji onda postavi routesMatch = false
             */

            // Dinamicki deo rute => routePart

            // Trazeni deo rute => requestedRoutePart

            // Trenutni indeks => i; Pokazuje kom clanu niza se trenutno pristupa

            /**
             * @description
             * Postoji u svim rutama
             * Da li trazeni deo rute postoji negde u drugim rutama
             * na tom istom mestu (isti index===i)
             * Ako postoji znaci da ova ruta ne bi trebalo da bude dinamicka
             * i trebalo bi da se preskoci.
             */

            let existsInRoutes = false;

            /**
             * @see
             * Prolazimo kroz sve rute i uzmimamo "i"-ti clan
             * jer sa tim clanom treba da uporedimo.
             * Ako se poklapa postavljamo existsInRoutes = true
             *
             */
            this.pRoutes.forEach((route) => {
              /**
               * @description
               * Trenutna ruta podeljena na delove po "/"
               * i obrisan prvi deo zato sto ruta pocinje sa "/"
               * pa bi uvek bio jedan "" visak
               */
              const splitedRoute = route.path.split("/");
              splitedRoute.shift();

              /**
               * @description
               * Od podeljenih delova ruta uzimamo samo onaj
               * na indeksu i.
               * Zato sto nam je on bitan da ga uporedimo sa trenutnim
               * requestedRoutePart
               */
              const splitedRouteValue = splitedRoute[i];

              if (splitedRouteValue === requestedRoutePart)
                existsInRoutes = true;
            });

            /**
             * @see
             * Ako nije pronadjen deo rute koji se poklapa sa trazenim delom
             * Znaci da je taj deo rute dinamicki i treba da ga pustimo da prodje dalje
             */
            if (!existsInRoutes) continue;
          }

          /**
           * @see
           * Posto ruta nije dinamicka
           * Ako nisu isti delovi url-a ruta se ne poklapa
           */
          if (requestedRoutePart !== routePart) routesMatch = false;
        }

        if (routesMatch) return route;
      }
    }
    return null;
  }
}

/**
 * @description
 * Instanca Router klase.
 * Prilikom ucitavanja aplikacije router uzima trenutu vrendost pathname-a
 */
const router = new Router(location.pathname);

router.routes = [
  {
    path: "/",
    component: "All posts",
  },
  {
    path: "/:id",
    component: "Single post",
  },
  {
    path: "/categories",
    component: "All post by categories",
  },
  {
    path: "/categories/:category",
    component: "All posts of a single category",
  },
  {
    path: "/categories/:category/:id",
    component: "Signle post of a single category",
  },
  {
    path: "/categories/:category/:id/details",
    component: "Details of a signle post of a single category",
  },
  {
    path: "/search",
    component: "Search results",
  },
];
