import { ActivatedRoute } from "./activatedRoute/activatedRoute";
import { Observable } from "./lib/observable";

/**
 * @description
 * Router klasa je singleton;
 *
 * router => instanca je observable
 * sa njim je moguce menjati rute
 *
 * navigate => metoda koja salje novu vrednost
 * salje u obliku { path: string, params: { [key: string] : string } }
 *
 * activatedRoute$ => observable koji okida
 * kada promeni ruta tj. kada se promene parametri
 */

export class Router extends Observable<any> {
  static instance: Router | undefined = undefined;
  private pRoutes: { path: string; component: string }[] = [];
  private activatedRoute = ActivatedRoute.getInstance();
  set routes(routes: { path: string; component: string }[]) {
    this.pRoutes = routes;
  }

  get routes() {
    return this.pRoutes;
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
      console.warn(`Ne postoji ruta ${this.value}`);
      return;
    }
    // Nasli smo trenutnu rutu sad treba da napravimo activatedRoute Objekat od te rute

    const activatedRoute = this.activatedRoute.constructRoute({
      route: route.path,
      requested: this.value,
    });
    if (activatedRoute) this.activatedRoute.setValue(activatedRoute);

    this.observers.forEach((obs) => obs.update(route));
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
  getRequestedRouteObject() {
    /**
     * Pronaci aktivni rutu
     * Zahtevana ruta je ona koja je trenutno aktivna
     *
     * @description
     * Prvo podelimo zahtevanu rutu po "/" da bi smo dobili delove koji cine putanju
     * Zatim to isto uradimo za sve registrovane rute
     * Ako su duzine nizova koje smo dobili isti onda se rute mozda poklapaju
     * Ako duzine nisu iste sigurno se ne poklapaju
     *
     * Treba da prodjemo jedan po jedan element i da vidimo da se poklapaju
     * Ako element koji dolazi iz registrovane putanje pocinje sa ":"
     * znaci da je dinamicka ruta i tu ne gledamo nista.
     * Sve se poklapa sa dinamickim parametrom!
     */
    const requestedPathValues = this.value.split("/");
    // Shift zato sto svaka ruta pozinje sa "/" tako da ce biti jedan prazan string na pocetku
    requestedPathValues.shift();
    // console.log({ requestedPathValues });
    for (let r = 0; r < this.routes.length; r++) {
      /**
       * @description
       * Trenutna ruta u petlji
       */
      const route = this.routes[r];
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
            this.routes.forEach((route) => {
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

              if (splitedRouteValue === requestedRoutePart) {
                existsInRoutes = true;
              }
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
          if (requestedRoutePart !== routePart) {
            routesMatch = false;
          }
        }

        if (routesMatch) {
          console.warn("FOUND: ", {
            route: route.path,
            requested: this.value,
          });
          return route;
        } else {
        }
      }
    }
    return null;
  }
}

/**
 * @description
 * Prilikom ucitavanja aplikacije router uzima trenutu vrendost pathname-a
 *
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

// ! Za probu

// const routeObserver = new Observer<any>((value: any) =>
//   console.warn("OBSERVER, TRAZENA RUTA JE:", value)
// );

// router.subscribe(routeObserver);

// router.notify();

// router.navigate("/categories");
// router.navigate("categories", "education", "89");
// router.navigate("/categories", "business", "100");
// router.navigate("/id-od-post-a");
// router.navigate("/categories", "nemanja");
// router.navigate("/categories", "business", "134");
// router.navigate("/categories", "business", "555");
// router.navigate("/categories", "business", "555", "details");
// router.navigate("/categories", "business", "555", "likes");
// router.navigate("/search");
// router.navigate("/search", "dusan");
