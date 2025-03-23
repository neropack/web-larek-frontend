import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { ICard, OrderForm } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardData } from './components/CardsData';
import { App } from './components/App';
import { AppAPI } from './components/AppAPI';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/Success';

// темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const cardPreviwTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const events = new EventEmitter();
const api = new AppAPI(API_URL, CDN_URL);

// модель данных приложения
const app = new App(events);

// глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(modalTemplate, events);
const basket = new Basket(events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

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
    basket.refreshIndex();
    modal.open();
})

events.on('basket:change', () => {
    page.counter = app.basket.items.length;

    basket.items = app.basket.items.map((id) => {
        const item = app.items.find((item) => item.id === id);
        const card = new CardData(cloneTemplate(cardBasketTemplate), {
            onClick: () => app.removeFromBasket(item),
        });
        return card.render(item);
    })
    basket.refreshIndex();
    basket.price = app.basket.price;
})

events.on('order:open', () => {
    modal.render({ content: order.render({
        payment: 'card',
        address: '',
        valid: false,
        errors: [],
    }) });
    modal.open();
})

events.on('formErrors:change', (errors: Partial<OrderForm>) => {
    const { payment, address, email, phone } = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
})

events.on(
	/^order\..*:change/,
	(data: { field: keyof OrderForm; value: string }) => {
		app.setOrderField(data.field, data.value);
	}
);

events.on('order:submit', () => {
    modal.render({ content: contacts.render({
        email: '',
        phone: '',
        valid: false,
        errors: [],
    })})
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof OrderForm; value: string }) => {
		app.setOrderField(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
    api.orderCards(app.order)
        .then(() => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                }
            })
            app.clearBusket();
            events.emit('basket:change');
            modal.render({
                content: success.render({ total: app.order.total })
            })
            modal.open();
        })
        .catch((err) => {
            console.log(err);
        })
})