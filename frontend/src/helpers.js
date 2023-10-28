import * as render from "./render.js";
import * as check from "./check.js";
import * as reset from "./reset.js";
import * as page from "./page.js";
/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
    const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const valid = validFileTypes.find((type) => type === file.type);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error("provided file is not a png, jpg or jpeg image.");
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}

// Funcion Store
const functionStore = {
    joinFunction: null,
    leaveFunction: null,
    inviteFunction: null,
    editFunction: null,
    pinFunction: null,
    infoFunction: null,
    editModal: null,
    sendMsg: null,
    sendImg: null,
    editMessage: null,
    pinMessage: null,
    inviteSubmit: null,
    fetchMsg: null,
};

let channelLastMsg = {};
export const resetChannelLastMsg = () => {
    channelLastMsg = {};
};

let pinMsgFunction = {};

let index = 0;
let currChannelId = null;
const dataStoreClone = {};
let msgStoreClone = {};

// API Call
export function apiCall(path, method, body, auth = false, token = null) {
    return new Promise((resolve, reject) => {
        let ret;
        if (method === "GET" || method === "DELETE") {
            ret = fetch("http://localhost:5005" + path + "?" + body, {
                method: method,
                headers: {
                    "Content-type": "application/json",
                    Authorization: auth ? `Bearer ${token}` : undefined,
                },
            });
        } else {
            ret = fetch("http://localhost:5005" + path, {
                method: method,
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: auth ? `Bearer ${token}` : undefined,
                },
            });
        }
        ret.then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data);
                }
            })
            .catch((err) => {
                const pattern = /^\/channel\/\d+$/;
                // Milestone 7
                if (pattern.test(path)) {
                    document.getElementById("message_container").innerHTML = "";
                    const channelsData = JSON.parse(localStorage.getItem("dataStoreClone"));
                    const channelId = parseInt(path.split("/")[2]);
                    let channelData = channelsData[channelId];
                    console.log(channelData);
                    for (const msg of Object.values(channelData)) {
                        if (msg[2] === null) {
                            msg[2] = undefined;
                        }
                        createNewMsg(msg[0], msg[1], msg[2], msg[3], msg[4], msg[5], msg[6], msg[7], null, msg[8], msg[9], msg[10], msg[11], msg[12], 0);
                    }
                }
                page.errorPopup(err);
                clearInterval(localStorage.getItem("intervalId"));
                localStorage.removeItem("intervalId");
                page.modalHide();
            });
    });
}

// Event Listener
const editMsg = (channelId, msgId, token) => () => {
    functionStore.editMessage = editMsgHandler(channelId, msgId, token);
    document.getElementById("edit-msg-submit-btn").addEventListener("click", functionStore.editMessage);
};

const setEvent = (channel, token, userId) => {
    channel.addEventListener("click", () => {
        removeListenerButton();
        setListenerButton(channel.id, token, userId);
        loadChannel(channel, token, userId);
    });
};

const setListenerButton = (channelId, token, userId) => {
    functionStore.joinFunction = joinChannel(channelId, token, userId);
    functionStore.leaveFunction = leaveChannel(channelId, token, userId);
    functionStore.inviteFunction = inviteChannel(channelId, token);
    functionStore.editFunction = editChannel(channelId, token, userId);
    functionStore.pinFunction = pinMessages(channelId, token);
    functionStore.infoFunction = channelInfo(channelId, token);
    functionStore.sendMsg = sendMsg(channelId, token, userId);
    document.getElementById("send-txt-btn").addEventListener("click", functionStore.sendMsg);
    document.getElementById("join-btn").addEventListener("click", functionStore.joinFunction);
    document.getElementById("leave-btn").addEventListener("click", functionStore.leaveFunction);
    document.getElementById("invite-btn").addEventListener("click", functionStore.inviteFunction);
    document.getElementById("edit-btn").addEventListener("click", functionStore.editFunction);
    document.getElementById("info-btn").addEventListener("click", functionStore.infoFunction);
    document.getElementById("pin-btn").addEventListener("click", functionStore.pinFunction);
};

