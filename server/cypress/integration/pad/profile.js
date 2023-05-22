//Context: Profile
describe("Profile",  () => {
    const endpoint = "/editProfile/:userId";

        //Run before each test in this context
        beforeEach(() => {
        //Set user as logged in
            const session = {"user_id": "1"};
            localStorage.setItem("session", JSON.stringify(session));
            // Intercept the HTTP request and send a mocked response
            cy.route({
                method: 'GET',
                url: '/profile/getData',
                response: [{ id: 1, name: 'Mocked Data' }],
            }).as('getData');
        });

    it('should display mocked data', () => {
        cy.visit("http://localhost:8080/#Profile");

        // Wait for the mocked response to be received
        cy.wait('@getData');

        // Assert that the mocked data is displayed
        cy.contains('Mocked Data');
    });
});