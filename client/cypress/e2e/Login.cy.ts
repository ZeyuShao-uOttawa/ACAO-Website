/// <reference types="cypress" />

describe('Website', () => {
    it('should allow user to login with correct credentials', () => {
        cy.visit('/');

        cy.loginUI('admin@admin.com', 'admin');

        cy.window().its('localStorage.authToken').should('exist');
    });

    it('should not let user login if email is invalid', () => {
        cy.visit('/');

        cy.get('#signIn').click();
        cy.get('#email').type('test');
        cy.get('#password').type('test');

        cy.get('#invalid-email').should('be.visible');
    });

    it('should not let user login if password and email combination is wrong', () => {
        cy.visit('/');

        cy.loginUI('test@test.com', 'test');

        cy.on('window:alert', (text) => {
            expect(text).to.equal('Invalid credentials');
        });
    });
});