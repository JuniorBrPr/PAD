//Context: Login with JWT
describe("Login", () => {

    beforeEach(() => {

        cy.visit("http://localhost:8080/#login");

        cy.intercept('POST', '/users/login', {
            statusCode: 200,
            body: {"accessToken": "test"},
        }).as('login');

        cy.intercept('GET', '/users/isAdmin', {
            statusCode: 200,
            body: {"isAdmin": false},
        }).as('isAdmin');
    });

    //Test: Validate login form
    it("Valid login form", () => {

        cy.get("#InputEmailAddress").should("exist");

        cy.get("#InputPassword").should("exist");

        cy.get(".login-form button").should("exist");
    });

    //Test: Successful login
    it("Successful login user", () => {

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

        cy.get('.nav-item.admin-only').should('not.be.visible');
    });

    //Test: Successful login
    it("Successful login administrator", () => {

        cy.intercept('GET', '/users/isAdmin', {
            statusCode: 200,
            body: {"isAdmin": true},
        }).as('isAdmin');

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

        cy.get('.nav-item.admin-only').should('be.visible');
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