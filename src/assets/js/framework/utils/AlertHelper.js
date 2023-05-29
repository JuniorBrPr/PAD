
export class AlertHelper {
    static showAlert(message, succes, container) {
        const template = fetch("../../../../html_views/alert.html").then((response) => {
            console.log(response);
            return response.text();
        });
        const alert = template.querySelector("#alert").content.cloneNode(true);
        if (succes) {
            alert.querySelector(".alert").classList.add("alert-success");
        } else {
            alert.querySelector(".alert").classList.add("alert-danger");
        }
        alert.querySelector(".alert-text").innerText = message;
        container.appendChild(alert);
    }
}