const removeListenerButton = () => {
    document.getElementById("join-btn").removeEventListener("click", functionStore.joinFunction);
    document.getElementById("leave-btn").removeEventListener("click", functionStore.leaveFunction);
    document.getElementById("invite-btn").removeEventListener("click", functionStore.inviteFunction);
    document.getElementById("edit-btn").removeEventListener("click", functionStore.editFunction);
    document.getElementById("info-btn").removeEventListener("click", functionStore.infoFunction);
    document.getElementById("pin-btn").removeEventListener("click", functionStore.pinFunction);
    document.getElementById("edit-form-btn").removeEventListener("click", functionStore.editModal);
    document.getElementById("send-txt-btn").removeEventListener("click", functionStore.sendMsg);
};

const editChannel = (channelId, token, userId) => () => {
    functionStore.editModal = editHandler(channelId, token, userId);
    document.getElementById("edit-form-btn").addEventListener("click", functionStore.editModal);
};

// Milestone 1
export const showPage = (pageName, token = null, userId = null) => {
    for (const page of document.querySelectorAll(".page")) {
        page.setAttribute("style", "display: none !important");
    }

    if (pageName === "dashboard") {
        if (Object.keys(channelLastMsg).length === 0) {
            channelInterval(token, userId);
        }
        document.getElementById(`${pageName}-page`).setAttribute("style", "display: flex !important");
        document.querySelectorAll(".nav-btn").forEach((btn) => {
            btn.style.display = "none";
        });
        loadDashboard(token, userId);
        loadAvatar(userId, token);
        document.getElementById("input-msg-img-btn").onclick = function () {
            document.getElementById("input-msg-img").click();
        };
    } else {
        document.getElementById(`${pageName}-page`).setAttribute("style", "display: block !important");
        document.getElementById("footer").setAttribute("style", "display: flex !important");
        document.querySelectorAll(".nav-btn").forEach((btn) => {
            btn.style.display = "inline-block";
        });
    }
};

// Milestone 2
const loadDashboard = (token, userId) => {
    const channelPage = document.getElementById("channels-page");
    while (channelPage.firstChild != undefined) {
        channelPage.removeChild(channelPage.firstChild);
    }
    apiCall("/channel", "GET", {}, true, token).then((body) => {
        let des = "";
        console.log("load dashboard");
        for (const channel of body.channels) {
            if (!check.checkChannelExists(channel.id, channel.name)) {
                let status = "public";
                if (channel.private === true) {
                    status = "private";
                }
                des = `Welcome to ${channel.name}!`;
                if (status === "private") {
                    if (channel.members.includes(parseInt(userId))) {
                        channelPage.prepend(render.channelListRendered(render.capitalise(channel.name), status, des, channel.id));
                        setEvent(document.getElementById(channel.id), token, userId);
                    }
                } else {
                    channelPage.prepend(render.channelListRendered(render.capitalise(channel.name), status, des, channel.id));
                    setEvent(document.getElementById(channel.id), token, userId);
                }
            }
        }
    });
};

const loadChannel = (channel, token, userId) => {
    index = 0;
    document.getElementById("info-btn").classList.remove("hidden");
    if (functionStore.fetchMsg !== null) {
        document.getElementById("message_container").removeEventListener("scroll", functionStore.fetchMsg);
    }
    functionStore.fetchMsg = fetchNewMsg(channel, token, userId);
    document.getElementById("message_container").addEventListener("scroll", functionStore.fetchMsg);
    const msgContainer = document.getElementById("message_container");
    document.querySelectorAll(".channel").forEach((channel) => {
        channel.classList.remove("active");
        while (msgContainer.firstChild !== null) {
            msgContainer.removeChild(msgContainer.firstChild);
        }
    });
    channel.classList.add("active");
    getChannelById(channel.id, token, userId);
};

