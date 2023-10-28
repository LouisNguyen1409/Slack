export const errorPopup = (msg, title = null) => {
    let modal = new bootstrap.Modal(document.getElementById("error-page"));
    if (title !== null) {
        document.getElementById("error-title").innerHTML = title;
    }
    document.getElementById("error-msg").innerHTML = msg;
    modal.show();
};

export const modalHide = () => {
    document.body.setAttribute("class", "");
    document.body.setAttribute("style", "");
    document.querySelector(".modal-backdrop").remove();
    document.getElementById("loading-modal").setAttribute("class", "modal fade");
    document.getElementById("loading-modal").setAttribute("style", "display: none");
};

export const modalShow = () => {
    document.body.setAttribute("class", "modal-open");
    document.body.setAttribute("style", "overflow: hidden; padding-right: 0px;");
    document.body.appendChild(document.createElement("div")).setAttribute("class", "modal-backdrop fade show");
    document.getElementById("loading-modal").setAttribute("class", "modal fade show");
    document.getElementById("loading-modal").setAttribute("style", "display: block");
};