import * as helper from "./helpers.js";
import * as page from "./page.js";
import { setToken, setUserId } from "./main.js";

document.getElementById("login-button").addEventListener("click", () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    console.log(email, password);
    helper
        .apiCall("/auth/login", "POST", {
            email: email,
            password: password,
        })
        .then((body) => {
            console.log(body);
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
            console.log("error");
            page.errorPopup(err);
        });
});
