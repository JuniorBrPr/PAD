import {Controller} from "./controller.js";


export class profileController extends Controller {
    #createProfileView

    constructor() {
        super();
        this.#setupView();
        this.weight = 74;
        this.height = 183;
        this.age = 18;
        this.email = "Joeywognum@gmail.com"
        this.firstname = "Joey"
        this.lastname = "van der Poel"
    }

    async #setupView() {
        this.#createProfileView = await super.loadHtmlIntoContent("html_views/profile.html")
        document.getElementById("profileFullName").innerHTML = this.firstname + " " + this.lastname
        document.getElementById("profileEmail").innerHTML = this.email
        document.getElementById("profileAge").innerHTML = this.age + " Jaar"
        document.getElementById("profileHeight").innerHTML = this.height + " CM"
        document.getElementById("profileWeight").innerHTML = this.weight + " Kilo"

    }
}

