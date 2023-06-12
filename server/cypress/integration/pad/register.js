/**
 * Cypress test to test the registration page
 * @author Hanan Ouardi
 */
describe("Register", () => {
    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#register");
    });

    /**
     * Test: Validate registration form.
     *
     * This test validates the registration form by entering values in the form fields
     * Password doesn't match
     */
    it("Validate registration form", () => {
        const firstName = "Hanan";
        const lastName = "Oua";
        const email = "hellooo89@gmail.com";
        const password = "password1";
        const confirmPassword = "password2";

        // Intercept the registration request
        cy.intercept("POST", "/register", (req) => {
            req.reply({
                statusCode: 400, // passwords don't match
                body: { id: 123 }, // Set the response body as needed
            });
        }).as("registerRequest");

        cy.get("#inputFirstName").type(firstName);
        cy.get("#inputLastName").type(lastName);
        cy.get("#inputEmail").type(email);
        cy.get("#inputPassword").type(password);
        cy.get("#inputConfirmPassword").type(confirmPassword);
        cy.get(".btn").click();

        // Wait for the registration request to complete
         cy.wait("@registerRequest");

    });


    /**
     * Test: Register a new user
     *
     * This test registers a new user by entering valid values in the registration form fields
     * and verifies if the registration is successful.
     *
     */
    it("Register a new user", () => {
        const firstName = "hanan";
        const lastName = "oua";
        const email = "test35906@gmail.com";
        const password = "hello";

        // Intercept the registration request
        cy.intercept("POST", "/register", (req) => {
            req.reply({
                statusCode: 200, // Set the status code
                body: { id: 456 }, // Set the response body as needed
            });
        }).as("Register");

        cy.get("#inputFirstName").type(firstName);
        cy.get("#inputLastName").type(lastName);
        cy.get("#inputEmail").type(email);
        cy.get("#inputPassword").type(password);
        cy.get("#inputConfirmPassword").type(password);
        cy.get(".btn").click();

        // Wait for the registration request to complete
         cy.wait("@Register");
    });


})