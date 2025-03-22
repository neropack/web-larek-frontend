import { ICard, ICardAction } from "../types";
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

    constructor(container: HTMLElement, actions?: ICardAction) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);

        this._image = container.querySelector('.card__image');
        this._category = container.querySelector('.card__category');
        this._price = container.querySelector('.card__price');
        this._button = container.querySelector('.card__button');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    // сеттеры данных карточки
    set id(value: string) {
        this.container.dataset.id = value;
    }

    get id():string {
        return this.container.dataset.id;
    }

    set title(value:string) {
        this.setText(this._title, value);
    }

    set image(value:string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value:string) {
        this.setText(this._category, value);
        this._category?.classList.add(`card__category${this._categoryColor.get(value)}`);
    }

    get price() {
        return this._price.textContent;
    }

    set price(value: string) {
        if (value) {
			this.setText(this._price, `${value} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}

        if (this._button) this._button.disabled = !value;
    }

    set button(value: string) {
        this.setText(this._button, value);
    }
}