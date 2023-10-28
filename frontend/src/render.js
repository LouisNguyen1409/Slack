export const msgListRendered = (imgLink, name, message, msgId, edit, time, pin, imgMsg) => {
    const divTag = document.createElement("div");
    divTag.setAttribute("class", "list-group-item py-3 lh-sm channel px-3 justify-content-between");
    divTag.setAttribute("id", msgId);
    const divTag2 = document.createElement("div");
    divTag2.setAttribute("class", "d-flex w-100 align-items-center justify-content-between");
    const strongTag = document.createElement("strong");
    strongTag.setAttribute("class", "mb-1");
    strongTag.setAttribute("id", `view-profie-${msgId}`);
    const imgTag = document.createElement("img");
    imgTag.setAttribute("src", imgLink);
    imgTag.setAttribute("alt", "Avatar");
    imgTag.setAttribute("id", "msg-avatar");
    imgTag.setAttribute("class", "me-1");
    const nameTag = document.createElement("span");
    nameTag.innerHTML = name;
    strongTag.appendChild(imgTag);
    strongTag.appendChild(nameTag);
    const divTag3 = document.createElement("div");
    const editBtn = document.createElement("button");
    editBtn.setAttribute("type", "button");
    editBtn.setAttribute("class", "btn btn-primary btn-sm ms-1");
    editBtn.setAttribute("id", `edit-msg-${msgId}`);
    editBtn.setAttribute("data-bs-toggle", "modal");
    editBtn.setAttribute("data-bs-target", "#edit-msg");
    const editImg = document.createElement("img");
    editImg.setAttribute("src", "../assets/edit.svg");
    editImg.setAttribute("alt", "edit-icon");
    editBtn.appendChild(editImg);
    const pinBtn = document.createElement("button");
    pinBtn.setAttribute("type", "button");
    pinBtn.setAttribute("class", "btn btn-primary btn-sm ms-1");
    pinBtn.setAttribute("id", `pin-msg-${msgId}`);
    const pinImg = document.createElement("img");
    if (pin === true) {
        pinImg.setAttribute("src", "../assets/unpin.svg");
    } else {
        pinImg.setAttribute("src", "../assets/pin.svg");
    }

    pinImg.setAttribute("alt", "pin-icon");
    pinBtn.appendChild(pinImg);
    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("class", "btn btn-primary btn-sm ms-1");
    deleteBtn.setAttribute("id", `delete-msg-${msgId}`);
    const deleteImg = document.createElement("img");
    deleteImg.setAttribute("src", "../assets/bin.svg");
    deleteImg.setAttribute("alt", "bin-icon");
    deleteBtn.appendChild(deleteImg);
    divTag3.appendChild(editBtn);
    divTag3.appendChild(pinBtn);
    divTag3.appendChild(deleteBtn);
    divTag2.appendChild(strongTag);
    divTag2.appendChild(divTag3);
    divTag.appendChild(divTag2);
    const divTag4 = document.createElement("div");
    divTag4.setAttribute("class", "mb-1 small d-flex justify-content-between mt-2 align-items-center");
    const divTag5 = document.createElement("div");
    divTag5.setAttribute("id", "msg-box");
    let pTag;
    if (message !== undefined && message !== "") {
        pTag = document.createElement("p");
        pTag.setAttribute("id", `msg-content-${msgId}`);
        pTag.setAttribute("class", "mb-0");
        pTag.innerHTML = message;
    } else {
        pTag = document.createElement("img");
        pTag.setAttribute("src", imgMsg);
        pTag.setAttribute("id", `img-content-${msgId}`);
        pTag.setAttribute("alt", "message-image");
        pTag.setAttribute("width", "100");
        pTag.setAttribute("height", "100");
        pTag.setAttribute("data-bs-toggle", "modal");
        pTag.setAttribute("data-bs-target", "#images-modal");
    }
    const smallTag1 = document.createElement("small");
    smallTag1.setAttribute("id", `msg-time-${msgId}`);
    smallTag1.innerHTML = time;
    const smallTag = document.createElement("small");
    smallTag.setAttribute("id", `is-edit-${msgId}`);
    if (edit !== true) {
        smallTag.setAttribute("class", "hidden");
    }
    smallTag.innerHTML = "Edited ";
    const divTag6 = document.createElement("div");
    divTag6.setAttribute("id", "react-area");
    divTag6.setAttribute("class", "mt-1");
    const span1 = document.createElement("span");
    span1.setAttribute("class", "me-2");
    const img1 = document.createElement("img");
    img1.setAttribute("src", "../assets/kiss.svg");
    img1.setAttribute("class", "me-1 icon");
    const subSpan1 = document.createElement("span");
    subSpan1.setAttribute("id", `kiss-count-${msgId}`);
    subSpan1.innerHTML = 0;
    span1.appendChild(img1);
    span1.appendChild(subSpan1);
    const span2 = document.createElement("span");
    span2.setAttribute("class", "me-2");
    const img2 = document.createElement("img");
    img2.setAttribute("src", "../assets/suprise.svg");
    img2.setAttribute("class", "me-1 icon");
    const subSpan2 = document.createElement("span");
    subSpan2.setAttribute("id", `suprise-count-${msgId}`);
    subSpan2.innerHTML = 0;
    span2.appendChild(img2);
    span2.appendChild(subSpan2);
    const span3 = document.createElement("span");
    span3.setAttribute("class", "me-2");
    const img3 = document.createElement("img");
    img3.setAttribute("src", "../assets/angry.svg");
    img3.setAttribute("class", "me-1 icon");
    const subSpan3 = document.createElement("span");
    subSpan3.setAttribute("id", `angry-count-${msgId}`);
    subSpan3.innerHTML = 0;
    span3.appendChild(img3);
    span3.appendChild(subSpan3);
    divTag6.appendChild(span1);
    divTag6.appendChild(span2);
    divTag6.appendChild(span3);
    divTag5.appendChild(pTag);
    divTag5.appendChild(document.createElement("br"));
    divTag5.appendChild(smallTag);
    divTag5.appendChild(smallTag1);
    divTag5.appendChild(divTag6);
    const divTag7 = document.createElement("div");
    const kissBtn = document.createElement("button");
    kissBtn.setAttribute("type", "button");
    kissBtn.setAttribute("class", "btn btn-dark btn-sm ms-1");
    kissBtn.setAttribute("id", `kiss-${msgId}`);
    const kissImg = document.createElement("img");
    kissImg.setAttribute("src", "../assets/kiss.svg");
    kissImg.setAttribute("alt", "kiss-icon");
    kissBtn.appendChild(kissImg);
    const supriseBtn = document.createElement("button");
    supriseBtn.setAttribute("type", "button");
    supriseBtn.setAttribute("class", "btn btn-dark btn-sm ms-1");
    supriseBtn.setAttribute("id", `suprise-${msgId}`);
    const supriseImg = document.createElement("img");
    supriseImg.setAttribute("src", "../assets/suprise.svg");
    supriseImg.setAttribute("alt", "suprise-icon");
    supriseBtn.appendChild(supriseImg);
    const angryBtn = document.createElement("button");
    angryBtn.setAttribute("type", "button");
    angryBtn.setAttribute("class", "btn btn-dark btn-sm ms-1");
    const angryImg = document.createElement("img");
    angryImg.setAttribute("src", "../assets/angry.svg");
    angryImg.setAttribute("alt", "angry-icon");
    angryBtn.setAttribute("id", `angry-${msgId}`);
    angryBtn.appendChild(angryImg);
    divTag7.appendChild(kissBtn);
    divTag7.appendChild(supriseBtn);
    divTag7.appendChild(angryBtn);
    divTag4.appendChild(divTag5);
    divTag4.appendChild(divTag7);
    divTag.appendChild(divTag4);
    return divTag;
};

