// интерфейс полей товара
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export type PaymentMethod = 'cash' | 'card';

export interface IOrderForm {
    method: PaymentMethod;
    address: string;
    email: string;
    phone: string;
}

export interface IPage {
    basketCounter: number;
    catalog: HTMLElement[];
}

export interface IModalData {
    content: HTMLElement;
}

export interface ICardAction {
    onClick: (event: MouseEvent) => void;
}

export interface IBasket {
    items: string[];
    price: number;
}