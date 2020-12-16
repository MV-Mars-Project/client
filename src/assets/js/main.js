"use strict";

let config;
let endpoints;

document.addEventListener("DOMContentLoaded", init);

async function init() {
    Element.prototype.updateEventListener = function (event, cb) {
        this.removeEventListener(event, cb);
        this.addEventListener(event, cb);
    }
    setViewPortStatic();
    addPages();
    initNavigation();
    initAuthentication();
    // Temporary hack to allow local testing of the web client and server.
    // document.cookie = 'Authorization=Basic cHJvamVjdG1lZGV3ZXJrZXI6dmVya2VlcmQ=';
    // config = await loadConfig();
    // api = `${config.host ? config.host + '/': ''}${config.group ? config.group + '/' : ''}api/`;
    // initSettings();

    podOrderInit();

    navigator.serviceWorker.register('/mars-15/service-worker.js', {
        scope: '/mars-15/'
    });
    // navigator.serviceWorker.register('/service-worker.js', {
    //     scope: '/'
    // });

}

function initMain() {
    getEndpoints()
        .then(ep => {
            endpoints = ep;
            initSearchbar();
            initQuickAccess();
        });
    getTravelHistory()
        .then(history => {
            loadRecentTrips(history);
        });
    getUserInfo()
        .then(userInfo => {
            checkForFriendRequests(userInfo);
            loadFriends(userInfo);
            loadDataInQuickAccess(userInfo);
        });
    if (!mapInitialized) initMap();
}

function addPages() {
    addPage('main', [], {
        onOpen: initMain
    });
    addPage('#settings', ['#open-settings'], {onOpen: initSettings});
    addPage('#quick-access');
    addPage('#account-settings', ['li[data-open-setting="account-settings"]'], {onOpen: initAccountSettings});
    addPage('#friends-settings', ['li[data-open-setting="friends-settings"]'], {onOpen: initFriendSettings});
    addPage('#add-friend', ['.add-friend'], {onOpen: initAddFriend});
    addPage('#report', ['li[data-open-setting="report"]'], {onOpen: initReport});
    addPage('#pod-order-view', ['*[data-order-pod]'], {dynamicData: true, onOpen: payloadConsumer});
    addPage('#process-payment', ['*[data-order-pod]']);
    addPage('#authentication', []);
    addPage('#signin', ['#open-signin']);
    addPage('#signup', ['#open-signup'], {
        onOpen: () => {
            getEndpoints()
                .then(ep => {
                    endpoints = ep;
                    loadHomeEndpointList();
                })
        }
    });
    addPage('#subscription-settings', ['li[data-open-setting="subscription-settings"', '#edit-subscription', '#edit-subscription-quick'], {onOpen: initSubscription})
}

function closeModal(e) {
    e.preventDefault();

    e.currentTarget.parentNode.parentNode.classList.remove('active');
}

function setViewPortStatic() {
    const viewheight = window.screen.height,
        viewwidth = window.screen.width,
        viewport = document.querySelector("meta[name=viewport]");

    viewport.setAttribute("content", `height=${viewheight}, width=${viewwidth}, initial-scale=1.0`);
}

async function loadConfig() {
    const response = await fetch("config.json");
    return response.json();
}

function loadRecentTrips(history) {
    let tripContainer = document.querySelector('#recent-trips > ul');

    tripContainer.innerHTML = "";
    history.forEach(route => {
        tripContainer.innerHTML += recentTrip(route);
    })
}

function loadDataInQuickAccess(userInfo) {
    document.querySelector('#quick-access header h3').innerHTML = userInfo.name;
    document.querySelector('#quick-access article#subscription-quick p').innerHTML = userInfo.subscription.name;
}

function payloadConsumer(payload) {
    const loc = document.querySelector('#select-location');
    const text = document.querySelector('#select-location-text');
    const from = payload.from;

    if (from) {
        loc.value = from.getAttribute('data-order-pod');
        text.value = from.querySelector('h2') ? from.querySelector('h2').innerHTML : from.innerHTML;
    } else {
        loc.value = payload.id;
        text.value = payload.name;
    }
}