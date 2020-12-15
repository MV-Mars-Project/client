"use strict";

let dragStarted = false;
let dragInitialized = false;
let dragInfo = {
    started: false,
    initialized: false,
    startPos: null,
    prevPos: null
};

function initQuickAccess() {
    document.querySelector('#quick-access > header').updateEventListener('touchstart', dragStart);
    document.querySelector('#quick-access > header').updateEventListener('touchmove', dragMove);
    document.querySelector('#quick-access > header').updateEventListener('touchend', dragEnd);
}

function dragStart(e) {
    if (!dragInfo.started) {
        dragInfo.startPos = document.querySelector('#quick-access').offsetTop;
    }
    document.querySelector('#quick-access').style.top = `${dragInfo.startPos}px`
    dragInfo.started = true;
    dragInfo.prevPos = dragInfo.startPos;
}

function dragMove(e) {
    e.preventDefault();
    dragInfo.initialized = true;
    let curPos = e.clientY || e.touches[0].clientY;
    document.querySelector('#quick-access').style.transform = `translateY(${-(dragInfo.startPos - curPos)}px)`;
    dragInfo.prevPos = dragInfo.prevPos - (dragInfo.prevPos - curPos);
}

function dragEnd(e) {
    document.querySelector('#quick-access').style.transition = 'transform 0.3s ease-in-out';

    if (dragInfo.prevPos < dragInfo.startPos * .7 || (!dragInfo.initialized && !document.querySelector('#quick-access').classList.contains('active'))) {
        document.querySelector('#quick-access').style.transform = `translateY(${0 - dragInfo.startPos}px)`;
        goTo('#quick-access');
    } else {
        document.querySelector('#quick-access').style.transform = `translateY(0)`;
        goBack();
    }
    dragInfo.initialized = false;
    setTimeout(() => {
        document.querySelector('#quick-access').style.transform = `translateY(0)`;
        document.querySelector('#quick-access').style.top = ``;
        document.querySelector('#quick-access').style.transition = '';
    }, 400)
}