import Controller from "sap/ui/core/mvc/Controller";
import ToolPage from "sap/tnt/ToolPage";
import { type Button$PressEvent } from "sap/m/Button";
import Popover from "sap/m/Popover";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace com.proallone.event.controller
 */
export default class App extends Controller {
  private actionsPopover: Popover;

  public onInit() {}

  public onSideNavButtonPress() {
    const toolPage = this.byId("toolPage") as ToolPage;
    const expanded = toolPage.getSideExpanded();

    toolPage.setSideExpanded(!expanded);
  }

  public onAvatarPressed() {
    console.log("test");
  }

  public onNotificationsPress(evt: Button$PressEvent) {
    console.log("notifications pressed");
  }

  public async onActionsPress(evt: Button$PressEvent) {
    const src = evt.getSource();

    if (!this.actionsPopover) {
      this.actionsPopover = (await this.loadFragment({
        name: "com.proallone.event.view.fragments.Actions",
      })) as Popover;
    }

    this.actionsPopover.openBy(src);
  }

  public onActionsPopoverClose() {
    const popover = this.byId("actionsPopover") as Popover;
    popover.close();
  }

  public onLogoPressed() {
    const router = UIComponent.getRouterFor(this);
    router.navTo("RouteEvents");
  }
}
