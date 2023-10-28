export const containsOnlyWhiteSpace = (input) => {
    return /^\s*$/.test(input);
};

export const checkMsgPin = (id) => {
    const msgList = document.getElementById("pin-msg-data").querySelectorAll(".list-group-item");
    for (const msgItem of msgList) {
        if (parseInt(msgItem.getAttribute("id")) === id) {
            return true;
        }
    }
    return false;
};

export const checkChannelExists = (id, name) => {
    const channelList = document.querySelectorAll(".channel");
    for (const channelItem of channelList) {
        if (parseInt(channelItem.getAttribute("id")) === id && channelItem.getAttribute("name").toLowerCase() === name.toLowerCase()) {
            return true;
        }
    }
    return false;
};

export const checkMsgExists = (id) => {
    const msgList = document.getElementById("message_container").querySelectorAll(".list-group-item");
    for (const msgItem of msgList) {
        if (parseInt(msgItem.getAttribute("id")) === id) {
            return true;
        }
    }
    return false;
};