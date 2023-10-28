import { BACKEND_PORT } from "./config.js";
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from "./helpers.js";
import * as helper from "./helpers.js";
let token = localStorage.getItem("token");
let userId = localStorage.getItem("userId");

export const setToken = (newToken) => {
    token = newToken;
};

export const getToken = () => {
    return token;
};

export const getUserId = () => {
    return userId;
};

export const setUserId = (newUserId) => {
    userId = newUserId;
};

import("./register.js");
import("./login.js");
import("./logout.js");
import("./dashboard.js");

for (const redirect of document.querySelectorAll(".redirect")) {
    const newPage = redirect.getAttribute("redirect");
    redirect.addEventListener("click", () => {
        helper.showPage(newPage);
    });
}

if (token === null) {
    helper.showPage("login");
} else {
    helper.showPage("dashboard", token, userId);
}
