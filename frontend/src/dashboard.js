import * as helper from "./helpers.js";
import * as page from "./page.js";
import { getToken, getUserId } from "./main.js";

document.getElementById("new-channel-btn").addEventListener("click", () => {
    createFormPopUp();
});

export const createFormPopUp = () => {
    document.getElementById("create-now-btn").addEventListener("click", handler);
};

const handler = () => {
    let name = document.getElementById("channel-name").value;
    const description = document.getElementById("description").value;
    let privateChannel = document.getElementById("private-channel").checked;
    const publicChannel = document.getElementById("public-channel").checked;
    resetForm();

    if (name === "") {
        name = undefined;
    } else if (privateChannel === false && publicChannel === false) {
        privateChannel = undefined;
    }
    helper
        .apiCall(
            "/channel",
            "POST",
            {
                name: name,
                private: privateChannel,
                description: description,
            },
            true,
            getToken()
        )
        .then(() => {
            console.log("success");
            helper.showPage("dashboard", getToken(), getUserId());
        })
        .catch((err) => {
            page.errorPopup(err);
        });
    document.getElementById("create-now-btn").removeEventListener("click", handler);
};

const resetForm = () => {
    document.getElementById("channel-name").value = "";
    document.getElementById("description").value = "";
    document.getElementById("private-channel").checked = false;
    document.getElementById("public-channel").checked = false;
};

document.getElementById("profile-action").addEventListener("click", () => {
    helper.apiCall(`/user/${getUserId()}`, "GET", {}, true, getToken()).then((body) => {
        document.getElementById("profile-username").value = body.name;
        document.getElementById("profile-email").placeholder = body.email;
        document.getElementById("profile-bio").value = body.bio;
        if (body.image === null || body.image === '') {
            document.getElementById("profile-img").setAttribute("src", "../assets/default-profile.png");
        } else {
            document.getElementById("profile-img").setAttribute("src", body.image);
        }
        document.getElementById("update-profile-btn").addEventListener("click", updateProfile);
    });
});

const pwBtn = document.getElementById("hide-show-btn");
pwBtn.addEventListener("click", () => {
    let option = pwBtn.getAttribute("option");
    if (option === "hide") {
        pwBtn.setAttribute("option", "show");
        document.getElementById("pw-img").setAttribute("src", "../assets/eye-hide.svg");
        document.getElementById("profile-password").setAttribute("type", "text");
    } else if (option === "show") {
        pwBtn.setAttribute("option", "hide");
        document.getElementById("pw-img").setAttribute("src", "../assets/eye-show.svg");
        document.getElementById("profile-password").setAttribute("type", "password");
    }
});

const updateProfile = () => {
    const name = document.getElementById("profile-username").value;
    const email = document.getElementById("profile-email").value;
    const bio = document.getElementById("profile-bio").value;
    const password = document.getElementById("profile-password").value;
    if (document.getElementById("profile-update-img").files[0] === undefined) {
        const image = "";
        if (password === localStorage.getItem("pw")) {
            page.errorPopup("Error: New password cannot be the same as old password");
        } else {
            helper
                .apiCall(
                    `/user/`,
                    "PUT",
                    {
                        name: name,
                        email: email,
                        bio: bio,
                        password: password,
                        image: image,
                    },
                    true,
                    getToken()
                )
                .then(() => {
                    console.log("success");
                    document.getElementById("profile-avatar").setAttribute("src", "../assets/default-profile.png");
                    console.log(document.getElementById("profile-avatar").getAttribute("src"));
                    resetProfileForm();
                    helper.showPage("dashboard", getToken(), getUserId());
                    localStorage.setItem("pw", password);

                    pwBtn.setAttribute("option", "hide");
                    document.getElementById("pw-img").setAttribute("src", "../assets/eye-show.svg");
                    document.getElementById("profile-password").setAttribute("type", "password");
                })
                .catch((err) => {
                    page.errorPopup(err);
                });
            document.getElementById("update-profile-btn").removeEventListener("click", updateProfile);
        }
    } else {
        helper
            .fileToDataUrl(document.getElementById("profile-update-img").files[0])
            .then((image) => {
                if (password === localStorage.getItem("pw")) {
                    page.errorPopup("Error: New password cannot be the same as old password");
                } else {
                    helper
                        .apiCall(
                            `/user/`,
                            "PUT",
                            {
                                name: name,
                                email: email,
                                bio: bio,
                                password: password,
                                image: image,
                            },
                            true,
                            getToken()
                        )
                        .then(() => {
                            console.log("success");
                            document.getElementById("profile-avatar").setAttribute("src", image);
                            resetProfileForm();
                            helper.showPage("dashboard", getToken(), getUserId());
                            localStorage.setItem("pw", password);

                            pwBtn.setAttribute("option", "hide");
                            document.getElementById("pw-img").setAttribute("src", "../assets/eye-show.svg");
                            document.getElementById("profile-password").setAttribute("type", "password");
                        })
                        .catch((err) => {
                            page.errorPopup(err);
                        });
                    document.getElementById("update-profile-btn").removeEventListener("click", updateProfile);
                }
            })
            .catch((err) => {
                page.errorPopup(err);
            });
    }
};

const resetProfileForm = () => {
    document.getElementById("profile-username").value = "";
    document.getElementById("profile-email").value = "";
    document.getElementById("profile-bio").value = "";
    document.getElementById("profile-password").value = "";
    document.getElementById("profile-update-img").value = "";
};