const msgData = (channelId, token, userId, index = 0) => {
    if (index === 0) {
        msgStoreClone = {};
    }
    page.modalShow();
    apiCall(`/message/${channelId}`, "GET", `start=${index}`, true, token)
        .then((body) => {
            if (body.messages.length === 0 && index !== 0) {
                throw new Error("No more messages");
            }
            body.messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
            const msgs = [];
            for (const msg of body.messages) {
                if (!check.checkMsgExists(msg.id)) {
                    let time;
                    const isEdit = msg.edited;
                    if (isEdit === true) {
                        time = new Date(msg.editedAt);
                        time = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
                    } else {
                        time = new Date(msg.sentAt);
                        time = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
                    }

                    msgs.push({
                        msgContainer: msg.message,
                        msgId: msg.id,
                        isEdit: isEdit,
                        time: time,
                        senderId: msg.sender,
                        isPin: msg.pinned,
                        reacts: msg.reacts,
                        imgMsg: msg.image,
                    });
                }
            }

            const promise = Promise.all(msgs.map((msg) => apiCall(`/user/${msg.senderId}`, "GET", {}, true, token)));
            promise
                .then((values) => {
                    let msgDiv = null;
                    let i = 0;
                    for (const body of values) {
                        const msg = msgs[i];
                        let imgLink = body.image;
                        if (imgLink === null || imgLink === "") {
                            imgLink = "../assets/default-profile.png";
                        }
                        const name = body.name;
                        msgDiv = createNewMsg(
                            imgLink,
                            name,
                            msg.msgContainer,
                            msg.msgId,
                            msg.isEdit,
                            msg.time,
                            msg.isPin,
                            msg.imgMsg,
                            msgDiv,
                            msg.reacts,
                            msg.senderId,
                            token,
                            channelId,
                            userId,
                            index,
                            true
                        );
                        i++;
                    }
                    console.log(JSON.parse(localStorage.getItem("dataStoreClone")));
                })
                .then(() => {
                    page.modalHide();
                });
        })
        .catch((err) => {
            page.modalHide();
            page.errorPopup(err);
        });
};

const getChannelById = (channelId, token, userId) => {
    apiCall(`/channel/${channelId}`, "GET", {}, true, token)
        .then(() => {
            document.getElementById("join-btn").style.display = "none";
            document.getElementById("leave-btn").style.display = "inline-block";
            document.getElementById("invite-btn").style.display = "inline-block";
            document.getElementById("edit-btn").style.display = "inline-block";
            document.getElementById("info-btn").style.display = "inline-block";
            document.getElementById("pin-btn").style.display = "inline-block";
        })
        .then(() => {
            msgData(channelId, token, userId);
        })
        .catch((err) => {
            page.errorPopup(err);
            document.getElementById("join-btn").style.display = "inline-block";
            document.getElementById("leave-btn").style.display = "none";
            document.getElementById("invite-btn").style.display = "none";
            document.getElementById("edit-btn").style.display = "none";
            document.getElementById("info-btn").style.display = "none";
            document.getElementById("pin-btn").style.display = "none";
        });
};

const joinChannel = (channelId, token, userId) => () => {
    apiCall(`/channel/${channelId}/join`, "POST", {}, true, token)
        .then(() => {
            loadChannel(document.getElementById(channelId), token, userId);
        })
        .catch((err) => {
            page.errorPopup(err);
        });
};

const leaveChannel = (channelId, token, userId) => () => {
    apiCall(`/channel/${channelId}/leave`, "POST", {}, true, token)
        .then(() => {
            loadDashboard(token, userId);
        })
        .catch((err) => {
            page.errorPopup(err);
        });
};

const channelInfo = (channelId, token) => () => {
    apiCall(`/channel/${channelId}`, "GET", {}, true, token)
        .then((body) => {
            const modal = new bootstrap.Modal(document.getElementById("channel-info-modal"));
            document.getElementById("name-channel").innerHTML = body.name;
            if (body.description === "") {
                document.getElementById("des-channel").innerHTML = "No description";
            } else {
                document.getElementById("des-channel").innerHTML = body.description;
            }

            if (body.private === true) {
                document.getElementById("type-channel").innerHTML = "Private";
            } else {
                document.getElementById("type-channel").innerHTML = "Public";
            }
            const timestamp = new Date(body.createdAt);
            document.getElementById("time-channel").innerHTML = `${timestamp.getDate()}/${timestamp.getMonth() + 1}/${timestamp.getFullYear()}`;
            nameOfCreator(body.creator, token);
            modal.show();
        })
        .catch((err) => {
            page.errorPopup(err);
        });
};

// Milestone 3
const deleteMsg = (channelId, msgId, token) => () => {
    apiCall(`/message/${channelId}/${msgId}`, "DELETE", {}, true, token)
        .then(() => {
            document.getElementById(msgId).remove();
        })
        .catch((err) => {
            page.errorPopup(err);
        });
};

