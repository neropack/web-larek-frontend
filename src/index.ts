import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { ICard } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardData } from './components/CardsData';
import { App } from './components/App';
import { AppAPI } from './components/AppAPI';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';

// темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const cardPreviwTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');


const events = new EventEmitter();
const api = new AppAPI(API_URL, CDN_URL);

// модель данных приложения
const app = new App(events);

// глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(modalTemplate, events);
const basket = new Basket(events);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

api.getCardList()
    .then(app.setItems.bind(app))
    .catch((err) => {
        console.log(err);
    });

events.on('items:change', (items: ICard[]) => {
    page.catalog = items.map((item) => {
        const card = new CardData(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render(item);
    });
});

events.on('card:select', (item: ICard) => {
    app.setModal(item);
});

events.on('preview:change', (item: ICard) => {
    const card = new CardData(cloneTemplate(cardPreviwTemplate), {
        onClick: () => {
            if (app.inBasket(item)) {
                app.removeFromBasket(item);
                card.button = 'В корзину';
            } else {
                app.addToBasket(item);
                card.button = 'Удалить из корзины';
            }
        }
    });

    card.button = app.inBasket(item) ? 'Удалить из коризны' : 'В корзину';
    modal.render({
        content: card.render(item),
    });
    modal.open();
});

events.on('modal:open', () => {
    page.locked = true;
})

events.on('modal:close', () => {
    page.locked = false;
})

events.on('basket:open', () => {
    modal.render({ content: basket.render() });
    modal.open();
})

events.on('basket:change', () => {
    page.counter = app.basket.items.length;

    basket.items = app.basket.items.map((id) => {
        const item = app.items.find((item) => item.id === id);
        const card = new CardData(cloneTemplate(cardBasketTemplate), {
            onClick: () => app.removeFromBasket(item),
        });
        console.log(item);
        return card.render(item);
    })

    basket.price = app.basket.price;
})