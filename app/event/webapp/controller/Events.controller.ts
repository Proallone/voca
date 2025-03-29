import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import { Link$PressEvent } from "sap/m/Link";
import Popover from "sap/m/Popover";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";

/**
 * @namespace com.proallone.event.controller
 */
export default class Events extends Controller {
  protected eventPlacePopover: Popover;

  public onInit() {
    const router = UIComponent.getRouterFor(this);
    router
      ?.getRoute("RouteEvents")
      ?.attachPatternMatched(this.onRouteMatched, this);
  }

  public onRouteMatched(evt: Route$PatternMatchedEvent) {
    this.byId("eventList")?.getBinding("items")?.refresh();
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

    if (!this.eventPlacePopover) {
      this.eventPlacePopover = (await this.loadFragment({
        name: "com.proallone.event.view.fragments.EventPlace",
      })) as Popover;
    }

    this.eventPlacePopover.bindElement(bindingPath!);
    this.eventPlacePopover.openBy(src);
  }

  public onAddressPopoverClose() {
    const popover = this.byId("addressPopover") as Popover;
    popover.close();
  }
}
