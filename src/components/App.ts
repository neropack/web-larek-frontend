import { IBasket, ICard, IOrder, OrderForm, PaymentMethod } from "../types";
import { IEvents } from "./base/events";

export class App {
    items: ICard[] = [];
    preview: ICard = null;
    basket: IBasket = {
        items: [],
        price: 0,
    }
    order: IOrder = {
        email: '',
        phone: '',
        address: '',
        payment: 'card',
        total: 0,
        items: [],
    }

    formErrors: Partial<Record<keyof OrderForm, string>> = {};

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

    setPaymentMethod(method: PaymentMethod) {
        this.order.payment = method;
    }

    setOrderField(field: keyof OrderForm, value: string) {
        if (field === 'payment') {
            this.setPaymentMethod(value as PaymentMethod);
        } else {
            this.order[field] = value;
        }

        console.log('hey')

        if (this.order.payment && this.validateOrder()) {
            this.order.total = this.basket.price;
            this.order.items = this.basket.items;
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};

        const email_regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+.[a-zA-Z0-9_-]+)/;

        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!email_regex.test(this.order.email)) {
            errors.email = 'Необходимо указать корректный email';
        }

        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        console.log(this.formErrors);
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    clearBusket() {
        this.items = [];
        this.basket.items = [];
        this.basket.price = 0;
        this.events.emit('basket:change');
    }
}