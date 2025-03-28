import { IBasket, ICard, IOrder, OrderForm, PaymentMethod } from "../types";
import { IEvents } from "./base/events";

export class AppData {
    preview: ICard = null;
    catalog: ICard[];
    order: IOrder = {
        email: '',
        phone: '',
        address: '',
        payment: 'card',
        items: [],
    };

    formErrors: Partial<Record<keyof OrderForm, string>> = {};

    constructor(protected events: IEvents) {};

    setItems(items: ICard[]) {
        this.catalog = items;
        this.events.emit('items:change', this.catalog);
    }

    setModal(item: ICard) {
        this.preview = item;
        this.events.emit('preview:change', item);
    }

    inBasket(item: ICard) {
        return this.order.items.includes(item.id);
    }

    addToBasket(item: ICard) {
        this.order.items.push(item.id);
        this.events.emit('basket:change', this.order.items);
    }

    removeFromBasket(item:ICard) {
        this.order.items = this.order.items.filter((id) => id != item.id);
        this.events.emit('basket:change', this.order.items);
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
        this.events.emit(`order${field}:change`, { field, value });

        this.validateOrder();
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};

        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }

        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    clearOrder() {
        this.order = {
            email: '',
            phone: '',
            address: '',
            payment: 'card',
            items: [],
        }
        this.formErrors = {};
        this.events.emit('basket:change');
    }

    getTotalPrice() {
        return this.catalog.filter(card => this.order.items.includes(card.id)).reduce((sum, card) => sum + card.price, 0);
    }

    clearValidation() {
        // не чистим поле items, а то потеряем добавленные товары
        this.formErrors = {};
        this.order.email = '';
        this.order.phone = '';
        this.order.address = '';
        this.order.payment = 'card';
    }
}