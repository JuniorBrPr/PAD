//Context: Admin page test
describe("Admin", () => {

    beforeEach(() => {

        cy.intercept('GET', '/admin/survey_content/nutrition', {
            statusCode: 200,
            body: [
                {
                    "id": 1,
                    "text": "Heeft u speciale voedingsgewoontes? Hierbij zijn meerdere antwoorden mogelijk.",
                    "typeId": 1,
                    "type": "multipleChoice",
                    "surveyId": 1,
                    "answers": [
                        {
                            "value": "Nee"
                        },
                        {
                            "value": "Ik eet vegetarisch (geen vis, geen vlees)"
                        },
                        {
                            "value": "Ik eet geen vlees, maar wel vis"
                        },
                        {
                            "value": "Ik eet veganistisch"
                        },
                        {
                            "value": "Ik eet geen varkensvlees"
                        },
                        {
                            "value": "Ik eet geen koeienvlees"
                        },
                        {
                            "value": "Ik eet flexitarisch"
                        },
                        {
                            "value": "Ja, anders namelijk:"
                        }
                    ]
                },
                {
                    "id": 2,
                    "text": "Volgt u een speciaal dieet?",
                    "typeId": 2,
                    "type": "singleChoice",
                    "surveyId": 1,
                    "answers": [
                        {
                            "value": "Glutenvrij"
                        },
                        {
                            "value": "Lactosebeperkt/lactosevrij"
                        },
                        {
                            "value": "Zoutbeperkt"
                        },
                        {
                            "value": "Ik ben allergisch voor 1 of meerdere voedingsmiddelen (e.g. pinda’s,\nschaaldieren). Indien ja, welke:"
                        },
                        {
                            "value": "Anders, namelijk:"
                        }
                    ]
                },
                {
                    "id": 4,
                    "text": "Met welke soorten boter besmeert u meestal uw brood, knäckebröd, cracker of beschuit?",
                    "typeId": 2,
                    "type": "singleChoice",
                    "surveyId": 1,
                    "answers": [
                        {
                            "value": "Ik gebruik meestal geen boter"
                        },
                        {
                            "value": "Bijna altijd met (dieet) halvarine, (dieet)margarine"
                        },
                        {
                            "value": "Bijna altijd met (halfvolle) roomboter"
                        },
                        {
                            "value": "Met zowel (dieet) halvarine, (dieet)margarine als (halfvolle) roomboter\n"
                        }
                    ]
                }
            ]
        }).as('getNutritionData');

        cy.intercept('GET', '/admin/survey_content/exercise', {
            statusCode: 200,
            body: [
                {
                    "id": 80,
                    "text": "Lopen van/naar deze\nactiviteit.",
                    "typeId": 12,
                    "type": "weeklyRecurringActivity",
                    "surveyId": 2,
                    "answers": []
                },
                {
                    "id": 82,
                    "text": "Licht en matig inspannende activiteit\n(zittend/staand, met af en toe lopen, zoals\nbureauwerk of lopend met lichte lasten)",
                    "typeId": 13,
                    "type": "recurringPhysicalActivity",
                    "surveyId": 2,
                    "answers": []
                },
                {
                    "id": 84,
                    "text": "Licht en matig inspannend huishoudelijk werk (staand\nwerk, zoals koken, afwassen, strijken, kind eten\ngeven/in bad doen en lopen werk, zoals stofzuigen,\nboodschappen doen)",
                    "typeId": 14,
                    "type": "householdActivity",
                    "surveyId": 2,
                    "answers": []
                }
            ]
        }).as('getExerciseData');

        cy.intercept('GET', '/home/data', {
            statusCode: 200,
            body: {
                "video": "https://www.youtube.com/embed/IfdFyeZTrFI",
                "board_message": "Blijf gezond eten!"
            }
        }).as('getDataHome');

        cy.intercept('POST', '/users/login', {
            statusCode: 200,
            body: {"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwMCwiZmlyc3RuYW1lIjoiSm9leVBlcm1LZXkiLCJyb2xlIjoxfQ.xXSJo2LZFyLbR_HbSg1Dwd83VuODwKyXKwu0uPrJ76Q"},
        }).as('login');

        cy.intercept('GET', '/users/isAdmin', {
            statusCode: 200,
            body: {"isAdmin": false},
        }).as('isAdmin');

        cy.visit("http://localhost:8080/#login");
    });

    it("Valid login form", () => {

        cy.get("#InputEmailAddress").should("exist");

        cy.get("#InputPassword").should("exist");

        cy.get(".login-form button").should("exist");
    });

    it("Non-admin login", () => {

        cy.get("#InputEmailAddress").type("test");
        cy.get("#InputPassword").type("test");

        cy.get(".login-form button").click();

        cy.wait("@login");

        cy.get("@login").should((xhr) => {
            //The email should match what we typed earlier
            const body = xhr.request.body;
            expect(body.emailAddress).equals("test");

            //The password should match what we typed earlier
            expect(body.password).equals("test");
        });

        cy.wait("@getDataHome");

        cy.url().should("contain", "#home");

        cy.get('.nav-item.admin-only').should('not.be.visible');
    });

    it("Admin login to csv", () => {

        cy.intercept('GET', '/users/isAdmin', {
            statusCode: 200,
            body: {"isAdmin": true},
        }).as('isAdmin');

        cy.get("#InputEmailAddress").type("test");
        cy.get("#InputPassword").type("test");

        console.log(cy.get(".login-form button"));
        cy.get(".login-form button").click();

        cy.wait("@login");

        cy.get("@login").should((xhr) => {
            //The email should match what we typed earlier
            const body = xhr.request.body;
            expect(body.emailAddress).equals("test");

            //The password should match what we typed earlier
            expect(body.password).equals("test");
        });

        cy.url().should("contain", "#home");

        cy.get('.nav-item.admin-only').should('be.visible');

        cy.get(".nav-item.admin-only").click();

        cy.wait("@isAdmin");

        cy.url().should("contain", "#admin");

        cy.get("#download-csv-btn").should("exist");
    });

    it("Admin login to survey preview", () => {

        cy.intercept('GET', '/users/isAdmin', {
            statusCode: 200,
            body: {"isAdmin": true},
        }).as('isAdmin');

        cy.get("#InputEmailAddress").type("test");
        cy.get("#InputPassword").type("test");

        console.log(cy.get(".login-form button"));
        cy.get(".login-form button").click();

        cy.wait("@login");

        cy.get("@login").should((xhr) => {
            //The email should match what we typed earlier
            const body = xhr.request.body;
            expect(body.emailAddress).equals("test");

            //The password should match what we typed earlier
            expect(body.password).equals("test");
        });

        cy.url().should("contain", "#home");

        cy.get('.nav-item.admin-only').should('be.visible');

        cy.get(".nav-item.admin-only").click();

        cy.wait("@isAdmin");

        cy.url().should("contain", "#admin");

        cy.get("#survey-tab").click();

        cy.get('#voeding-survey-btn').should('be.visible');

        cy.get('#voeding-survey-btn').click();

        cy.get('#nextBtn').click();
        cy.get('#prevBtn').click();

        cy.get('.question-title').should('contain', 'Heeft u speciale voedingsgewoontes? Hierbij zijn meerdere antwoorden mogelijk.');

        cy.get('#backBtn').click();

        cy.get('#beweging-survey-btn').click();

        cy.get('#nextBtn').click();
        cy.get('#prevBtn').click();

        cy.get('.question-type').should('contain', 'Type vraag: weeklyRecurringActivity');

        cy.get('#backBtn').click();
    });
});