export const channelListRendered = (name, status, des, channelId) => {
    const aTag = document.createElement("a");
    aTag.setAttribute("href", "#");
    aTag.setAttribute("class", "list-group-item list-group-item-action py-3 lh-sm channel"); // add active for current channel
    aTag.setAttribute("aria-current", "true");
    aTag.setAttribute("id", channelId);
    aTag.setAttribute("name", name);
    const divTag = document.createElement("div");
    divTag.setAttribute("class", "d-flex w-100 align-items-center justify-content-between");
    const strongTag = document.createElement("strong");
    strongTag.setAttribute("class", "mb-1");
    strongTag.innerHTML = name; //name
    const smallTag = document.createElement("small");
    smallTag.innerHTML = status; //status
    divTag.appendChild(strongTag);
    divTag.appendChild(smallTag);
    aTag.appendChild(divTag);
    const divTag2 = document.createElement("div");
    divTag2.setAttribute("class", "col-10 mb-1 small");
    divTag2.innerHTML = des; //description
    aTag.appendChild(divTag2);
    return aTag;
};

export const imgRendered = (imgLink, isSelect = false) => {
    const divTag = document.createElement("div");
    if (isSelect === true) {
        divTag.setAttribute("class", "carousel-item active");
    } else {
        divTag.setAttribute("class", "carousel-item");
    }
    const imgTag = document.createElement("img");
    imgTag.setAttribute("src", imgLink);
    imgTag.setAttribute("class", "d-block w-100");
    imgTag.setAttribute("alt", "message-image");
    divTag.appendChild(imgTag);
    return divTag;
};

