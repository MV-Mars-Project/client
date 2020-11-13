"use strict";
const userInfo = {
    name: "Jane Roe",
    subscription: "None",
    isBusiness: false
}

function userInit() {
    document.querySelectorAll('#account-settings li a').forEach(el => el.addEventListener('click', toggleEdit));

    loadDataInSettings();
}

function toggleEdit(e) {
    e.preventDefault();
    const clickedEl = e.currentTarget;
    
    switch (clickedEl.id) {
        case "edit-name":
            if (clickedEl.innerHTML === "Cancel") {
                clickedEl.innerHTML = "Edit";
                clickedEl.parentNode.querySelector('input').value = userInfo.name;
                clickedEl.parentNode.querySelector('input').classList.add('hidden');
                clickedEl.parentNode.querySelector('p').classList.remove('hidden');
            } else {
                clickedEl.innerHTML = "Cancel";
                clickedEl.parentNode.querySelector('input').classList.remove('hidden');
                clickedEl.parentNode.querySelector('input').focus();
                clickedEl.parentNode.querySelector('input').select();
                clickedEl.parentNode.querySelector('p').classList.add('hidden');
            }
            break;
        case "edit-password":
            if (clickedEl.innerHTML === "Cancel") {
                clickedEl.innerHTML = "Change password";
                clickedEl.parentNode.querySelector('#new-pwd').value = "";
                clickedEl.parentNode.querySelector('#current-pwd').value = "";
                clickedEl.parentNode.classList.add('hidden');
            } else {
                clickedEl.innerHTML = "Cancel";
                clickedEl.parentNode.classList.remove('hidden');
            }
            break;
        default:
            break;
    }
}

function loadDataInSettings() {
    document.querySelector('#name-settings p').innerHTML = userInfo.name;
    document.querySelector('#new-name').value = userInfo.name;
    document.querySelector('#subscription-settings p').innerHTML = userInfo.subscription;
    document.querySelector('#business-settings input').checked = userInfo.isBusiness;
}