const pinMsg = (channelId, msgId, token, pin) => () => {
    const pinImg = document.getElementById(`pin-msg-${msgId}`).querySelector("img");
    if (pin === true) {
        apiCall(`/message/unpin/${channelId}/${msgId}`, "POST", {}, true, token).then(() => {
            pinImg.setAttribute("src", "../assets/pin.svg");
            pin = false;
        });
    } else {
        apiCall(`/message/pin/${channelId}/${msgId}`, "POST", {}, true, token).then(() => {
            pinImg.setAttribute("src", "../assets/unpin.svg");
            pin = true;
        });
    }
    pinMsgFunction[msgId] = pinMsg(channelId, msgId, token, pin);
};

const editMsgHandler = (channelId, msgId, token) => () => {
    let msg = document.getElementById("msg-edit").value;
    const imgFile = document.getElementById("img-edit").files[0];
    if (msg !== "" && imgFile !== undefined) {
        msg = document.getElementById("msg-edit").value = "";
        document.getElementById("img-edit").value = "";
        page.errorPopup("Please only edit message or image");
        return;
    }
    if (imgFile === undefined) {
        const image = "";
        apiCall(`/message/${channelId}/${msgId}`, "PUT", { message: msg, image: image }, true, token)
            .then(() => {
                document.getElementById(`is-edit-${msgId}`).classList.remove("hidden");
                if (document.getElementById(`msg-content-${msgId}`) !== null) {
                    document.getElementById(`msg-content-${msgId}`).innerHTML = msg;
                } else {
                    document.getElementById(`img-content-${msgId}`).setAttribute("src", image);
                    const msgTag = document.createElement("p");
                    msgTag.setAttribute("id", `msg-content-${msgId}`);
                    msgTag.setAttribute("class", "mb-0");
                    msgTag.innerHTML = msg;
                    document.getElementById(`img-content-${msgId}`).insertAdjacentElement("afterend", msgTag);
                    document.getElementById(`img-content-${msgId}`).remove();
                }
                document.getElementById(`msg-time-${msgId}`).innerHTML = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
                document.getElementById("msg-edit").value = "";
                document.getElementById("img-edit").value = "";
                document.getElementById("edit-msg-submit-btn").removeEventListener("click", functionStore.editMessage);
            })
            .catch((err) => {
                page.errorPopup(err);
            });
    } else {
        fileToDataUrl(document.getElementById("img-edit").files[0])
            .then((image) => {
                apiCall(`/message/${channelId}/${msgId}`, "PUT", { message: msg, image: image }, true, token)
                    .then(() => {
                        document.getElementById(`is-edit-${msgId}`).classList.remove("hidden");
                        if (document.getElementById(`img-content-${msgId}`) !== null) {
                            document.getElementById(`img-content-${msgId}`).setAttribute("src", image);
                        } else {
                            const imgTag = document.createElement("img");
                            imgTag.setAttribute("src", image);
                            imgTag.setAttribute("id", `img-content-${msgId}`);
                            imgTag.setAttribute("alt", "message-image");
                            imgTag.setAttribute("width", "100");
                            imgTag.setAttribute("height", "100");
                            imgTag.setAttribute("data-bs-toggle", "modal");
                            imgTag.setAttribute("data-bs-target", "#images-modal");
                            document.getElementById(`msg-content-${msgId}`).insertAdjacentElement("afterend", imgTag);
                            document.getElementById(`msg-content-${msgId}`).remove();
                            document.getElementById(`img-content-${msgId}`).addEventListener("click", imgModal(channelId, token, msgId));
                        }
                        document.getElementById(`msg-time-${msgId}`).innerHTML = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
                        document.getElementById("msg-edit").value = "";
                        document.getElementById("img-edit").value = "";
                        document.getElementById("edit-msg-submit-btn").removeEventListener("click", functionStore.editMessage);
                    })
                    .then(() => {
                        document.getElementById("img-edit").value = "";
                    })
                    .catch((err) => {
                        page.errorPopup(err);
                    });
            })
            .catch((err) => {
                page.errorPopup(err);
            });
    }
};

