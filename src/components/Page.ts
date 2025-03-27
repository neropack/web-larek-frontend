import { IPage } from "../types";
import { ensureElement } from "../utils/utils";
import { View } from "./base/Component";
import { IEvents } from "./base/events";

export class Page extends View<IPage> {
    protected _basketCounter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _basket: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        })
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        value ? this._wrapper.classList.add('page__wrapper_locked') : this._wrapper.classList.remove('page__wrapper_locked');
    }

    set counter(value: number) {
        this.setText(this._basketCounter, String(value));
    }
}
