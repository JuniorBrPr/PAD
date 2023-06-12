//Context: Adminpage
describe("Login", () => {

    beforeEach(() => {

        cy.visit("http://localhost:8080/#login");

        cy.intercept('POST', '/users/login', {
            statusCode: 200,
            body: {"accessToken": "test"},
        }).as('login');
    });

    //Test: Validate login form
    it("Valid login form", () => {

        cy.get("#InputEmailAddress").should("exist");

        cy.get("#InputPassword").should("exist");

        cy.get(".login-form button").should("exist");
    });

    //Test: Successful login
    it("Successful login", () => {

        cy.get("#InputEmailAddress").type("test");
        cy.get("#InputPassword").type("test");

        console.log(cy.get(".login-form button"));
        cy.get(".login-form button").click();

        cy.wait("@login");

        cy.get("@login").should((xhr) => {
            //The email should match what we typed earlier
            const body = xhr.request.body;
            expect(body.emailAddress).equals("test");

            //The password should match what we typed earlier
            expect(body.password).equals("test");
        });

        cy.url().should("contain", "#home");
    });

    //Test: Failed login
    it("Failed login", () => {

        cy.intercept('POST', '/users/login', {
            statusCode: 401,
            body: {
                reason: "ERROR"
            },
        }).as('login');

        cy.get("#InputEmailAddress").type("test");
        cy.get("#InputPassword").type("test");

        cy.get(".login-form button").click();

        cy.wait("@login");

        cy.get(".error").should("exist").should("contain", "ERROR");
    });
});