const emoji =
    (channelId, msgId, token, userId, type, index = 0, isReact = false) =>
    () => {
        apiCall(`/message/${channelId}`, "GET", `start=${index}`, true, token)
            .then((body) => {
                for (const msg of body.messages) {
                    if (msg.id === msgId) {
                        for (const react of msg.reacts) {
                            if (react.user === parseInt(userId) && react.react === type) {
                                isReact = true;
                                throw new Error();
                            }
                        }
                    }
                }
                if (body.messages.length === 0) {
                    throw new Error();
                }
            })
            .then(emoji(channelId, msgId, token, userId, type, index + 25, isReact))
            .catch(() => {
                if (isReact === true) {
                    apiCall(`/message/unreact/${channelId}/${msgId}`, "POST", { react: type }, true, token)
                        .then(() => {
                            document.getElementById(`${type}-count-${msgId}`).innerHTML = parseInt(document.getElementById(`${type}-count-${msgId}`).innerHTML) - 1;
                            isReact = false;
                        })
                        .catch((err) => {
                            page.errorPopup(err);
                        });
                } else {
                    apiCall(`/message/react/${channelId}/${msgId}`, "POST", { react: type }, true, token)
                        .then(() => {
                            document.getElementById(`${type}-count-${msgId}`).innerHTML = parseInt(document.getElementById(`${type}-count-${msgId}`).innerHTML) + 1;
                            isReact = true;
                        })
                        .catch((err) => {
                            page.errorPopup(err);
                        });
                }
            });
    };

const createNewMsg = (imgLink, name, msgContainer, msgId, isEdit, time, isPin, imgMsg, msgDiv, reacts, senderId, token, channelId, userId, index, online = false) => {
    if (index === 0) {
        document.getElementById("message_container").appendChild(render.msgListRendered(imgLink, name, msgContainer, msgId, isEdit, time, isPin, imgMsg));
        document.getElementById(msgId).scrollIntoView();
    } else {
        if (msgDiv === null) {
            msgDiv = render.msgListRendered(imgLink, name, msgContainer, msgId, isEdit, time, isPin, imgMsg);
            document.getElementById("message_container").prepend(msgDiv);
        } else {
            const cloneDiv = render.msgListRendered(imgLink, name, msgContainer, msgId, isEdit, time, isPin, imgMsg);
            msgDiv.insertAdjacentElement("afterend", cloneDiv);
            msgDiv = cloneDiv;
        }
    }
    if (online === true) {
        msgStoreClone[msgId] = [imgLink, name, msgContainer, msgId, isEdit, time, isPin, imgMsg, reacts, senderId, token, channelId, userId];
        dataStoreClone[channelId] = msgStoreClone;
        localStorage.setItem("dataStoreClone", JSON.stringify(dataStoreClone));
    }
    for (const react of reacts) {
        document.getElementById(`${react.react}-count-${msgId}`).innerHTML = parseInt(document.getElementById(`${react.react}-count-${msgId}`).innerHTML) + 1;
    }
    if (msgContainer === undefined || msgContainer === "") {
        document.getElementById(`img-content-${msgId}`).addEventListener("click", imgModal(channelId, token, msgId));
    }
    document.getElementById(`view-profie-${msgId}`).addEventListener("click", viewProfile(senderId, token));
    document.getElementById(`delete-msg-${msgId}`).addEventListener("click", deleteMsg(channelId, msgId, token));
    document.getElementById(`edit-msg-${msgId}`).addEventListener("click", editMsg(channelId, msgId, token));
    pinMsgFunction[msgId] = pinMsg(channelId, msgId, token, isPin);
    document.getElementById(`pin-msg-${msgId}`).addEventListener("click", pinMsgFunction[msgId]);
    document.getElementById(`kiss-${msgId}`).addEventListener("click", emoji(channelId, msgId, token, userId, "kiss"));
    document.getElementById(`suprise-${msgId}`).addEventListener("click", emoji(channelId, msgId, token, userId, "suprise"));
    document.getElementById(`angry-${msgId}`).addEventListener("click", emoji(channelId, msgId, token, userId, "angry"));
    return msgDiv;
};

const editHandler = (channelId, token, userId) => () => {
    let name = document.getElementById("edit-channel-name").value;
    const description = document.getElementById("edit-description").value;
    reset.resetEditForm();
    if (name === "") {
        name = undefined;
    }

    apiCall(
        `/channel/${channelId}`,
        "PUT",
        {
            name: name,
            description: description,
        },
        true,
        token
    ).then(() => {
        showPage("dashboard", token, userId);
    });
    document.getElementById("edit-form-btn").removeEventListener("click", functionStore.editModal);
};

