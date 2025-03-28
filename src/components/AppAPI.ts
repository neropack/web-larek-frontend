import { Api, ApiListResponse } from "./base/api";
import { IAppAPI } from "../types";
import { ICard, IOrder, IOrderResult } from "../types";

export class AppAPI extends Api implements IAppAPI {
    readonly cdn: string;

    constructor(baseUrl: string, cdn: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) => 
            data.items.map((item) => ({
                ...item,
			    image: this.cdn + item.image,
            }))
        )
    }

    orderCards(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then((data: IOrderResult) => data);
    }
}