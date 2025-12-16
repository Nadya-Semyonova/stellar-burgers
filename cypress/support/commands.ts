/// <reference types="cypress" />

Cypress.Commands.add('login', () => {
  const accessToken = 'test-access-token-123';
  const refreshToken = 'test-refresh-token-456';

  cy.setCookie('accessToken', accessToken);
  cy.window().then((win) => {
    win.localStorage.setItem('refreshToken', refreshToken);
  });
});

Cypress.Commands.add('addIngredientByName', (ingredientName) => {
  // Ищем карточку ингредиента по имени и кликаем кнопку "Добавить" внутри нее
  cy.contains('li', ingredientName).within(() => {
    cy.contains('button', 'Добавить').click();
  });
});

Cypress.Commands.add('addIngredientById', (ingredientId) => {
  cy.get('li').each(($li) => {
    if ($li.find(`a[href*="/ingredients/${ingredientId}"]`).length > 0) {
      cy.wrap($li).within(() => {
        cy.contains('button', 'Добавить').click();
      });
    }
  });
});

Cypress.Commands.add('removeIngredientById', (ingredientId: string) => {
  cy.get(`[data-cy="constructor-ingredient-${ingredientId}"]`)
    .find('[data-cy="remove-ingredient"]')
    .click();
});

Cypress.Commands.add('openIngredientModal', (ingredientName) => {
  cy.contains('li', ingredientName).find('a').first().click();
});

Cypress.Commands.add('closeModal', () => {
  cy.get('#modals').within(() => {
    // Кликаем на кнопку закрытия (крестик)
    cy.get('[data-cy="modal-close"]').click();
  });
});

Cypress.Commands.add('checkOrderNumber', (orderNumber) => {
  cy.get('#modals').within(() => {
    cy.contains(orderNumber).should('be.visible');
  });
});
