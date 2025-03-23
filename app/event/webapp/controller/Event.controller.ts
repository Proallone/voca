import Controller from "sap/ui/core/mvc/Controller";
import { Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace com.proallone.event.controller
 */
export default class Event extends Controller {
  public onInit() {
    const router = UIComponent.getRouterFor(this);
    router.attachRouteMatched(this, this.onRouteMatched);
  }

  public onRouteMatched(evt: Router$RouteMatchedEvent) {
    const args = evt.getParameter("arguments");
    console.log(args);
  }

  public navBack() {
    const router = UIComponent.getRouterFor(this);
    router.navTo("RouteMain");
  }
}
