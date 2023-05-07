/**
 * Responsible for handling the actions happening on home view
 * For now it uses the roomExampleRepository to get some example data from server
 *
 * @author Lennard Fonteijn & Pim Meijer
 */

import {Controller} from "./controller.js";
import {HomeRepository} from "../repositories/homeRepository.js";

export class HomeController extends Controller{
    #welcomeView
    #homeRepository

    constructor() {
        super();
        this.#homeRepository = new HomeRepository();

        this.#setupView();
    }

    /**
     * Loads contents of desired HTML file into the index.html .content div
     * @returns {Promise<>}
     * @private
     */
    async #setupView() {
        this.#welcomeView = await super.loadHtmlIntoContent("html_views/home.html");

        this.#loadFeatureImage();
        this.#loadTeamImage();
        this.#loadVideo();
    }

    #loadFeatureImage() {
        const featureImage = document.getElementById("feature-image");
        featureImage.src = "../src/assets/images/home/feature.webp";
    }

    #loadTeamImage() {
        const teamImage = document.getElementById("team-image");
        teamImage.src = "../src/assets/images/home/people.webp";
    }

    async #loadVideo() {
        const homeData = await this.#homeRepository.getData();
        const videoElement = document.getElementById("team-video");

        videoElement.src = homeData.video;
    }
}