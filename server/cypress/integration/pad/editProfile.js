describe("Edit Profile", () => {
    const endpoint = "/editProfile/:userId";

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

        // Visit the Profile page
        cy.visit("http://localhost:8080/#editProfile");
    });

    //Test: Validate login form
    it("Valid edit profile form", () => {
        //Find the field for firstname, check if it exists.
        cy.get("#InputFirstname").should("exist");

        //Find the field for surname, check if it exists.
        cy.get("#InputSurname").should("exist");

        //Find the field for email, check if it exists.
        cy.get("#InputEmail").should("exist");

        //Find the field for weight, check if it exists.
        cy.get("#InputWeight").should("exist");

        //Find the field for height, check if it exists.
        cy.get("#InputHeight").should("exist");

        //Find the field for age, check if it exists.
        cy.get("#InputAge").should("exist");

    });

    //Test: Successful edit profile
    it("Successful edit profile", () => {
        //Add a stub with the URL /editProfile/:userId as a PUT
        cy.intercept('PUT', '/editProfile', {
            statusCode: 200
            // body: mockedResponse,
        }).as('editProfile');

        // Find the field for the firstname, clear its value, and type the text "test".
        cy.get("#InputFirstname").clear().type("test");

        // Find the field for the surname, clear its value, and type the text "test".
        cy.get("#InputSurname").clear().type("test");

        // Find the field for the email, clear its value, and type the text "test@gmail.com".
        cy.get("#InputEmail").clear().type("test@gmail.com");

        // Find the field for the weight, clear its value, and type the integer "100".
        cy.get("#InputWeight").clear().type("100");

        // Find the field for the height, clear its value, and type the integer "100".
        cy.get("#InputHeight").clear().type("100");

        // Find the field for the age, clear its value, and type the date "01-01-2000".
        cy.get("#InputAge").clear().type("2000-01-01");

        console.log(cy.get("#saveProfileBtn"));
        cy.get("#saveProfileBtn").click();

        //After a successful login, the URL should now contain #profile.
        cy.url().should("contain", "http://localhost:8080/#profile");
    });

    //Test: Failed edit profile
    it("Failed edit profile", () => {
        //Start a fake server
        cy.server();

        // Find the field for the firstname, clear its value, and type a space character.
        cy.get("#InputFirstname").clear().type(" ");

        // Find the field for the surname, clear its value, and type a space character.
        cy.get("#InputSurname").clear().type(" ");

        // Find the field for the email, clear its value, and type the text "test".
        cy.get("#InputEmail").clear().type("test");

        // Find the field for the weight, clear its value, and type the integer "0".
        cy.get("#InputWeight").clear().type("0");

        // Find the field for the height, clear its value, and type the integer "0".
        cy.get("#InputHeight").clear().type("0");

        // Find the field for the age, clear its value, and type the date "01-01-2023".
        cy.get("#InputAge").clear().type("2023-01-01");

        //Find the button to login and click it.
        cy.get("#saveProfileBtn").click();

        //After a successful login, the URL should now contain #profile.
        cy.url().should("contain", "#editProfile");
    });
});