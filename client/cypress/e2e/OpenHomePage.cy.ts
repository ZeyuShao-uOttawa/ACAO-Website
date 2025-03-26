/// <reference types="cypress" />

describe('Home Page', () => {
    it('should load and the background image', () => {
        cy.visit('/');

        cy.get('.background-container').should('have.css', 'background-image');
    });

    it('should load and display the nav bar', () => {
        cy.visit('/');

        cy.get('.navbar').should('be.visible');
    });

    it('should load and display acao name', () => {
        cy.visit('/');

        cy.contains('Asian Canadians').should('be.visible');
    });
});