/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
        loginUI(email: string, password: string): Chainable<void>;
    }
}