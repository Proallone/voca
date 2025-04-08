import Controller from "sap/ui/core/mvc/Controller";
import ToolPage from "sap/tnt/ToolPage";
import { type Button$PressEvent } from "sap/m/Button";
import Popover from "sap/m/Popover";
import UIComponent from "sap/ui/core/UIComponent";
import ToolHeader from "sap/tnt/ToolHeader";
import Dialog from "sap/m/Dialog";
import ListItemBase, { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import ListItem from "sap/ui/core/ListItem";
import ContextBinding from "sap/ui/model/ContextBinding";
import Context from "sap/ui/model/odata/v4/Context";

/**
 * @namespace com.proallone.event.controller
 */
export default class App extends Controller {
  private actionsPopover: Popover;
  private notificationsDialog: Dialog;

  public onInit() {
    const toolHeader = this.byId("_IDGenToolHeader1") as ToolHeader;
    toolHeader.bindElement({ path: "/Users('23084022-9971-407a-9470-6d42d4c9844e')", parameters: { $select: "notifications/viewed"}}); //todo change placeholder, could be moved to xml
  }

  public onSideNavButtonPress() {
    const toolPage = this.byId("toolPage") as ToolPage;
    const expanded = toolPage.getSideExpanded();

    toolPage.setSideExpanded(!expanded);
  }

  public onAvatarPressed() {
    console.log("test");
  }

  public async onNotificationsPress(evt: Button$PressEvent) {
    console.log("notifications pressed");
    const src = evt.getSource();
    const bindingPath = src.getBindingContext()?.getPath();

    if (!this.notificationsDialog) {
      this.notificationsDialog = (await this.loadFragment({
        name: "com.proallone.event.view.fragments.Notifications",
      })) as Dialog;
    }

    this.notificationsDialog.bindElement(bindingPath!);
    this.notificationsDialog.open();
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

  public onNotificationsClose(evt: Button$PressEvent) {
    const dialog = evt.getSource().getParent() as Dialog;
    dialog.close();
  }

  public onNotificationRead(evt: ListItemBase$PressEvent) {
    console.log(evt)
    const srv = evt.getSource() as ListItemBase;
    const binding = srv.getBindingContext() as Context;
    binding.setProperty("viewed", true);
  }

  public onLogoPressed() {
    const router = UIComponent.getRouterFor(this);
    router.navTo("RouteEvents");
  }
}
