import { ICard } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class CardData extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _description: HTMLElement;

    protected _categoryColor = new Map<string, string>([
		['софт-скил', '_soft'],
		['другое', '_other'],
		['дополнительное', '_additional'],
		['кнопка', '_button'],
		['хард-скил', '_hard'],
	]);

    constructor(container: HTMLElement) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);

        this._category = container.querySelector('.card__category');
        this._price = container.querySelector('.card__price');
        this._button = container.querySelector('.card__button');
    }

    // сеттеры данных карточки
    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value:string) {
        this._title.textContent = value;
    }

    set image(value:string) {
        this._image.src = value;
    }

    set category(value:string) {
        this._category.textContent = value;
        this._category.classList.add(`card__category${this._categoryColor.get(value)}`);
    }

    set price(value: string) {
        this._price.textContent = value ? this._price.textContent = `${value} синапсов` : this._price.textContent = `Бесценно`;
    }
}