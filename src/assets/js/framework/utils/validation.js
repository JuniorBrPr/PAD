export class Validation {

    /**
     * Validates a group of radio input fields to ensure that only one option is selected.
     * If no option is selected, the method returns false and displays an error message in the provided alert element.
     * If more than one option is selected, the method returns false and displays an error message in the provided alert element.
     * Otherwise, the method returns true.
     *
     * @private
     * @param {HTMLElement} currentQuestionTab - The container element for the group of radio input fields to validate.
     * @param {HTMLElement} alert - The alert element to display error messages.
     * @returns {boolean} true if only one option is selected, false otherwise.
     * @author Junior Javier Brito Perez
     */
    validateWeeklyPortions(currentQuestionTab, alert) {
        const dayOptions = currentQuestionTab.querySelector(".daysOptionContainer")
            .querySelectorAll("#radioBtn");
        const portionOptions = currentQuestionTab.querySelector(".portionsOptionContainer")
            .querySelectorAll("#radioBtn");
        let valid = false;

        for (let i = 0; i < dayOptions.length; i++) {
            if (dayOptions[i].checked) {
                if (i === 0) {
                    for (let j = 0; j < portionOptions.length; j++) {
                        if (portionOptions[j].checked) {
                            portionOptions[j].checked = false;
                            return true;
                        }
                    }
                    portionOptions.forEach(option => {
                        if (option.checked) {
                            option.checked = false;
                        }
                    });
                    valid = true;
                } else {
                    for (let j = 0; j < portionOptions.length; j++) {
                        if (portionOptions[j].checked) {
                            return true;
                        }
                    }
                    alert.innerText += "\nGelieve aantal porties te selecteren.";
                    valid = false;
                }
            }
        }
        alert.innerText += "\nGelieve een antwoord te selecteren.";
        return valid;
    }

    /**
     * Validates a group of checkbox input fields to ensure that at least one option is selected.
     * If no option is selected, the method returns false and displays an error message in the provided alert element.
     * Otherwise, the method returns true.
     *
     * @private
     * @param {NodeList} optionsCurrentQuestionTab - The group of checkbox input fields to validate.
     * @param {HTMLElement} alert - The alert element to display error messages.
     * @returns {boolean} true if at least one option is selected, false otherwise.
     * @memberof surveyController
     * @since v1.0.0
     */
    validateMultipleChoice(optionsCurrentQuestionTab, alert) {
        for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
            if (optionsCurrentQuestionTab[i].querySelector("input").checked) {
                return true;
            }
        }
        alert.innerText = "\nGelieve een antwoord te selecteren.";
        return false;
    }

    /**
     * Validates a group of radio input fields to ensure that only one option is selected.
     * If no option is selected, the method returns false and displays an error message in the provided alert element.
     * If more than one option is selected, the method returns false and displays an error message in the provided alert element.
     * Otherwise, the method returns true.
     *
     * @private
     * @param {NodeList} optionsCurrentQuestionTab - The group of radio input fields to validate.
     * @param {HTMLElement} alert - The alert element to display error messages.
     * @returns {boolean} true if only one option is selected, false otherwise.
     * @author Junior Javier Brito Perez
     */
    validateNumberScale(optionsCurrentQuestionTab, alert) {
        let checked = 0;
        for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
            if (checked > 1) break;
            if (optionsCurrentQuestionTab[i].querySelector("input").checked) {
                checked++;
            }
        }
        if (checked === 1) {
            return true;
        }

        if (checked > 1) {
            alert.innerText += "\nGelieve slechts 1 antwoord te selecteren.";
            return false;
        }
        alert.innerText += "\nGelieve een antwoord te selecteren.";
        return false;
    }

    /**
     * Validates a group of radio input fields to ensure that only one option is selected.
     * If no option is selected, the method returns false and displays an error message in the provided alert element.
     * If more than one option is selected, the method returns false and displays an error message in the provided alert element.
     * Otherwise, the method returns true.
     *
     * @private
     * @param {NodeList} optionsCurrentQuestionTab - The group of radio input fields to validate.
     * @param {HTMLElement} alert - The alert element to display error messages.
     * @returns {boolean} true if only one option is selected, false otherwise.
     * @author Junior Javier Brito Perez
     */
    validateSingleChoice(optionsCurrentQuestionTab, alert) {
        let checked = 0;
        for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
            if (checked > 1) break;
            if (optionsCurrentQuestionTab[i].querySelector("input").checked) {
                checked++;
            }
        }

        if (checked === 1) {
            return true;
        } else if (checked > 1) {
            alert.innerText += "\nGelieve slechts 1 antwoord te selecteren.";
            return false;
        } else {
            alert.innerText = "\nGelieve een antwoord te selecteren.";
            return false;
        }
    }

    /**
     * Validates a group of radio input fields to ensure that at least one option is selected.
     * If no option is selected, the method returns false and displays an error message in the provided alert element.
     * Otherwise, the method returns true.
     *
     * @private
     * @param {NodeList} radios - The group of radio input fields to validate.
     * @param {HTMLElement} alert - The alert element to display error messages.
     * @returns {boolean} true if at least one option is selected, false otherwise.
     * @memberof surveyController
     * @since v1.0.0
     */
    validateRadiosInput(radios, alert) {
        let checked = 0;
        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                checked++;
                break;
            }
        }
        if (checked === 0) {
            if (alert !== null) {
                alert.innerText += "\nGelieve een antwoord te selecteren.";
            }
            for (let i = 0; i < radios.length; i++) {
                radios[i].style.borderColor = "red";
            }
            return false;
        } else {
            return true;
        }
    }

    /**
     * Validates a number input field based on its minimum and maximum values.
     * If the input field is empty, the method returns false.
     * Otherwise, the method validates the input field and returns true if the value is within the minimum and maximum range.
     *
     * @private
     * @param {HTMLInputElement} input - The number input field to validate.
     * @param {HTMLElement} alert - The alert element to display error messages.
     * @returns {boolean} true if the input field is valid, false otherwise.
     * @author Junior Javier Brito Perez
     */
    validateNumberInput(input, alert) {
        if (input.value === "") {
            input.style.borderColor = "red";
            alert.innerText += "\nGelieve alle velden in te vullen.";
            return false;
        }
        if (parseInt(input.value) < input.min) {
            input.style.borderColor = "red";
            alert.innerText += `\nGelieve een waarde groter dan ${input.min} in te vullen.`;
            return false;
        }
        if (parseInt(input.value) > input.max) {
            input.style.borderColor = "red";
            alert.innerText += `\nGelieve een waarde kleiner dan ${input.max} in te vullen.`;
            return false;
        }
        return true;
    }


    /**
     * Checks if all input fields in the given node have a value of zero.
     * @private
     * @param {HTMLElement} node - The node to check for zero values.
     * @returns {boolean} true if all input fields have a value of zero, false otherwise.
     * @author Junior Javier Brito Perez
     */
    validateAllZero(node) {
        const inputs = node.querySelectorAll("input[type=number]");
        for (let i = 0; i < inputs.length; i++) {
            if (parseInt(inputs[i].value) !== 0) {
                return false;
            }
        }
        return true;
    }

    /**
     * Validate the days, hours and minutes input fields of a single exercise question.
     * @private
     * @param {HTMLElement} question - The question to validate.
     * @param {HTMLElement} alert - The alert element to display error messages.
     * @returns {boolean} true if the form is valid.
     * @author Junior Javier Brito Perez
     */
    validateDaysHoursMinutes(question, alert) {
        let valid = true;
        const daysColumn = question.querySelector(".daysColumn");
        if (daysColumn !== null) {
            const hoursAndMinutes = question.querySelector(".hoursMinutesColumn");
            if (this.validateAllZero(daysColumn)) {
                valid = false;
                alert.innerText += "\nVul minstens één dag in.";
                daysColumn.querySelector(".days").style.borderColor = "red";
            }
            if (this.validateAllZero(hoursAndMinutes)) {
                valid = false;
                alert.innerText += "\nVul minstens één uur of minuut in.";
                hoursAndMinutes.querySelector(".hours").style.borderColor = "red";
                hoursAndMinutes.querySelector(".minutes").style.borderColor = "red";
            }
        }
        return valid;
    }


    /**
     * Validates the form of a single exercise question based on its type.
     * If all input fields are empty, the method returns true.
     * Otherwise, the method validates each input field and returns true if all fields are valid.
     * @private
     * @param {HTMLElement} question - The question to validate.
     * @param {HTMLElement} alert - The alert element to display error messages.
     * @returns {boolean} true if the form is valid.
     * @author Junior Javier Brito Perez
     */
    validateExerciseQuestion(question, alert) {
        if (this.validateAllZero(question)) {
            return true;
        }
        const inputs = question.querySelectorAll("input");
        let valid = true;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].type === "number") {
                if (!this.validateNumberInput(inputs[i], alert)) {
                    valid = false;
                }
            }
        }

        valid = this.validateDaysHoursMinutes(question, alert) && valid;

        const radios = question.querySelectorAll(".radio");
        if (radios.length > 0) {
            if (!this.validateRadiosInput(radios, null)) {
                valid = false;
                alert.innerText += "\nKies een inspanningsniveau.";
            }
        }
        return valid;
    }

    /**
     * Validates the form of the current activity survey question based on its type.
     * If the "Not applicable" checkbox is checked, the method returns true.
     * Otherwise, the method validates each row of the question tab and returns true if all rows are valid.
     * @private
     * @param {HTMLElement} questionTab - The question tab to validate.
     * @param {HTMLElement} alert - The alert element to display error messages.
     * @returns {boolean} true if the form is valid.
     * @author Junior Javier Brito Perez
     */
    validateActivitySurvey(questionTab, alert) {
        const optionsCurrentQuestionTab = questionTab.querySelectorAll(".questionRow");
        const nvtCheckbox = questionTab.querySelector(".nvtCheck");
        let valid = true;
        alert.style.display = "none";
        alert.innerText = "";

        if (nvtCheckbox.checked) {
            return true;
        } else {
            if (this.validateAllZero(questionTab)) {
                alert.innerText += "\nVul minstens één rij in of kies \"Niet van toepassing\".";
                valid = false;
            }
            for (let i = 0; i < optionsCurrentQuestionTab.length; i++) {
                if (!this.validateExerciseQuestion(optionsCurrentQuestionTab[i], alert)) {
                    valid = false;
                }
            }
            return valid;
        }
    }

    /**
     * Resets the border color of all input elements in the given question tab to their default color.
     * @private
     * @param {HTMLElement} questionTab - The question tab to reset the border colors for.
     * @returns {void}
     * @author Junior Javier Brito Perez
     */
    resetBorderColors(questionTab) {
        const inputs = questionTab.querySelectorAll("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].style.borderColor = "";
        }
    }

    /**
     * Toggles the enabled/disabled state of all input elements within the given container.
     * @private
     * @param {HTMLElement} container - The container element containing the input elements to toggle.
     * @param {boolean} enabled - Whether to enable or disable the input elements.
     * @returns {void}
     * @author Junior Javier Brito Perez
     */
    toggleEnabledInput(container, enabled) {
        const inputs = container.querySelectorAll("input");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = !enabled;
        }
    }
}