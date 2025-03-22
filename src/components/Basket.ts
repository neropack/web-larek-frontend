import { IBasket } from "../types";
import { cloneTemplate, createElement, ensureElement } from "../utils/utils";
import { View } from "./base/Component";
import { EventEmitter } from "./base/events";

export class Basket extends View<IBasket> {
    static template = ensureElement<HTMLTemplateElement>('#basket');
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLElement;

    constructor(protected events: EventEmitter) {
        super(cloneTemplate(Basket.template), events);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._price = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            })
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста',
            }))
        }
    }

    set price(price: number) {
        this.setText(this._price, `${price} синапсов`);
    }
}

// TODO: сделать индексы для товаров