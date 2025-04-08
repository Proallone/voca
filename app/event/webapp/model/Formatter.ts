import Controller from "sap/ui/core/mvc/Controller";

type Notification = {
    ID: string,
    viewed: boolean;
}

//? This could be perhaps implemented in xml but this way it is easier
export default  {
    countNotViewedNotifications: function (this: Controller, notifications: Notification[]): number {
        return notifications.filter(n => !n.viewed).length || 0;
    }
};