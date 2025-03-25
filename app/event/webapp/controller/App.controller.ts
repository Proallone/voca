import Controller from "sap/ui/core/mvc/Controller";
import ToolPage from "sap/tnt/ToolPage";

/**
 * @namespace com.proallone.event.controller
 */
export default class App extends Controller {
  public onInit() {}

  public onSideNavButtonPress() {
    const toolPage = this.byId("toolPage") as ToolPage;
    const expanded = toolPage.getSideExpanded();

    toolPage.setSideExpanded(!expanded)
  }

  public onAvatarPressed() {
    console.log('test')
  }
}
