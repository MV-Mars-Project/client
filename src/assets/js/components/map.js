"use strict";

function initMap() {
    //set the map config
    const map = L.map('map', {
        wheelPxPerZoomLevel: 150,
        zoom: 12,
        center: [52.468728, -2.025817]
    });

    //set the tileLayer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18,
        minZoom: 9,

    }).addTo(map)

    //show the center
    const marker = L.marker([52.468728, -2.025817]).addTo(map);
    marker.bindTooltip("CENTER",).openTooltip();

    //limit the map to these bounds
    const northEast = L.latLng(53, -1.5);
    const southWest = L.latLng(52, -2.7);
    map.setMaxBounds(L.latLngBounds(southWest, northEast));

    //add the endpoints to the map
    getTravelEndpoints().then(endpoints => {
        endpoints.forEach(endpoint => {
            const CD = endpoint.coordinate;
            L.marker(L.latLng(CD.latitude, CD.longitude)).addTo(map).bindTooltip(`${endpoint.name}`).openTooltip();

        });
    });

    //show the dome
    const dome = L.circle([52.468728, -2.025817], {
        radius: 10000,
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
    }).addTo(map);
    dome.bindPopup("This is the start dome");

    //limit the tooltips to a certain zoom
    setToolTipRange(map, 12);
}

function getDistance(origin, destination) {     // return distance in meters

    const lon1 = Math.rad(origin[1]),
        lat1 = Math.rad(origin[0]),
        lon2 = Math.rad(destination[1]),
        lat2 = Math.rad(destination[0]);

    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;

    const a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    const EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}

Math.rad = function (degree) {
    return degree * Math.PI / 180;
}

function setToolTipRange(map, tooltipThreshold) {
    let lastZoom;
    map.on('zoomend', function () {
        const zoom = map.getZoom();
        if (zoom < tooltipThreshold && (!lastZoom || lastZoom >= tooltipThreshold)) {
            map.eachLayer(function (l) {
                const tooltip = l.getTooltip();
                if (tooltip) {
                    l.unbindTooltip().bindTooltip(tooltip, {
                        permanent: false
                    })
                }
            })
        } else if (zoom >= tooltipThreshold && (!lastZoom || lastZoom < tooltipThreshold)) {
            map.eachLayer(function (l) {
                const tooltip = l.getTooltip();
                if (tooltip) {
                    l.unbindTooltip().bindTooltip(tooltip, {
                        permanent: true
                    })
                }
            });
        }
        lastZoom = zoom;
    });
}