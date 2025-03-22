import { ICard } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface IAppAPI {
    getCardList: () => Promise<void | ICard[]>;
}

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
}