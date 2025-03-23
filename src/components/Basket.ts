import { IBasket } from "../types";
import { cloneTemplate, createElement, ensureElement } from "../utils/utils";
import { View } from "./base/Component";
import { EventEmitter } from "./base/events";

export class Basket extends View<IBasket> {
    static template = ensureElement<HTMLTemplateElement>('#basket');
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

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
            this._button.disabled = false;
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста',
            }))
            this._button.disabled = true;
        }
    }

    set price(price: number) {
        this.setText(this._price, `${price} синапсов`);
    }

    refreshIndex() {
        Array.from(this._list.children).forEach((item, index) => {
            const indexElement = item.querySelector('.basket__item-index');
            if (indexElement) {
                    indexElement.textContent = (index + 1).toString();
                }
            })
    }
}