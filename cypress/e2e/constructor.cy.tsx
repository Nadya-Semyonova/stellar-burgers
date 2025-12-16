describe('Конструктор бургеров', () => {
  const SELECTORS = {
    // Индикаторы конструктора
    BURGER_CONSTRUCTOR: '[data-cy="burger-constructor"]',
    CONSTRUCTOR_BUN_TOP: '[data-cy="constructor-bun-top"]',
    CONSTRUCTOR_BUN_BOTTOM: '[data-cy="constructor-bun-bottom"]',
    CONSTRUCTOR_INGREDIENTS_LIST: '[data-cy="constructor-ingredients-list"]',
    ORDER_BUTTON: '[data-cy="order-button"]',
    ORDER_PRICE: '[data-cy="order-price"]',

    // Модальные окна
    MODALS_CONTAINER: '#modals',
    MODAL: '[data-cy="modal"]',
    MODAL_CLOSE: '[data-cy="modal-close"]',
    MODAL_OVERLAY: '[data-cy="modal-overlay"]',
    MODAL_CONTENT: '[data-cy="modal-content"]',
    ORDER_NUMBER: '[data-cy="order-number"]',

    // Ингредиенты
    INGREDIENTS: {
      KATOR_BUN: '60666c42cc7b410027a1a9b1', // Краторная булка
      FLUORESCENT_BUN: '60666c42cc7b410027a1a9b2', // Флюоресцентная булка
      BEEF_METEORITE: '60666c42cc7b410027a1a9b5', // Говяжий метеорит
      BIO_PATTY: '60666c42cc7b410027a1a9b6', // Биокотлета из марсианской Магнолии
      SPICY_SAUCE: '60666c42cc7b410027a1a9b7', // Соус Spicy-X
      MOLLUSK_MEAT: '60666c42cc7b410027a1a9b4' // Мясо бессмертных моллюсков
    }
  };

  // Вспомогательные функции для создания селекторов
  const getIngredientSelector = (ingredientId: string) =>
    `[data-cy="ingredient-${ingredientId}"]`;

  const getIngredientLinkSelector = (ingredientId: string) =>
    `[data-cy="ingredient-link-${ingredientId}"]`;

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  describe('Добавление ингредиентов', () => {
    it('Должен добавлять булку по кнопке "Добавить"', () => {
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.FLUORESCENT_BUN))
        .find('button[type="button"]')
        .click();

      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('exist');
        cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('exist');
        cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
        cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
      });
    });

    it('Должен добавлять начинку по кнопке "Добавить"', () => {
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.FLUORESCENT_BUN))
        .find('button[type="button"]')
        .click();

      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.BEEF_METEORITE))
        .find('button[type="button"]')
        .click();

      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS_LIST).within(() => {
          cy.contains('Говяжий метеорит (отбивная)').should('exist');
        });
      });
    });

    it('Должен добавлять несколько разных ингредиентов', () => {
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.FLUORESCENT_BUN))
        .find('button[type="button"]')
        .click();
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.BEEF_METEORITE))
        .find('button[type="button"]')
        .click();
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.SPICY_SAUCE))
        .find('button[type="button"]')
        .click();

      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
        cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS_LIST).within(() => {
          cy.contains('Говяжий метеорит (отбивная)').should('exist');
          cy.contains('Соус Spicy-X').should('exist');
        });
      });
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('Должно открываться при клике на карточку ингредиента', () => {
      cy.get(
        getIngredientLinkSelector(SELECTORS.INGREDIENTS.KATOR_BUN)
      ).click();

      cy.get(SELECTORS.MODALS_CONTAINER).within(() => {
        cy.get(SELECTORS.MODAL).should('be.visible');
        cy.get(SELECTORS.MODAL_CONTENT).should('be.visible');
        cy.contains('Детали ингредиента').should('be.visible');
        cy.contains('Краторная булка N-200i').should('be.visible');
      });
    });

    it('Должно закрываться по клику на крестик', () => {
      cy.get(
        getIngredientLinkSelector(SELECTORS.INGREDIENTS.KATOR_BUN)
      ).click();

      cy.get(SELECTORS.MODALS_CONTAINER).within(() => {
        cy.get(SELECTORS.MODAL).should('be.visible');
        cy.get(SELECTORS.MODAL_CLOSE).click();
        cy.get(SELECTORS.MODAL).should('not.exist');
      });
    });

    it('Должно закрываться по клику на оверлей', () => {
      cy.get(
        getIngredientLinkSelector(SELECTORS.INGREDIENTS.KATOR_BUN)
      ).click();

      cy.get(SELECTORS.MODALS_CONTAINER).within(() => {
        cy.get(SELECTORS.MODAL).should('be.visible');
        cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
        cy.get(SELECTORS.MODAL).should('not.exist');
      });
    });

    it('Должно отображать данные именно того ингредиента, по которому кликнули', () => {
      cy.get(
        getIngredientLinkSelector(SELECTORS.INGREDIENTS.SPICY_SAUCE)
      ).click();

      cy.get(SELECTORS.MODALS_CONTAINER).within(() => {
        cy.get(SELECTORS.MODAL).should('be.visible');
        cy.contains('Соус Spicy-X').should('be.visible');

        cy.contains('30').should('be.visible'); // калории (из фикстуры: "calories": 30)
        cy.contains('30').should('be.visible'); // белки (из фикстуры: "proteins": 30)
        cy.contains('20').should('be.visible'); // жиры (из фикстуры: "fat": 20)
        cy.contains('40').should('be.visible'); // углеводы (из фикстуры: "carbohydrates": 40)
      });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', 'api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      cy.setCookie('accessToken', 'test-access-token-123');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token-456');
      });

      cy.reload();
      cy.wait('@getIngredients');
    });

    it('Должен создавать заказ с правильным номером', () => {
      // Добавляем булку
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.FLUORESCENT_BUN))
        .find('button[type="button"]')
        .click();

      // Добавляем начинку
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.SPICY_SAUCE))
        .find('button[type="button"]')
        .click();

      // Кликаем по кнопке заказа
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Ждем запрос и проверяем ответ
      cy.wait('@createOrder').then((interception) => {
        expect(interception.response).to.not.be.undefined;
        const response = interception.response!;
        expect(response.statusCode).to.eq(200);

        expect(response.body.success).to.be.true;
        expect(response.body.order.number).to.eq(96969);
        expect(response.body.name).to.eq(
          'Био-марсианский флюоресцентный бургер'
        );
      });

      // Проверяем модальное окно с номером заказа
      cy.get(SELECTORS.MODALS_CONTAINER).within(() => {
        cy.get(SELECTORS.MODAL).should('be.visible');
        cy.get(SELECTORS.ORDER_NUMBER).should('contain', '96969');
        cy.contains('идентификатор заказа').should('be.visible');
        cy.contains('Ваш заказ начали готовить').should('be.visible');
      });

      // Закрываем модальное окно
      cy.get(SELECTORS.MODALS_CONTAINER).within(() => {
        cy.get(SELECTORS.MODAL_CLOSE).click();
      });

      // Проверяем, что модальное окно закрылось
      cy.get(SELECTORS.MODALS_CONTAINER).within(() => {
        cy.get(SELECTORS.MODAL).should('not.exist');
      });

      // Проверяем, что конструктор очистился
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
        cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');

        // Проверяем отсутствие конкретных добавленных ингредиентов
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS_LIST).within(() => {
          cy.contains('Соус Spicy-X').should('not.exist');
        });
      });
    });

    it('Не должен создавать заказ без авторизации', () => {
      // Очищаем токены
      cy.clearCookies();
      cy.window().then((win) => {
        win.localStorage.clear();
      });
      cy.reload();
      cy.wait('@getIngredients');

      // Добавляем ингредиенты
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.FLUORESCENT_BUN))
        .find('button[type="button"]')
        .click();
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.SPICY_SAUCE))
        .find('button[type="button"]')
        .click();

      // Нажимаем кнопку заказа
      cy.get(SELECTORS.ORDER_BUTTON).click();

      // Должен произойти редирект на страницу логина
      cy.url().should('include', '/login');
    });

    it('Не должен создавать заказ без булки', () => {
      // Добавляем только начинку (без булки)
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.SPICY_SAUCE))
        .find('button[type="button"]')
        .click();

      // Проверяем, что начинка добавилась
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS_LIST).within(() => {
          cy.contains('Соус Spicy-X').should('exist');
        });
      });

      // Проверяем, что нет булок
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
        cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');
      });

      // Кнопка активна
      cy.get(SELECTORS.ORDER_BUTTON).should('exist');
    });
  });

  describe('Проверка состояния конструктора', () => {
    it('Должен показывать пустой конструктор при загрузке', () => {
      // Просто проверяем, что страница загрузилась
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).should('exist');
      cy.get(SELECTORS.ORDER_BUTTON).should('exist');

      // Начальное состояние - нет добавленных ингредиентов
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).then(($el) => {
        const hasBunTop = $el.find(SELECTORS.CONSTRUCTOR_BUN_TOP).length > 0;
        const hasIngredients =
          $el.find(`${SELECTORS.CONSTRUCTOR_INGREDIENTS_LIST} li`).length > 0;

        // Начальное состояние - без ингредиентов
        expect(hasBunTop).to.be.false;
        expect(hasIngredients).to.be.false;
      });
    });

    it('Должен показывать правильную сумму заказа', () => {
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.FLUORESCENT_BUN))
        .find('button[type="button"]')
        .click();
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.BEEF_METEORITE))
        .find('button[type="button"]')
        .click();

      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.ORDER_PRICE)
          .invoke('text')
          .then((text) => {
            const sum = parseInt(text.replace(/\s/g, ''));

            expect(sum).to.eq(4976);
          });
      });
    });

    it('Должен показывать правильную сумму для другого сочетания ингредиентов', () => {
      // Тест с другими ингредиентами для проверки
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.KATOR_BUN))
        .find('button[type="button"]')
        .click();
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.SPICY_SAUCE))
        .find('button[type="button"]')
        .click();

      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.ORDER_PRICE)
          .invoke('text')
          .then((text) => {
            const sum = parseInt(text.replace(/\s/g, ''));

            expect(sum).to.eq(2600);
          });
      });
    });

    it('Должен очищать конструктор после создания заказа', () => {
      // Авторизация
      cy.setCookie('accessToken', 'test-token');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      cy.intercept('POST', 'api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      cy.reload();
      cy.wait('@getIngredients');

      // Добавляем ингредиенты
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.FLUORESCENT_BUN))
        .find('button[type="button"]')
        .click();
      cy.get(getIngredientSelector(SELECTORS.INGREDIENTS.SPICY_SAUCE))
        .find('button[type="button"]')
        .click();

      // Создаем заказ
      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.wait('@createOrder');

      // Закрываем модальное окно
      cy.get(SELECTORS.MODALS_CONTAINER).within(() => {
        cy.get(SELECTORS.MODAL_CLOSE).click();
      });

      // Проверяем, что конструктор очистился
      cy.get(SELECTORS.BURGER_CONSTRUCTOR).within(() => {
        cy.get(SELECTORS.CONSTRUCTOR_BUN_TOP).should('not.exist');
        cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('not.exist');

        // Проверяем отсутствие конкретных добавленных ингредиентов
        cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS_LIST).within(() => {
          cy.contains('Соус Spicy-X').should('not.exist');
        });
      });
    });
  });
});
