import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { FeedInput$PostEvent } from "sap/m/FeedInput";
import List from "sap/m/List";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";

import Button, { Button$PressEvent } from "sap/m/Button";

import MessageToast from "sap/m/MessageToast";

import { Link$ClickEvent } from "sap/ui/webc/main/Link";
import ObjectStatus from "sap/m/ObjectStatus";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";

interface IEvent {
  ID : string
};


/**
 * @namespace com.proallone.event.controller
 */
export default class EventDetails extends Controller {
  public onInit() {
    const router = UIComponent.getRouterFor(this);
    router?.getRoute('RouteEventDetails')?.attachPatternMatched(this.onRouteMatched, this);
  }

  public onRouteMatched(evt: Route$PatternMatchedEvent) {
    const args = evt.getParameter("arguments") as IEvent; //todo fix?

    if(args) this.getView()?.bindElement(`/Events('${args.ID}')`);

  }

  public navBack() {
    const router = UIComponent.getRouterFor(this);
    router.navTo("RouteEvents");
  }

  public onCommentPost(evt: FeedInput$PostEvent) {
    console.log('posted')
    const list = this.byId("postsList") as List;
    const binding = list.getBinding("items") as ODataListBinding;
    const content = evt.getParameter("value");

    //todo - to change
    const ctx = binding.create({
      title: "placeholder",
      content: content,
    });

    ctx.created()?.then(()=>{
      MessageToast.show("Comment added!");
      const t = this.byId("_IDGenObjectStatus53") as ObjectStatus;
      const b = t.getBindingContext();
      b?.getModel().refresh();
    })
  }

  public async onLikePress(evt: Button$PressEvent) {
    console.log(evt);
    const btn = evt.getSource() as Button;
    const binding = this.getView()?.getBindingContext();

    const oModel = this.getView()?.getModel();

    const oAction = oModel?.bindContext('EventsService.like(...)', binding!) as ODataContextBinding;
    
    await oAction.invoke()
    MessageToast.show("Liked!");
  }

  public onBreadcrumbPress(evt: Link$ClickEvent) {
    const link = evt.getSource();
    const target: string = link.data("target");
    const router = UIComponent.getRouterFor(this);
    router.navTo(target)
  }


}
