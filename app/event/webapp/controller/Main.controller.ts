import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";

/**
 * @namespace com.proallone.event.controller
 */
export default class Main extends Controller {
  public onInit() {
    console.log("init");
  }

  public handlePress(evt: ListItemBase$PressEvent) {
    const router = UIComponent.getRouterFor(this);
    const item = evt.getSource();
    const ID: string = item.getBindingContext()?.getProperty("ID");
    router.navTo("RouteEvent", { ID: ID });
  }
}
