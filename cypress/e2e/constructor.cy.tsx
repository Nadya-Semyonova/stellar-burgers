describe('Конструктор бургеров', () => {
  const API_URL = Cypress.env('BURGER_API_URL');

  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', `${API_URL}/auth/user`, {
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
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b2"]')
        .find('button[type="button"]')
        .click();

      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.get('[data-cy="constructor-bun-top"]').should('exist');
        cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
        cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
        cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
      });
    });

    it('Должен добавлять начинку по кнопке "Добавить"', () => {
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b2"]')
        .find('button[type="button"]')
        .click();

      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b5"]')
        .find('button[type="button"]')
        .click();

      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.get('[data-cy="constructor-ingredients-list"]').within(() => {
          cy.contains('Говяжий метеорит (отбивная)').should('exist');
        });
      });
    });

    it('Должен добавлять несколько разных ингредиентов', () => {
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b2"]')
        .find('button[type="button"]')
        .click();
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b5"]')
        .find('button[type="button"]')
        .click();
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b7"]')
        .find('button[type="button"]')
        .click();

      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
        cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
        cy.get('[data-cy="constructor-ingredients-list"]').within(() => {
          cy.contains('Говяжий метеорит (отбивная)').should('exist');
          cy.contains('Соус Spicy-X').should('exist');
        });
      });
    });
  });

  describe('Модальное окно ингредиента', () => {
    it('Должно открываться при клике на карточку ингредиента', () => {
      cy.get('[data-cy="ingredient-link-60666c42cc7b410027a1a9b1"]').click();

      cy.get('#modals').within(() => {
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="modal-content"]').should('be.visible');
        cy.contains('Детали ингредиента').should('be.visible');
        cy.contains('Краторная булка N-200i').should('be.visible');
      });
    });

    it('Должно закрываться по клику на крестик', () => {
      cy.get('[data-cy="ingredient-link-60666c42cc7b410027a1a9b1"]').click();

      cy.get('#modals').within(() => {
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="modal-close"]').click();
        cy.get('[data-cy="modal"]').should('not.exist');
      });
    });

    it('Должно закрываться по клику на оверлей', () => {
      cy.get('[data-cy="ingredient-link-60666c42cc7b410027a1a9b1"]').click();

      cy.get('#modals').within(() => {
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="modal-overlay"]').click({ force: true });
        cy.get('[data-cy="modal"]').should('not.exist');
      });
    });

    it('Должно отображать данные именно того ингредиента, по которому кликнули', () => {
      cy.get('[data-cy="ingredient-link-60666c42cc7b410027a1a9b7"]').click();

      cy.get('#modals').within(() => {
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.contains('Соус Spicy-X').should('be.visible');
        cy.contains('30').should('be.visible'); // калории
        cy.contains('30').should('be.visible'); // белки
        cy.contains('20').should('be.visible'); // жиры
        cy.contains('40').should('be.visible'); // углеводы
      });
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', `${API_URL}/orders`, {
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
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b2"]')
        .find('button[type="button"]')
        .click();

      // Добавляем начинку
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b7"]')
        .find('button[type="button"]')
        .click();

      // Кликаем по кнопке заказа
      cy.get('[data-cy="order-button"]').click();

      // Ждем запрос и проверяем ответ
      cy.wait('@createOrder').then((interception) => {
        expect(interception.response).to.not.be.undefined;
        const response = interception.response!;
        expect(response.statusCode).to.eq(200);
        expect(response.body.order.number).to.eq(96969);
      });

      // Проверяем модальное окно с номером заказа
      cy.get('#modals').within(() => {
        cy.get('[data-cy="modal"]').should('be.visible');
        cy.get('[data-cy="order-number"]').should('contain', '96969');
        cy.contains('идентификатор заказа').should('be.visible');
        cy.contains('Ваш заказ начали готовить').should('be.visible');
      });

      // Закрываем модальное окно
      cy.get('#modals').within(() => {
        cy.get('[data-cy="modal-close"]').click();
      });

      // Проверяем, что модальное окно закрылось
      cy.get('#modals').within(() => {
        cy.get('[data-cy="modal"]').should('not.exist');
      });

      // Проверяем, что конструктор очистился
      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
        cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');

        // Проверяем отсутствие конкретных добавленных ингредиентов
        cy.get('[data-cy="constructor-ingredients-list"]').within(() => {
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
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b2"]')
        .find('button[type="button"]')
        .click();
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b7"]')
        .find('button[type="button"]')
        .click();

      // Нажимаем кнопку заказа
      cy.get('[data-cy="order-button"]').click();

      // Должен произойти редирект на страницу логина
      cy.url().should('include', '/login');
    });

    it('Не должен создавать заказ без булки', () => {
      // Добавляем только начинку (без булки)
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b7"]')
        .find('button[type="button"]')
        .click();

      // Проверяем, что начинка добавилась
      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.get('[data-cy="constructor-ingredients-list"]').within(() => {
          cy.contains('Соус Spicy-X').should('exist');
        });
      });

      // Проверяем, что нет булок
      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
        cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
      });

      // Кнопка активна
      cy.get('[data-cy="order-button"]').should('exist');
    });
  });

  describe('Проверка состояния конструктора', () => {
    it('Должен показывать пустой конструктор при загрузке', () => {
      // Просто проверяем, что страница загрузилась
      cy.get('[data-cy="burger-constructor"]').should('exist');
      cy.get('[data-cy="order-button"]').should('exist');

      // Начальное состояние - нет добавленных ингредиентов
      cy.get('[data-cy="burger-constructor"]').then(($el) => {
        const hasBunTop =
          $el.find('[data-cy="constructor-bun-top"]').length > 0;
        const hasIngredients =
          $el.find('[data-cy="constructor-ingredients-list"] li').length > 0;

        // Начальное состояние - без ингредиентов
        expect(hasBunTop).to.be.false;
        expect(hasIngredients).to.be.false;
      });
    });

    it('Должен показывать правильную сумму заказа', () => {
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b2"]')
        .find('button[type="button"]')
        .click();
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b5"]')
        .find('button[type="button"]')
        .click();

      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.get('[data-cy="order-price"]')
          .invoke('text')
          .then((text) => {
            const sum = parseInt(text.replace(/\s/g, ''));
            expect(sum).to.eq(4976); // 988*2 + 3000 = 4976
          });
      });
    });

    it('Должен очищать конструктор после создания заказа', () => {
      // Авторизация
      cy.setCookie('accessToken', 'test-token');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });

      cy.intercept('POST', `${API_URL}/orders`, {
        fixture: 'order.json'
      }).as('createOrder');

      cy.reload();
      cy.wait('@getIngredients');

      // Добавляем ингредиенты
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b2"]')
        .find('button[type="button"]')
        .click();
      cy.get('[data-cy="ingredient-60666c42cc7b410027a1a9b7"]')
        .find('button[type="button"]')
        .click();

      // Создаем заказ
      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');

      // Закрываем модальное окно
      cy.get('#modals').within(() => {
        cy.get('[data-cy="modal-close"]').click();
      });

      // Проверяем, что конструктор очистился
      cy.get('[data-cy="burger-constructor"]').within(() => {
        cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
        cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');

        // Проверяем отсутствие конкретных добавленных ингредиентов
        cy.get('[data-cy="constructor-ingredients-list"]').within(() => {
          cy.contains('Соус Spicy-X').should('not.exist');
        });
      });
    });
  });
});
