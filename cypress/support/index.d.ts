// declare namespace Cypress {
//   interface Chainable {
//     /**
//      * Команда для авторизации пользователя
//      * @example cy.login()
//      */
//     login(): Chainable<void>;

//     /**
//      * Команда для добавления ингредиента по имени
//      * @example cy.addIngredientByName('Флюоресцентная булка R2-D3')
//      */
//     addIngredientByName(ingredientName: string): Chainable<void>;

//     /**
//      * Команда для добавления ингредиента по ID
//      * @example cy.addIngredientById('60666c42cc7b410027a1a9b2')
//      */
//     addIngredientById(ingredientId: string): Chainable<void>;

//     /**
//      * Команда для открытия модального окна ингредиента
//      * @example cy.openIngredientModal('Краторная булка N-200i')
//      */
//     openIngredientModal(ingredientName: string): Chainable<void>;

//     /**
//      * Команда для закрытия модального окна
//      * @example cy.closeModal()
//      */
//     closeModal(): Chainable<void>;

//     /**
//      * Команда для проверки номера заказа в модальном окне
//      * @example cy.checkOrderNumber('96969')
//      */
//     checkOrderNumber(orderNumber: string | number): Chainable<void>;
//   }
// }

declare namespace Cypress {
  interface Chainable {
    /**
     * Команда для авторизации пользователя
     * @example cy.login()
     */
    login(): Chainable<void>;

    /**
     * Команда для добавления ингредиента по имени
     * @example cy.addIngredientByName('Флюоресцентная булка R2-D3')
     */
    addIngredientByName(ingredientName: string): Chainable<void>;

    /**
     * Команда для добавления ингредиента по ID
     * @example cy.addIngredientById('60666c42cc7b410027a1a9b2')
     */
    addIngredientById(ingredientId: string): Chainable<void>;

    /**
     * Команда для удаления ингредиента из конструктора по ID
     * @example cy.removeIngredientById('60666c42cc7b410027a1a9b7')
     */
    removeIngredientById(ingredientId: string): Chainable<void>;

    /**
     * Команда для открытия модального окна ингредиента
     * @example cy.openIngredientModal('Краторная булка N-200i')
     */
    openIngredientModal(ingredientName: string): Chainable<void>;

    /**
     * Команда для закрытия модального окна
     * @example cy.closeModal()
     */
    closeModal(): Chainable<void>;

    /**
     * Команда для проверки номера заказа в модальном окне
     * @example cy.checkOrderNumber('96969')
     */
    checkOrderNumber(orderNumber: string | number): Chainable<void>;
  }
}
