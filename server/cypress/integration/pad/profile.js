// Import the jsonwebtoken library
import jwt from 'jsonwebtoken';

// Context: Profile
describe("Profile", () => {
    const endpoint = "/editProfile/:userId";
    let token; // Declare the token variable

    // Run before each test in this context
    beforeEach(() => {
        // Generate the JWT token
        const secretKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'; // Replace with your secret key
        const expiresIn = '365d'; // Set the expiration time to a long duration (e.g., 365 days)

        const payload = {
            userId: '1',
        };

        // Create the token using jwt.sign from the jsonwebtoken library
        const options = {
            algorithm: 'HS256', // Specify the signing algorithm (e.g., HS256)
            expiresIn: expiresIn // Specify the expiration time
        };

        // Create the token using jwt.sign from the jsonwebtoken library
        token = Cypress.env('jwt') || jwt.sign(payload, secretKey, options, (err, signedToken) => {
            if (err) {
                // Handle the error
                console.error('Error signing JWT:', err);
            } else {
                // Handle the signed token
                console.log('Signed JWT:', signedToken);
            }
        });
        Cypress.env('jwt', token);

        // Intercept the HTTP request and send a mocked response
        cy.server();
        cy.route({
            method: 'GET',
            url: '/profile/getData',
            response: [{
                userId: 1,
                dayOfTheWeek: 1,
                valueChosenByUser: 5000,
                unit: "steps",
                name: "Daily Steps",
                usergoalID: 1
            }],
        }).as('getData');
    });

    it('should display mocked data', () => {
        // Set the token in the localStorage
        const session = { "token": token }; // Store the token in the session
        localStorage.setItem("session", JSON.stringify(session));

        cy.visit("http://localhost:8080/#Profile");

        // Wait for the mocked response to be received
        cy.wait('@getData');

        // Assert that the mocked data is displayed
        cy.contains('Mocked Data');
    });

    it('should display goals and update percentages', () => {
        // Set the token in the localStorage
        const session = { "token": token }; // Store the token in the session
        localStorage.setItem("session", JSON.stringify(session));

        cy.visit("http://localhost:8080/#Profile");

        // Wait for the mocked response to be received
        cy.wait('@getData');

        // Rest of the test code...
    });
});
