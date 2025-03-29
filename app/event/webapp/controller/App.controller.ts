import Controller from "sap/ui/core/mvc/Controller";
import ToolPage from "sap/tnt/ToolPage";
import { Link$ClickEvent } from "sap/ui/webc/main/Link";
import UIComponent from "sap/ui/core/UIComponent";
import { Button$PressEvent } from "sap/m/Button";
import { SearchField$SearchEvent } from "sap/m/SearchField";
import Popover from "sap/m/Popover";

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

  public onBreadcrumbPress(evt: Link$ClickEvent) {
    const link = evt.getSource();
    const target: string = link.data("target");
    const router = UIComponent.getRouterFor(this);
    router.navTo(target)
  }

  public onNotificationsPress(evt: Button$PressEvent){
    console.log("notifications pressed"); 
  }

  public async onActionsPress(evt: Button$PressEvent){
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
}
