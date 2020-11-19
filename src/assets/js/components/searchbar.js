"use strict";

function initSearchbar() {
    document.querySelectorAll(".searchbar").forEach(el => loadSearchbar(el));
    document.querySelectorAll(".searchbar > input").forEach(el => el.addEventListener('focusin', toggleFocus));
    document.querySelectorAll(".searchbar > input").forEach(el => el.addEventListener('focusout', toggleFocus));
    document.querySelectorAll(".searchbar > input").forEach(el => el.addEventListener('input', (e) => loadSearchbar(e.currentTarget.parentNode, e.currentTarget.value)));
}

function toggleFocus(e) {
    let wait = 0;
    if (e.target.parentNode.classList.contains("active")) {
        e.target.parentNode.querySelector('ul').style.height = '0';
        wait = 300;
    }
    setTimeout(() => {
        e.target.parentNode.classList.toggle('active');
        e.target.parentNode.querySelector('ul').style.height = '';
    }, wait);
}

function loadSearchbar(sb, filter = "") {
    let endpointsToShow = [...endpoints];

    console.log(filter);

    if (filter !== "") {
        endpointsToShow = endpointsToShow.filter(endpoint => endpoint.available && endpoint.name.toLowerCase().includes(filter.toLowerCase()));
    }
    endpointsToShow = endpointsToShow.slice(0, 6);

    sb.querySelector('ul').innerHTML = "";
    endpointsToShow.forEach(endpoint => {
        sb.querySelector('ul').innerHTML += `<li id="sb-endpoint-${endpoint.id}">${endpoint.name}</li>`;
    });
}