const pinMessages =
    (channelId, token, index = 0) =>
    () => {
        if (currChannelId === null) {
            currChannelId = channelId;
        } else if (currChannelId != channelId || index === 0) {
            document.getElementById("pin-msg-data").innerHTML = "";
            currChannelId = channelId;
        }
        apiCall(`/message/${channelId}`, "GET", `start=${index}`, true, token)
            .then((body) => {
                const msgs = [];
                body.messages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
                for (const msg of body.messages) {
                    if (msg.pinned === true && !check.checkMsgPin(msg.id)) {
                        msgs.push({
                            msgContainer: msg.message,
                            msgId: msg.id,
                            senderId: msg.sender,
                        });
                    }
                }

                const promise = Promise.all(msgs.map((msg) => apiCall(`/user/${msg.senderId}`, "GET", {}, true, token)));
                promise.then((values) => {
                    let i = 0;
                    for (const body of values) {
                        const msg = msgs[i];
                        let imgLink = body.image;
                        if (imgLink === null || imgLink === "") {
                            imgLink = "../assets/default-profile.png";
                        }
                        const name = body.name;
                        document.getElementById("pin-msg-data").appendChild(render.msgPinRendered(imgLink, name, msg.msgContainer, msg.msgId));
                        i++;
                    }
                });
                if (body.messages.length === 0) {
                    throw new Error("No more to fetch");
                }
            })
            .then(pinMessages(channelId, token, index + 25))
            .catch((err) => {
                console.log(err);
            });
    };

const sendMsg = (channelId, token, userId) => () => {
    let msg = document.getElementById("input-area").value;
    const imgFile = document.getElementById("input-msg-img").files[0];
    if (imgFile !== undefined && msg !== "") {
        document.getElementById("input-area").value = "";
        document.getElementById("input-msg-img").value = "";
        page.errorPopup("Please choose either image or text");
        return;
    }
    if (imgFile === undefined) {
        if (msg === "" || check.containsOnlyWhiteSpace(msg)) {
            msg = undefined;
        }

        apiCall(
            `/message/${channelId}`,
            "POST",
            {
                message: msg,
                image: undefined,
            },
            true,
            token
        )
            .then(() => {
                document.getElementById("input-area").value = "";
                document.getElementById("input-msg-img").value = "";
                msgData(channelId, token, userId);
            })
            .catch((err) => {
                page.errorPopup(err);
            });
    } else {
        fileToDataUrl(document.getElementById("input-msg-img").files[0])
            .then((dataUrl) => {
                apiCall(
                    `/message/${channelId}`,
                    "POST",
                    {
                        message: undefined,
                        image: dataUrl,
                    },
                    true,
                    token
                )
                    .then(() => {
                        document.getElementById("input-area").value = "";
                        document.getElementById("input-msg-img").value = "";
                        msgData(channelId, token, userId);
                    })
                    .catch((err) => {
                        console.log("inside");
                        page.errorPopup(err);
                    });
            })
            .catch((err) => {
                page.errorPopup(err);
            });
    }
};

// Milestone 4
const viewProfile = (userId, token) => () => {
    apiCall(`/user/${userId}`, "GET", {}, true, token)
        .then((body) => {
            const modal = new bootstrap.Modal(document.getElementById("profile-view"));
            document.getElementById("view-profile-name").innerHTML = body.name;
            if (body.image === null || body.image === "") {
                document.getElementById("view-profile-img").setAttribute("src", "../assets/default-profile.png");
            } else {
                document.getElementById("view-profile-img").setAttribute("src", body.image);
            }
            document.getElementById("view-profile-email").innerHTML = body.email;
            document.getElementById("view-profile-bio").innerHTML = body.bio;
            modal.show();
        })
        .catch((err) => {
            page.errorPopup(err);
        });
};

