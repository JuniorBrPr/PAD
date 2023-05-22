//Context: Profile
describe("Profile",  () => {
    const endpoint = "/editProfile/:userId";

    //Run before each test in this context
    beforeEach(() => {
        //Set user as logged in
        const session = {"user_id": "1"};
        localStorage.setItem("session", JSON.stringify(session));
        // Intercept the HTTP request and send a mocked response
        cy.server();
        cy.route({
            method: 'GET',
            url: '/profile/getData',
            response: [{
                userId: 1,
                dayOfTheWeek: 1,
                valueChosenByUser: 5,
                unit: "steps",
                name: "Daily Steps",
                usergoalID: 1
            }],
        }).as('getData');
    });

    it('should display mocked data', () => {
        cy.visit("http://localhost:8080/#Profile");

        // Wait for the mocked response to be received
        cy.wait('@getData');

        // Assert that the mocked data is displayed
        cy.contains('Mocked Data');
    });

    it('should display goals and update percentages', () => {
        cy.visit("http://localhost:8080/#Profile");

        // Wait for the mocked response to be received
        cy.wait('@getData');

        // Assert that the goals are initially not displayed
        cy.get('#card-container').should('not.exist');

        // Click the button to load the goals
        cy.get('#buttonWijzig').click();

        // Assert that the goals are displayed
        cy.get('#card-container').should('exist');

        // Assert that the daily goal completion percentage is initially 0%
        cy.get('#percentage').should('have.text', '0%');

        // Assert that the weekly goal completion percentage is initially 0%
        cy.get('#progress-bar').should('have.text', '0%');

        // Click the completed button for a goal
        cy.get('.activity-btn-completed').first().click();

        // Assert that the goal card is removed
        cy.get('#card-container').should('not.exist');

        // Assert that the daily goal completion percentage is updated
        cy.get('#percentage').should('not.have.text', '0%');

        // Assert that the weekly goal completion percentage is updated
        cy.get('#progress-bar').should('not.have.text', '0%');
    });
});