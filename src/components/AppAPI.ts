import { ICard } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface IAppAPI {
    getCardList: () => Promise<void | ICard[]>;
}

export class AppAPI extends Api implements IAppAPI {
    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    getCardList(): Promise<ICard[]> {
        return this.get('/product').then((data: ApiListResponse<ICard>) => 
            data.items.map((item) => ({
                ...item
            }))
        )
    }
}