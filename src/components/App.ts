import { ICard } from "../types";
import { IEvents } from "./base/events";

export class App {
    items: ICard[] = [];

    constructor(protected events: IEvents) {};

    setItems(items: ICard[]) {
        this.items = items;
        this.events.emit('items:change', this.items);
    }
}