import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import { Link$PressEvent } from "sap/m/Link";
import Dialog from "sap/m/Dialog";
import Popover from "sap/m/Popover";

/**
 * @namespace com.proallone.event.controller
 */
export default class Events extends Controller {
  protected eventPlacePopover: Popover;

  public onInit() {
    console.log("init");
  }

  public handlePress(evt: ListItemBase$PressEvent) {
    const router = UIComponent.getRouterFor(this);
    const item = evt.getSource();
    const ID: string = item.getBindingContext()?.getProperty("ID");
    router.navTo("RouteEventDetails", { ID: ID });
  }

  public async onPlacePress(evt: Link$PressEvent) {
    const src = evt.getSource();
    const bindingPath = src.getBindingContext()?.getPath();

    if(!this.eventPlacePopover) {
      this.eventPlacePopover = await this.loadFragment({ name: "com.proallone.event.view.fragments.EventPlace"}) as Popover;
    };

    this.eventPlacePopover.bindElement(bindingPath!)
    this.eventPlacePopover.openBy(src)
  }
}
