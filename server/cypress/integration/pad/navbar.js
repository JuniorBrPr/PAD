// Context: Navbar
const mockedResponseLogin = {"token": "test"};
const mockedSurveyStatus = {"survey_status": 1};

describe("Navbar", () => {
    // Run before each test in this context
    beforeEach(() => {
        // Go to the specified URL
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

    // Test: Successful login
    it("Successful login", () => {
        // Start a fake server
        cy.server();



        // Intercept the request to get our user data and respond with mocked data
        cy.intercept('POST', '/users/login', {
            statusCode: 200,
            body: mockedResponseLogin,
        }).as('login');



        // Intercept the request to get survey status and respond with mocked data
        cy.intercept("GET", "/survey/status/*", {
            statusCode: 200,
            body: mockedSurveyStatus,
        }).as("surveyStatus");

        // Find the field for the email and type the text "test".
        cy.get("#InputEmailAddress").type("test");

        // Find the field for the password and type the text "test".
        cy.get("#InputPassword").type("test");

        // Find the button to login and click it
        console.log(cy.get(".login-form button"));
        cy.get(".login-form button").click();

        // Wait for the @login-stub to be called by the click-event.
        cy.wait("@login");

        // After a successful login, the URL should now contain #welcome.
        cy.url().should("contain", "#home");

        // isLoggedIn function test
        cy.get(".logged-in-only").should("not.have.class", "d-none");
        cy.get(".logged-out-only").should("have.class", "d-none");

        // you can visit the Activity page and check if it loads correctly
        cy.visit("http://localhost:8080/#weekPlanning");

        // Check if the dayBox class is visible which is a part of weekPlanning.html
        // Replace the selector with an appropriate one for your Activity page
        cy.get(".dayBox").should("be.visible");
    });
});