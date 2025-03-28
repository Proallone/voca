import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { FeedInput$PostEvent } from "sap/m/FeedInput";
import List from "sap/m/List";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Breadcrumbs from "sap/m/Breadcrumbs";
import Link, { $LinkSettings} from "sap/m/Link";
import { title } from "process";
import Button, { Button$PressEvent } from "sap/m/Button";
import MessageBox from "sap/m/MessageBox";
import MessageToast from "sap/m/MessageToast";
import ODataContextBinding from "sap/ui/model/odata/v4/ODataContextBinding";
import Context from "sap/ui/model/odata/v4/Context";

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
      image_url: 'test-resources/sap/m/images/dronning_victoria.jpg'
    });

    ctx.created()?.then(()=>{
      MessageToast.show("Comment added!");
    })
  }

  public onLikePress(evt: Button$PressEvent) {
    console.log(evt);
    const btn = evt.getSource() as Button;
    const binding = this.getView()?.getBindingContext();
    MessageToast.show("Liked!");
  }
}