export const msgPinRendered = (imgLink, name, message, msgId) => {
    const divTag = document.createElement("div");
    divTag.setAttribute("class", "list-group-item py-3 lh-sm channel px-3 justify-content-between");
    divTag.setAttribute("id", msgId);
    const divTag2 = document.createElement("div");
    divTag2.setAttribute("class", "d-flex w-100 align-items-center justify-content-between");
    const strongTag = document.createElement("strong");
    strongTag.setAttribute("class", "mb-1");
    const imgTag = document.createElement("img");
    imgTag.setAttribute("src", imgLink);
    imgTag.setAttribute("alt", "Avatar");
    imgTag.setAttribute("id", "msg-avatar");
    imgTag.setAttribute("class", "me-1");
    const nameTag = document.createElement("span");
    nameTag.innerHTML = name;
    strongTag.appendChild(imgTag);
    strongTag.appendChild(nameTag);
    divTag2.appendChild(strongTag);
    divTag.appendChild(divTag2);
    const divTag4 = document.createElement("div");
    divTag4.setAttribute("class", "mb-1 small d-flex justify-content-between mt-2 align-items-center");
    const divTag5 = document.createElement("div");
    divTag5.setAttribute("id", "msg-box");
    const pTag = document.createElement("p");
    pTag.setAttribute("class", "mb-0");
    pTag.innerHTML = message;
    divTag5.appendChild(pTag);
    divTag4.appendChild(divTag5);
    divTag.appendChild(divTag4);
    return divTag;
};

export const userInviteRendered = (name, userId, imgLink) => {
    const labelTag = document.createElement("label");
    labelTag.setAttribute("class", "list-group-item d-flex gap-2 align-items-center");
    const inputTag = document.createElement("input");
    inputTag.setAttribute("class", "form-check-input flex-shrink-0");
    inputTag.setAttribute("type", "checkbox");
    inputTag.setAttribute("value", "");
    inputTag.setAttribute("id", userId);
    const spanTag = document.createElement("span");
    const imgTag = document.createElement("img");
    imgTag.setAttribute("src", imgLink);
    imgTag.setAttribute("alt", "Avatar");
    imgTag.setAttribute("width", "30");
    imgTag.setAttribute("height", "30");
    imgTag.setAttribute("class", "rounded-circle mx-4 my-2");
    const nameTag = document.createElement("span");
    nameTag.innerHTML = name;
    spanTag.appendChild(imgTag);
    spanTag.appendChild(nameTag);
    labelTag.appendChild(inputTag);
    labelTag.appendChild(spanTag);
    return labelTag;
};

export const capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}