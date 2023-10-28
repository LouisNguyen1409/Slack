import * as helper from "./helpers.js";
import * as page from "./page.js";
import { setToken, getToken, setUserId } from "./main.js";

document.getElementById("logout-button").addEventListener("click", () => {
    helper
        .apiCall("/auth/logout", "POST", {}, true, getToken())
        .then(() => {
            localStorage.removeItem("token");
            clearInterval(localStorage.getItem("intervalId"));
            localStorage.removeItem("intervalId");
            localStorage.removeItem("userId");
            localStorage.removeItem("dataStoreClone");
            setToken(null);
            setUserId(null);
            helper.showPage("login");
            helper.resetChannelLastMsg();
        })
        .catch((err) => {
            console.log("err");
            page.errorPopup(err);
        });
});
