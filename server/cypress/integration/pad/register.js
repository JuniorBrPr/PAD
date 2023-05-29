/**
 * Doel: Cypress test om de registratie pagina te testen
 * @author Hanan Ouardi
 */

//Context: Register
describe("Register", () => {
    const endpoint = "/register";

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#register");
    });

    //Test: Validate register form
    it("Register a new user", () =>{
        cy.get("#inputFirstName").type('hanan')
        cy.get("#inputLastName").type('oua')
        cy.get("#inputEmail").type('hanan@gmail.com')
        cy.get("#inputPassword").type('hello')
        cy.get("#inputConfirmPassword").type('hello')
        cy.get('.btn').click()
    });

})