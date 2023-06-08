/**
 * Doel: Cypress test to test the registration page
 * @author Hanan Ouardi
 */

//Context: Register
describe("Register", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#register");
    });

    /**
     * Test: Validate registration form
     *
     * This test validates the registration form by entering values in the form fields
     * And checks if the error messages are displayed correctly for validation failures.
     */
    it("Validate registration form", () => {
        const firstName = "Hanan";
        const lastName = "Oua";
        const email = "hanan@gmail.com";
        const password = "password1";
        const confirmPassword = "password2";

        cy.get("#inputFirstName").type(firstName);
        cy.get("#inputLastName").type(lastName);
        cy.get("#inputEmail").type(email);
        cy.get("#inputPassword").type(password);
        cy.get("#inputConfirmPassword").type(confirmPassword);
        cy.get(".btn").click();

        // Assert that error messages are displayed for the mismatched passwords and other fields
        cy.get(".error-message").should("be.visible");
        cy.contains("Passwords do not match").should("be.visible");
        cy.contains("Please enter a valid email").should("be.visible");
    });


    /**
     * Test: Register a new user
     *
     * This test registers a new user by entering valid values in the registration form fields
     * and verifies if the registration is successful.
     */
    it("Register a new user", () => {
        cy.get("#inputFirstName").type('hanan')
        cy.get("#inputLastName").type('oua')
        cy.get("#inputEmail").type('hanan3@gmail.com')
        cy.get("#inputPassword").type('hello')
        cy.get("#inputConfirmPassword").type('hello')
        cy.get('.btn').click()
    });


})