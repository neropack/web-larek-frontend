// интерфейс полей товара
export interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ApiResponse {
    items: IProduct[];
}

export interface IProduct {
    id: string;
    title: string;
}

export interface IOrderForm {
    method: string;
    address: string;
    email: string;
    phone: string;
}