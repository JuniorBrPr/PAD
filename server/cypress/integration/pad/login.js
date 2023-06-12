//Context: Login with JWT
describe("Login", () => {

    beforeEach(() => {

        cy.intercept('GET', '/home/data', {
            statusCode: 200,
            body: {
                "video": "https://www.youtube.com/embed/IfdFyeZTrFI",
                "board_message": "Blijf gezond eten!"
            }
        }).as('getData');

        cy.intercept('POST', '/users/login', {
            statusCode: 200,
            body: {"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwMCwiZmlyc3RuYW1lIjoiSm9leVBlcm1LZXkiLCJyb2xlIjoxfQ.xXSJo2LZFyLbR_HbSg1Dwd83VuODwKyXKwu0uPrJ76Q"},
        }).as('login');

        cy.intercept('GET', '/users/isAdmin', {
            statusCode: 200,
            body: {"isAdmin": false},
        }).as('isAdmin');

        cy.visit("http://localhost:8080/#login");
    });

    //Test: Validate login form
    it("Valid login form", () => {

        cy.get("#InputEmailAddress").should("exist");

        cy.get("#InputPassword").should("exist");

        cy.get(".login-form button").should("exist");
    });

    //Test: Successful login
    it("Successful login", () => {

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