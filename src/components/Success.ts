import { IOrderResult, ISuccessAction } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Success extends Component<IOrderResult> {
    protected _total: HTMLElement;
    protected _close: HTMLButtonElement;

    constructor(protected container: HTMLElement, actions: ISuccessAction) {
        super(container);

        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        console.log(this._close)

        if(actions.onClick) {
            if (this._close) {
                this._close.addEventListener('click', actions.onClick);
            } else {
                this.container.addEventListener('click', actions.onClick);
            }
        }
    }

    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`)
    }
}