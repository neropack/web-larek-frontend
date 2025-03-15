import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL } from './utils/constants';
import { ICard } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardData } from './components/CardsData';
import { App } from './components/App';
import { AppAPI } from './components/AppAPI';

// темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');


const events = new EventEmitter();
const api = new AppAPI(API_URL);

// модель данных приложения
const app = new App(events);

// глобальные контейнеры

events.onAll(({ eventName, data}) => {
    console.log(eventName, data);
})

api.getCardList()
    .then(app.setItems.bind(app))
    .catch((err) => {
        console.log(err);
    })

events.on('items:change', (items: ICard[]) => {
    items.map((item) => {
        const card = new CardData(cloneTemplate(cardCatalogTemplate));
        console.log(card);
    })
})