/**
 * Cypress test suite for the Profile page.
 */
describe("Profile", () => {
    // Run before each test in this context
    beforeEach(() => {
        //Start a fake server
        cy.server();

        const mockedResponse = {"accessToken": "test"};
        cy.intercept('POST', '/users/login', {
            statusCode: 200,
            body: mockedResponse,
        }).as('login');

        cy.intercept('POST', '/users/admin', {
            statusCode: 200,
            body: false,
        }).as('isAdmin');

        cy.visit('http://localhost:8080/#login')
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

        // Intercept the request to get our user data and respond with mocked data
        cy.intercept('GET', '/profile/userGoals', {
            statusCode: 200,
            body: {
                data: [
                    {
                        userId: 1,
                        dayOfTheWeek: new Date().getDay(),
                        valueChosenByUser: 1,
                        unit: 'mockedUnit',
                        name: 'mockedActivity',
                        completed: false,
                        value: 0,
                        usergoalID: 1
                    }
                ]
            }
        }).as('getUserGoals');

        // Visit the Profile page
        cy.visit("http://localhost:8080/#profile");
    });

    /**
     * Test case to verify that a clone of usergoalTemplate exists.
     */
    it('should check if a clone of usergoalTemplate exists', () => {
        // Check if a clone of usergoalTemplate exists
        cy.get('#usergoalTemplate').siblings('.activity-body').should('exist');
    });

    /**
     * Test case to verify the ability to complete an activity.
     */
    it('should be able to complete an activity', () => {
        // Click the completed button of the activity
        cy.get("#activity-btn-completed").click();
        // Wait 1 second
        cy.wait(1000)
        // Check if a clone of usergoalTemplate exists
        cy.get('#usergoalTemplate').siblings('.activity-body').should('not.exist');
    });
});
