//Context: Login
describe("Login", () => {
    const endpoint = "/users/login";

    //Run before each test in this context
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080/#login");
    });

    //Test: Validate login form
    it("Valid login form", () => {
        //Find the field for the email, check if it exists.
        cy.get("#InputEmailAddress").should("exist");

        //Find the field for the password, check if it exists.
        cy.get("#InputPassword").should("exist");

        //Find the button to login, check if it exists.
        cy.get(".login-form button").should("exist");
    });

    //Test: Successful login
    it("Successful login", () => {
        //Start a fake server
        cy.server();

        const mockedResponse = {"email": "test"};

        //Add a stub with the URL /users/login as a POST
        //Respond with a JSON-object when requested
        //Give the stub the alias: @login
        cy.intercept('POST', '/users/login', {
            statusCode: 200,
            body: mockedResponse,
        }).as('login');

        //Find the field for the email and type the text "test".
        cy.get("#InputEmailAddress").type("test");

        //Find the field for the password and type the text "test".
        cy.get("#InputPassword").type("test");

        //Find the button to login and click it
        console.log(cy.get(".login-form button"));
        cy.get(".login-form button").click();

        //Wait for the @login-stub to be called by the click-event.
        cy.wait("@login");

        //The @login-stub is called, check the contents of the incoming request.
        cy.get("@login").should((xhr) => {
            //The email should match what we typed earlier
            const body = xhr.request.body;
            expect(body.emailAddress).equals("test");

            //The password should match what we typed earlier
            expect(body.password).equals("test");
        });

        //After a successful login, the URL should now contain #welcome.
        cy.url().should("contain", "#welcome");
    });

    //Test: Failed login
    it("Failed login", () => {
        //Start a fake server
        cy.server();


        const mockedResponse = {
            reason: "ERROR"
        };

        //Add a stub with the URL /users/login as a POST
        //Respond with a JSON-object when requested and set the status-code tot 401.
        //Give the stub the alias: @login
        cy.intercept('POST', '/users/login', {
            statusCode: 401,
            body: mockedResponse,
        }).as('login');


        //Find the field for the Email and type the text "test".
        cy.get("#InputEmailAddress").type("test");

        //Find the field for the password and type the text "test".
        cy.get("#InputPassword").type("test");

        //Find the button to login and click it.
        cy.get(".login-form button").click();

        //Wait for the @login-stub to be called by the click-event.
        cy.wait("@login");

        //After a failed login, an element containing our error-message should be shown.
        cy.get(".error").should("exist").should("contain", "ERROR");
    });
});