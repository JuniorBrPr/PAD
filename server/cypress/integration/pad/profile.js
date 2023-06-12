/**
 * Cypress test suite for the Profile page.
 */
describe("Profile", () => {
    // Run before each test in this context
    beforeEach(() => {
        cy.intercept('GET', '/home/data', {
            statusCode: 200,
            body: {
                "video": "https://www.youtube.com/embed/IfdFyeZTrFI",
                "board_message": "Blijf gezond eten!"
            }
        }).as('getData');

        const mockedResponse = {"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwMCwiZmlyc3RuYW1lIjoiSm9leVBlcm1LZXkiLCJyb2xlIjoxfQ.xXSJo2LZFyLbR_HbSg1Dwd83VuODwKyXKwu0uPrJ76Q"};
        cy.intercept('POST', '/users/login', {
            statusCode: 200,
            body: mockedResponse,
        }).as('login');

        cy.intercept('GET', '/users/isAdmin', {
            statusCode: 200,
            body: {"isAdmin": false},
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

        cy.intercept('GET', '/profile', {
            statusCode: 200,
            body: {
                firstname: 'John',
                surname: 'Doe',
                date_of_birth: '1990-01-01',
                emailAddress: 'john.doe@example.com',
                weight: 70,
                height: 180
            }
        }).as('getData');

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
        cy.get('.activity-body').should('exist');
    })

    /**
     * Test case to verify the ability to complete an activity.
     */
    it('should be able to complete an activity', () => {
        // Click the completed button of the activity
        cy.get("#activity-btn-completed").click();

        cy.intercept('GET', '/profile/checkIfGoalExists/1', {
            statusCode: 200,
            body: {
                data: [
                    {
                        goalCount: 0
                    }
                ]
            }
        }).as('checkIfGoalExists');

        cy.intercept('POST', '/profile/insertGoal/*', {
            statusCode: 200,
            body: {
                data: [
                    {
                        userId: 1,
                        value: 1,
                        completed: 1,
                        usergoalID: 1,
                        date: new Date()
                    }
                ]
            }
        }).as('insertGoal');

        // Check if a clone of usergoalTemplate exists
        cy.get('.activity-body').should('not.exist');
    });
});
