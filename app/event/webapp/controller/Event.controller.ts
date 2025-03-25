import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { FeedInput$PostEvent } from "sap/m/FeedInput";

interface IEvent {
  ID : string
};

/**
 * @namespace com.proallone.event.controller
 */
export default class Event extends Controller {
  public onInit() {
    const router = UIComponent.getRouterFor(this);
    router?.getRoute('RouteEvent')?.attachPatternMatched(this.onRouteMatched, this);
  }

  public onRouteMatched(evt: Route$PatternMatchedEvent) {
    const args = evt.getParameter("arguments") as IEvent; //todo fix
    if(args) this.getView()?.bindElement(`/Events('${args.ID}')`)
  }

  public navBack() {
    const router = UIComponent.getRouterFor(this);
    router.navTo("RouteMain");
  }

  public onPost(evt: FeedInput$PostEvent) {
    console.log('posted')
  }
}
