describe("Survey", () => {
    beforeEach(() => {
        //Go to the specified URL
        cy.visit("http://localhost:8080");
        //Log in
        cy.get("#logInNav").click();
        cy.get("#exampleInputEmailAddress").type("test1");
        cy.get("#exampleInputPassword").type("test1");
        cy.get("#logInButton").click();
    });

    it("Nutrition survey available", () => {
        cy.get("#surveysNav").click();
        cy.get("#voeding-survey-btn").should("be.enabled");
    });

    it("Nutrition survey completed", () => {
        cy.server();
        const mockedResponse = [{"id": 2}];
        cy.intercept('GET', '/survey/answered/1', {
            statusCode: 200,
            body: mockedResponse,
        }).as('unansweredSurvey');

        cy.get("#surveysNav").click();
        cy.get("#voeding-survey-btn").should("have.class", "disabled");
    });

    it("Activity survey available", () => {
        cy.get("#surveysNav").click();
        cy.get("#beweging-survey-btn").should("be.enabled");
    });

    it("Activity survey completed", () => {
        cy.server();
        const mockedResponse = [{"id": 1}];
        cy.intercept('GET', '/survey/answered/1', {
            statusCode: 200,
            body: mockedResponse,
        }).as('unansweredSurvey');

        cy.get("#surveysNav").click();
        cy.get("#beweging-survey-btn").should("have.class", "disabled");
    });

    it("Answer nutrition survey", () => {
        cy.server();


        const mockedResponseSurvey = [{
            "id": 1,
            "text": "Heeft u speciale voedingsgewoontes? Hierbij zijn meerdere antwoorden mogelijk.",
            "type": "multipleChoice",
            "surveyId": 1
        }];
        const mockedResponseOption = [
            {
                "id": 1,
                "text": "Nee",
                "open": 0
            },
            {
                "id": 2,
                "text": "Ik eet vegetarisch (geen vis, geen vlees)",
                "open": 0
            },
            {
                "id": 3,
                "text": "Ik eet geen vlees, maar wel vis",
                "open": 0
            },
            {
                "id": 4,
                "text": "Ik eet veganistisch",
                "open": 0
            },
            {
                "id": 5,
                "text": "Ik eet geen varkensvlees",
                "open": 0
            },
            {
                "id": 6,
                "text": "Ik eet geen koeienvlees",
                "open": 0
            },
            {
                "id": 7,
                "text": "Ik eet flexitarisch",
                "open": 0
            },
            {
                "id": 8,
                "text": "Ja, anders namelijk:",
                "open": 1
            }
        ];

        cy.intercept('GET', '/survey/nutrition/1', {
            statusCode: 200,
            body: mockedResponseSurvey,
        }).as('survey');

        cy.intercept('GET', '/survey/options/1', {
            statusCode: 200,
            body: mockedResponseOption,
        }).as('options');

        cy.intercept('POST', '/survey/answer', {
            statusCode: 200,
        });

        cy.get("#surveysNav").click();
        cy.get("#voeding-survey-btn").click();
        cy.wait("@survey");
        cy.wait("@options");
        cy.get("#formCheckBox").click();
        cy.get("#nextBtn").click();
    });
});