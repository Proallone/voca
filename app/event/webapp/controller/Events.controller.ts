import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";
import { Link$PressEvent } from "sap/m/Link";
import Popover from "sap/m/Popover";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import {
  SearchField$LiveChangeEvent,
  SearchField$SearchEvent,
} from "sap/m/SearchField";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import MultiInput, { MultiInput$TokenUpdateEvent } from "sap/m/MultiInput";
import Token from "sap/m/Token";

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

  public onEventsSearch(evt: SearchField$LiveChangeEvent) {
    const binding = this.byId("eventList")?.getBinding(
      "items"
    ) as ODataListBinding;
    const query = evt.getParameter("newValue");
    const aFilters: Filter[] = [];

    if (query) {
      aFilters.push(
        new Filter({
          path: "name",
          operator: FilterOperator.Contains,
          value1: query,
          caseSensitive: false,
        })
      );
    }

    binding.filter(aFilters);
  }

  public onTokenUpdate(evt: MultiInput$TokenUpdateEvent) {
    const input = evt.getSource() as MultiInput;
    const tokens = input.getTokens();
    const binding = this.byId("eventList")?.getBinding(
      "items"
    ) as ODataListBinding;

    const aFilters: Filter[] = [];

    tokens.map((t) =>
      aFilters.push(
        new Filter({
          path: "labels/label_ID",
          operator: FilterOperator.Contains,
          value1: t.getKey(),
        })
      )
    );

    const combined = new Filter({ filters: aFilters, and: true });
    binding.filter(combined);
  }
}
