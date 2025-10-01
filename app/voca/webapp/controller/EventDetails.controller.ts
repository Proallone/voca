import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import MessageToast from "sap/m/MessageToast";
import ObjectStatus from "sap/m/ObjectStatus";
import { URLHelper } from "sap/m/library"
import type { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import type { FeedInput$PostEvent } from "sap/m/FeedInput";
import type ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import type List from "sap/m/List";
import type {  Link$ClickEvent } from "sap/ui/webc/main/Link";
import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import type { Button$PressEvent } from "sap/m/Button";
import type ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import type { AvatarGroup$PressEvent } from "sap/f/AvatarGroup";
import type Dialog from "sap/m/Dialog";


interface IEvent {
  ID: string;
}

/**
 * @namespace com.proallone.voca.controller
 */
export default class EventDetails extends Controller {
  protected eventAttendeesDialog: Dialog;


  public onInit() {
    const router = UIComponent.getRouterFor(this);
    router
      ?.getRoute("RouteEventDetails")
      ?.attachPatternMatched(this.onRouteMatched, this);
  }

  public onRouteMatched(evt: Route$PatternMatchedEvent) {
    const args = evt.getParameter("arguments") as IEvent; //todo fix?

    if (args) this.getView()?.bindElement(`/Events('${args.ID}')`);
  }

  public navBack() {
    const router = UIComponent.getRouterFor(this);
    router.navTo("RouteEvents");
  }

  public onCommentPost(evt: FeedInput$PostEvent) {
    console.log("posted");
    const list = this.byId("postsList") as List;
    const binding = list.getBinding("items") as ODataListBinding;
    const content = evt.getParameter("value");

    //todo - to change
    const ctx = binding.create({
      title: "placeholder",
      content: content,
    });

    ctx.created()?.then(() => {
      MessageToast.show("Comment added!");
      const t = this.byId("_IDGenObjectStatus53") as ObjectStatus;
      const b = t.getBindingContext();
      b?.getModel().refresh();
    });
  }

  public async onLikePress(evt: Button$PressEvent) {
    const binding = this.getView()?.getBindingContext();
    const oModel = this.getView()?.getModel();
    const oAction = oModel?.bindContext(
      "EventsService.like(...)",
      binding!
    ) as ODataContextBinding;
    oAction
      .invoke()
      .then(() => {
        oModel?.refresh(); //todo not optimal, change?
        MessageToast.show("Liked!");
      })
      .catch((error: Error) => {
        if (error.message.includes("exists")) {
          MessageToast.show("Already liked!");
        } else {
          MessageToast.show("Something went wrong!");
        }
      });
  }

  public onAttendPress() {
    const binding = this.getView()?.getBindingContext();
    const oModel = this.getView()?.getModel();
    const oAction = oModel?.bindContext(
      "EventsService.attend(...)",
      binding!
    ) as ODataContextBinding;
    oAction
      .invoke()
      .then(() => {
        oModel?.refresh(); //todo not optimal, change?
        MessageToast.show("Success!");
      })
      .catch((error: Error) => {
        if (error.message.includes("exists")) {
          MessageToast.show("Already attending!");
        } else {
          MessageToast.show("Something went wrong!");
        }
      });
  }

  public onGenerateIcsPress() {
    const binding = this.getView()?.getBindingContext();     
    const model = binding?.getModel() as ODataModel;        
    URLHelper.redirect(`${model.getServiceUrl().slice(0, -1)}${binding?.getPath()}/generateIcs`, true);
  }

  public async onAttendeesPress(evt: AvatarGroup$PressEvent) {
    const src = evt.getSource();
    const bindingPath = src.getBindingContext()?.getPath();

    if (!this.eventAttendeesDialog) {
      this.eventAttendeesDialog = (await this.loadFragment({
        name: "com.proallone.voca.view.fragments.EventAttendees",
      })) as Dialog;
    }

    this.eventAttendeesDialog.bindElement(bindingPath!);
    this.eventAttendeesDialog.open()
  }

  public onEventAttendeesClose(evt: Button$PressEvent) {
    const dialog = evt.getSource().getParent() as Dialog;
    dialog.close();
  }

  public onBreadcrumbPress(evt: Link$ClickEvent) {
    const link = evt.getSource();
    const target: string = link.data("target");
    const router = UIComponent.getRouterFor(this);
    router.navTo(target);
  }
}
