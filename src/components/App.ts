import { IBasket, ICard } from "../types";
import { IEvents } from "./base/events";

export class App {
    items: ICard[] = [];
    preview: ICard = null;
    basket: IBasket = {
        items: [],
        price: 0,
    }

    constructor(protected events: IEvents) {};

    setItems(items: ICard[]) {
        this.items = items;
        this.events.emit('items:change', this.items);
    }

    setModal(item: ICard) {
        this.preview = item;
        this.events.emit('preview:change', item);
    }

    inBasket(item: ICard) {
        return this.basket.items.includes(item.id);
    }

    addToBasket(item: ICard) {
        this.basket.items.push(item.id);
        this.basket.price += item.price;
        this.events.emit('basket:change', this.basket);
    }

    removeFromBasket(item:ICard) {
        this.basket.items = this.basket.items.filter((id) => id != item.id);
        this.basket.price -= item.price;
        this.events.emit('basket:change', this.basket);
    }
}