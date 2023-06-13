/**
 * Tests for the survey page.
 *
 * @author Junior Javier Brito Perez
 */

describe("Survey", () => {
    Cypress.on('uncaught:exception', () => {
        return false
    });

    beforeEach(() => {
        cy.intercept('POST', '/users/login', {
            statusCode: 200,
            body: {"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwMCwiZmlyc3RuYW1lIjoiSm9leVBlcm1LZXkiLCJyb2xlIjoxfQ.xXSJo2LZFyLbR_HbSg1Dwd83VuODwKyXKwu0uPrJ76Q"},
        }).as('login');

        cy.intercept('GET', '/users/isAdmin', {
            statusCode: 200,
            body: {"isAdmin": false},
        }).as('isAdmin');

        cy.visit("http://localhost:8080/#login");

        cy.get("#InputEmailAddress").type("test");
        cy.get("#InputPassword").type("test");
        cy.get(".login-form button").click();
    });

    /**
     * Test if the nutrition survey is available.
     */
    it("Nutrition survey available", () => {
        cy.get("#surveysNav").click();
        cy.get("#voeding-survey-btn").should("be.enabled");
    });

    /**
     * Test if the survey page displays the correct state of completion/availability for the nutrition survey.
     */
    it("Nutrition survey completed", () => {
        cy.server();
        const mockedResponse = [{"id": 2}];
        cy.intercept('GET', '/survey/answered', {
            statusCode: 200,
            body: mockedResponse,
        }).as('unansweredSurvey');

        cy.get("#surveysNav").click();
        cy.get("#voeding-survey-btn").should("have.class", "disabled");
    });

    /**
     * Test if the activity survey page is available.
     */
    it("Activity survey available", () => {
        cy.get("#surveysNav").click();
        cy.get("#beweging-survey-btn").should("be.enabled");
    });

    /**
     * Test if the survey page displays the correct state of completion/availability for the activity survey.
     */
    it("Activity survey completed", () => {
        cy.server();
        const mockedResponse = [{"id": 1}];
        cy.intercept('GET', '/survey/answered', {
            statusCode: 200,
            body: mockedResponse,
        }).as('unansweredSurvey');

        cy.get("#surveysNav").click();
        cy.get("#beweging-survey-btn").should("have.class", "disabled");
    });

    /**
     * Test if you can answer the nutrition survey.
     */
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
        cy.intercept('GET', '/survey/answered', {
            statusCode: 200,
            body: [{id: 1}, {id: 2}],
        }).as('answeredSurvey');

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
        cy.get("#formCheckBox").click();
        cy.get("#nextBtn").click();
    });

    /**
     * Test if you can answer the activity survey.
     */
    it("Answer activity survey", () => {
        cy.server();
        const mockedResponseSurvey = [
            {
                id: 80,
                surveyId: 2,
                text: "Geef aan hoe vaak je per week naar een activiteit gaat en hoe lang je er over doet om er te " +
                    "komen en weer terug te gaan.Bijvoorbeeld mantel-zorg, oppassen, vrijwilligerswerk, cursus volgen etc.",
                type: "weeklyRecurringActivity"
            },
        ];
        const mockedResponseOption = [
            {
                id: 192,
                open: 0,
                questionId: 80,
                text: "Wandelen van/naar deze activiteit"
            },
            {
                id: 193,
                open: 0,
                questionId: 80,
                text: "Fietsen van/naar deze activiteit"
            }
        ];
        cy.intercept('GET', '/survey/answered', {
            statusCode: 200,
            body: [{id: 1}, {id: 2}],
        }).as('answeredSurvey');

        cy.intercept('GET', '/survey/questions/2', {
            statusCode: 200,
            body: mockedResponseSurvey,
        }).as('survey');

        cy.intercept('GET', '/survey/options/80', {
            statusCode: 200,
            body: mockedResponseOption,
        }).as('options');

        cy.intercept('POST', '/survey/answer', {
            statusCode: 200,
        });

        cy.get("#surveysNav").click();
        cy.get("#beweging-survey-btn").click();
        cy.get(".questionTab > :nth-child(1) > .text-center")
            .should("be.visible")
            .should("have.text", "Geef aan hoe vaak je per week naar een activiteit gaat en hoe " +
                "lang je er over doet om er te komen en weer terug te gaan.Bijvoorbeeld mantel-zorg, oppassen, " +
                "vrijwilligerswerk, cursus volgen etc.");
    });
});