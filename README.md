# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Интерфейс карточки товара

```
interface ICard {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

Интерфейс для модели корзины

```
interface IBasket {
    items: string[];
    price: number;
}
```

Интерфейс расширеннего API приложения для обработки входящих данных с сервера

```
interface IAppAPI {
    getCardList: () => Promise<void | ICard[]>;
    orderCards: (order: IOrder) => Promise<IOrderResult>;
}
```

Интерфейс составления валидного заказа

```
interface IOrder {
    payment: PaymentMethod;
    address: string;
    email: string;
    phone: string;
    items: string[];
    total: number;
}
```

Интерфейс содержащий индентификатор созданного заказа и количества списанной суммы

```
interface IOrderResult {
    id: string;
    total: number;
}
```

Интерфейсы описывающие события для модальных окон добавления карточки в корзину и результата заказа

```
interface ICardAction {
    onClick: (event: MouseEvent) => void;
}

interface ISuccessAction {
    onClick: (event: MouseEvent) => void;
}
```

Тип данных метода оплаты

```
type PaymentMethod = 'cash' | 'card';
```

Тип для валидации полей ввода

```
type OrderForm = Omit<IOrder, 'total' | 'items'>;
```

### Интерфейсы для отображения моделей данных

Интерфейс отображения модальных окон

```
interface IModalData {
    content: HTMLElement;
}
```

Интерфейс содержащий поля для отслеживания валидности введенных пользователем данных.

```
interface IForm {
    valid: boolean;
    errors: string[];
}
```

Интерфейс для отображения каталога карточек и количества товаров в корзине

```
interface IPage {
    basketCounter: number;
    catalog: HTMLElement[];
}
```

## Модели данных

### Класс `AppAPI`
Наследует класс `Api`.
взаимодействия с веб-API для работы с продуктами и заказами. В конструктор передается базовый адрес сервера, адрес хоста cdn для контента и опциональный объект с заголовками запросов. В конструкторе вызывается конструктор родительского класса Api с переданными параметрами.
Методы: 
- `getCardList` - Выполняет запрос для получения списка продуктов и обрабатывает полученные данные, добавляя к каждому элементу ссылку на изображение.
- `orderCards` - Выполняет запрос на оформление заказа и возвращает результат оформления.


### Класс `Component`
Базовый класс предназначен для управления компонентом.

Абстрактный класс который является базовым компонентом. Предоставляет ряд методов для работы с DOM элементами.<br> Конструктор принимает один параметр - контейнер типа HTMLElement, в котором компонент будет рендериться.
Методы:
- `setText` - Устанавливает текстовое содержимое элемента.
- `setImage` - Устанавливает изображение и альтернативный текст.
- `render` - Основной метод, который возвращает корневой DOM-элемент компонента.
Принимает необязательный параметр `data`, который можно использовать для обновления свойств компонента.

### Класс `View`
Класс наследуется от `Component` и добавляет поле `events` типа `IEvents`, которое используется для управления событиями компонента.
Конструктор принимает два параметра:`container` и `events`

## Компоненты представления

### Класс `Page`
Наследует класс `View\<IPage>`. Представляет компонент страницы с некоторыми элементами и функциональностью для управления ими.
Конструктор класса принимает контейнер страницы `container` типа `HTMLElement` и объект событий `events` типа `IEvents`.
В конструкторе вызывается конструктор родительского класса `View` с переданным контейнером и объектом событий.

Содержит:
- `basketCounter` - устанавливает значения счетчика.
- `catalog` - устанавливает содержимого каталога.

### Класс `CardData`
Наследует класс `Component\<ICard>`.Отвечает за отображение карточки и её информации. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать карточки разных вариантов верстки. Конструктор класса принимает контейнер карточки `container` типа `HTMLElement` и опциональные действия `actions` типа `ICardActions`. В конструкторе вызывается конструктор родительского класса `Component` с переданным контейнером.
Содержит:
- `title` - Устанавливает и возвращает заголовок карточки.
- `image` - Устанавливает изображение карточки.
- `category` - Устанавливает категорию карточки, а также добавляет соответствующий класс для стилизации.
- `price` - Устанавливает и возвращает цену карточки, а также блокирует кнопку, если цена не указана.
- `button` - Устанавливает надпись на кнопке карточки.
- `description` - Устанавливает описание карточки.

### Класс `Modal`
Наследует класс `View\<IModalData>`. Представляет компонент модального окна с возможностью открытия и закрытия, а также управления содержимым.
Конструктор класса принимает контейнер модального окна `container` типа `HTMLElement` и объект событий `events` типа `IEvents`. В конструкторе вызывается конструктор родительского класса `View` с переданным контейнером и объектом событий.

Содержит:
- `closeButton` - Приватное поле для хранения ссылки на элемент кнопки закрытия окна.
- `content` - Устанавливает новое содержимое модального окна, заменяя предыдущее содержимое.
- `handleMouseUp` - Метод обработки события закрытия модального окна при клике вне контейнера.
- `open` - Метод открывает модальное окно, добавляя ему класс `modal_active`, и генерирует событие `'modal:open'`.
- `close` - Метод закрывает модальное окно, удаляя класс `modal_active`, устанавливает содержимое модального окна в `null` и генерирует событие `'modal:close'`.

### Класс `Basket`
Наследует класс `View\<IBasket>`. Представляет компонент корзины с возможностью отображения списка товаров,<br> общей суммы и управления состоянием кнопки оформления заказа.\
Конструктор класса, который принимает объект events типа EventEmitter для управления событиями. Внутри конструктора вызывается конструктор родительского класса View с клонированным HTML-шаблоном корзины.

Содержит:
- `template` - Статическое поле, которое содержит HTML-шаблон корзины.
- `list` - Приватное поле для хранения ссылки на элемент корзины.
- `price` - Приватное поле для хранения ссылки на элемент корзины и установки цены.
- `button` - Приватное поле для хранения ссылки на элемент корзины.
- `items` - Метод для установки списка товаров в корзине. Если список не пустой, элементы списка заменяются внутри контейнера корзины. Если список пуст, вставляется элемент "Корзина пуста". Также обновляется состояние кнопки оформления заказа.
- `refreshIndex` - Метод для обновления нумерации добавленных товаров в корзину.

### Класс `Form`

Наследует класс `View\<IFormState>`. Представляет компонент формы с возможностью управления состоянием валидации и отображения ошибок. Конструктор класса принимает контейнер формы `container` типа `HTMLFormElement` и объект событий `events` типа `EventEmitter`. В конструкторе вызывается конструктор родительского класса View с переданным контейнером и объектом событий.

Содержит:
- `_submit` - Приватное поле для хранения ссылки на элемент кнопки отправки формы.
- `_errors` - Приватное поле для хранения ссылки на элемент отображения ошибки.
- `valid` - Установка состояния валидации формы
- `onInputChange` - Метод генерирует событие `change` с данными о поле формы, которое было изменено, и его значении.
- `valid` - Установка состояния валидации формы
- `errors` - Отображение ошибок.
- `render` - Метод принимает объект `state`, который содержит частичное состояние формы и обновляет состояние компонента.

### Класс `Order`
Наследует класс `Form\<OrderForm>`. Представляет форму заказа с возможностью выбора способа оплаты.
Конструктор класса, который принимает контейнер формы заказа `container` типа `HTMLFormElement` и объект событий `events` типа `EventEmitter`. В конструкторе вызывается конструктор родительского класса `Form` с переданным контейнером и объектом событий.

Содержит:
- `_paymentCard` и `_paymentCash` - Приватные поля для хранения ссылок на элементы кнопок выбора варианта оплаты.
- `payment` - Устанавливает выбранный метод оплаты и активирует соответствующую кнопку.
- `address` - Устанавливает адрес для доставки заказа.

### Класс `Contacts`
Наследует класс `Form\<OrderForm>`. Представляет форму для ввода контактной информации (электронной почты и номера телефона) при оформлении заказа.
Конструктор класса, который принимает контейнер формы контактной информации `container` типа `HTMLFormElement` и объект событий `events` типа `EventEmitter`. В конструкторе вызывается конструктор родительского класса `Form` с переданным контейнером и объектом событий.

Содержит:
- `email` - Устанавливает значение электронной почты в соответствующем поле формы.
- `phone` - Устанавливает значение номера телефона в соответствующем поле формы.

### Класс `Success`
Наследует класс `Component\<IOrderResult>`. Представляет компонент для отображения сообщения об успешном оформлении заказа.
Конструктор класса, который принимает контейнер элемента `container` типа `HTMLFormElement` и опциональные действия `actions` типа `ISuccessActions`. В конструкторе вызывается конструктор родительского класса `Component` с переданным контейнером.

Содержит:
- `_total` - Приватное поле для хранения ссылки на элемент разметки страницы с общей суммой заказа.
- `_close` - Приватное поле для хранения ссылки на элемент кнопки закрытия модального окна.
- `total` - Устанавливает значение общей суммы заказа.

### Класс `App`
Класс представляет хранилище данных приложения. Он содержит информацию о продуктах, корзине, предпросмотре товара, заказе и ошибках формы заказа. Класс также обеспечивает методы для управления этими данными и взаимодействия с ними через события.
Конструктор класса, который принимает объект событий `events`. В конструкторе инициализируются поля `items`, `basket`, `preview` и `order`, а также `formErrors`.

Содержит:
- `items` - Содержит массив карточек добавленных в корзину.
- `preview` - Содержит карточку, переданную для отображения в модальном окне.
- `basket` - Содержит данные для отображения карточек в корзине.
- `order` - Содержит информацию вводимую клиентом.
- `formErrors` - Содержит ошибки при заполнении форм.
- `setItems(items: ICard[])` - Устанавливает список продуктов и генерирует событие изменения списка.
- `setModal(item: ICard)` - Устанавливает предпросмотр товара и генерирует событие изменения предпросмотра.
- `inBasket(item: ICard)` - Проверяет, содержится ли товар в корзине.
- `addToBasket(item: ICard)` - Добавляет товар в корзину и генерирует событие изменения корзины.
- `removeFromBasket(item: ICard)` - Удаляет товар из корзины и генерирует событие изменения корзины.
- `setPaymentMethod(method: PaymentMethod)` - Устанавливает метод оплаты для заказа.
- `setOrderField(field: keyof OrderForm, value: string)` - Устанавливает значения полей заказа и проверяет их валидность.
- `validateOrder()` - Проверяет валидность заказа и генерирует событие изменения ошибок формы заказа.
- `clearBasket()` - Очищает корзину и генерирует событие изменения корзины.

## Описание событий

### Класс `EventEmitter`
Является классом-посредником (Presenter) между классами отображения (View) и классом модели данных (Model)
Реализует интерфейс `IEvents`. В параметры конструктора класса ничего не передается.

Содержит:

- `events` - переменная к которую будут кэшироваться события.
- `on()` - функция установки обработчика на событие.
- `off()` - функция снятия обработчика с события.
- `emit()` - функция инициирования события с данными.
- `onAll` - функция прослушивания всех событий.
- `offAll` - функция сброса всех обработчиков.
- `trigger` - функция создающая коллбек триггер, генерирующий событие при вызове.

*Список всех событий, которые могут генерироваться в системе:*\
*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `items:change` - Вызывается при изменении списка товаров.
- `card:select` - Вызывается при нажатии на карточку товара.
- `preview:change` - Вызывается при изменении предварительного просмотра товара.
- `modal:open` - Вызывается при открытии модального окна.
- `modal:close` - Вызывается при закрытии модального окна.
- `basket:open` - Вызывается при открытии корзины.
- `basket:change` - Вызывается при изменении содержимого корзины.
- `order:open` - Вызывается при открытии оформления заказа.
- `formErrors:change` - Вызывается при изменении ошибок в форме.
- `order.\*:change` - При срабатывании события вызывается функция, которая устанавливает новое значение для указанного поля в форме оформления заказа.
- `order:submit` - Вызывается при нажатии кнопки продолжения заполнения заказа.
- `contacts.\*:change` - При срабатывании события вызывается функция, которая устанавливает новое значение для указанного поля в форме оформления заказа.
- `contacts:submit` - Вызывается при отправке контактной информации.
