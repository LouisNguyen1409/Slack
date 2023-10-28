import * as helper from "./helpers.js";
import { setToken, setUserId } from "./main.js";
import * as page from "./page.js";

document.getElementById("register-button").addEventListener("click", () => {
    const email = document.getElementById("register-email").value;
    const name = document.getElementById("register-name").value;
    const password = document.getElementById("register-password").value;
    const passwordConfirm = document.getElementById("register-password-confirm").value;
    if (password !== passwordConfirm) {
        page.errorPopup("Passwords do not match");
    } else {
        helper
            .apiCall("/auth/register", "POST", {
                email: email,
                name: name,
                password: password,
            })
            .then((body) => {
                const token = body.token;
                const userId = body.userId;
                localStorage.setItem("pw", password);
                setToken(token);
                setUserId(userId);
                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);
                helper.showPage("dashboard", token, userId);
            })
            .catch((err) => {
                page.errorPopup(err);
            });
    }
});