const inviteChannel = (channelId, token) => () => {
    document.getElementById("user-invite-list").innerHTML = "";
    apiCall(`/user`, "GET", {}, true, token).then((body) => {
        const users = [];
        for (const user of body.users) {
            users.push(user.id);
        }
        const promise = Promise.all(users.map((user) => apiCall(`/user/${user}`, "GET", {}, true, token)));
        promise.then((values) => {
            values.sort((a, b) => a.name.localeCompare(b.name));
            let i = 0;
            for (const user of values) {
                const userId = users[i];
                let imgLink = user.image;
                if (imgLink === null || imgLink === "") {
                    imgLink = "../assets/default-profile.png";
                }
                const name = user.name;
                document.getElementById("user-invite-list").appendChild(render.userInviteRendered(name, userId, imgLink));
                i++;
            }
        });
    });
    functionStore.inviteSubmit = inviteSubmit(channelId, token);
    document.getElementById("submit-invite-btn").addEventListener("click", functionStore.inviteSubmit);
};

const inviteSubmit = (channelId, token) => () => {
    const users = [];
    const userInviteList = document.getElementById("user-invite-list").querySelectorAll(".form-check-input");
    for (const user of userInviteList) {
        if (user.checked === true) {
            users.push(parseInt(user.id));
        }
    }
    const promise = Promise.any(users.map((user) => apiCall(`/channel/${channelId}/invite`, "POST", { userId: user }, true, token)));
    promise
        .then(() => {
            page.errorPopup("New users are added to this channel.", "Invite success");
        })
        .catch(() => {
            page.errorPopup("User is already a member of this channel");
        });
    document.getElementById("submit-invite-btn").removeEventListener("click", functionStore.inviteSubmit);
};

// Milestone 5
const imgModal =
    (channelId, token, msgId, index = 0) =>
    () => {
        if (index === 0) {
            document.getElementById("img-carousel-list").innerHTML = "";
        }
        apiCall(`/message/${channelId}`, "GET", `start=${index}`, true, token)
            .then((body) => {
                for (const msg of body.messages) {
                    if (msg.image !== "" && msg.image !== undefined) {
                        if (msg.id === parseInt(msgId)) {
                            document.getElementById("img-carousel-list").prepend(render.imgRendered(msg.image, true));
                        } else {
                            document.getElementById("img-carousel-list").prepend(render.imgRendered(msg.image));
                        }
                    }
                }

                if (body.messages.length === 0) {
                    throw new Error("No more to fetch");
                }
            })
            .then(imgModal(channelId, token, msgId, index + 25))
            .catch((err) => {
                console.log(err);
            });
    };
// Milestone 6
const fetchNewMsg = (channel, token, userId) => () => {
    if (document.getElementById("message_container").scrollTop === 0 && document.getElementById("message_container").scrollHeight != 616) {
        console.log("loading .....");
        index += 25;
        msgData(channel.id, token, userId, index);
    }
};

const channelInterval = (token, userId) => {
    const intervalId = setInterval(() => {
        apiCall(`/channel`, "GET", {}, true, token).then((body) => {
            const channelIdList = [];
            for (const channel of body.channels) {
                if (channel.members.includes(parseInt(userId))) {
                    channelIdList.push(channel.id);
                }
            }
            const promise = Promise.all(channelIdList.map((channelId) => apiCall(`/message/${channelId}`, "GET", `start=0`, true, token)));
            promise
                .then((values) => {
                    let index = 0;
                    for (const msgs of values) {
                        msgs.messages.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));
                        if (channelLastMsg[channelIdList[index]] !== msgs.messages[0].message) {
                            console.log(msgs.messages[0].message);
                            console.log("update");
                            channelLastMsg[channelIdList[index]] = msgs.messages[0].message;
                            const element = document.getElementById(channelIdList[index]);
                            document.getElementById("channels-page").removeChild(element);
                            document.getElementById("channels-page").prepend(element);
                        }
                        index++;
                    }
                })
                .catch(() => {});
        });
    }, 1000);
    localStorage.setItem("intervalId", intervalId);
};

// Other helper functions
const nameOfCreator = (userId, token) => {
    apiCall(`/user/${userId}`, "GET", {}, true, token)
        .then((body) => {
            document.getElementById("creator-channel").innerHTML = body.name;
        })
        .catch((err) => {
            page.errorPopup(err);
        });
};

const loadAvatar = (userId, token) => {
    apiCall(`/user/${userId}`, "GET", {}, true, token)
        .then((body) => {
            if (body.image !== null && body.image !== "") {
                document.getElementById("profile-avatar").setAttribute("src", body.image);
            }
        })
        .catch((err) => {
            page.errorPopup(err);
        });
};
