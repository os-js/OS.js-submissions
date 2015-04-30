var mapsPage = {
  "id": "maps",
  "url": "https://maps.google.com/maps",
  "name": i18n("ser101"),
  "iconName": "places",
  "extraCss": true
};

mapsPage.onPageDisplay = function() {
    mapsPage.header.searchbox.focus();
};

mapsPage.layers = {
    "none": {
        "name": i18n("msg304") //No Layer
    },
    "traffic": {
        "name": i18n("msg305"), //Traffic
        "load": function() {
            this.layers.push(
                new google.maps.TrafficLayer()
            );
        }
    },
    "transit": {
        "name": i18n("msg306"), //Public Transport
        "load": function() {
            this.layers.push(
                new google.maps.TransitLayer()
            );
        }
    },
    "weather": {
        "name": i18n("msg307"), //Weather
        "load": function() {
            this.layers.push(
                new google.maps.weather.CloudLayer(),
                new google.maps.weather.WeatherLayer({
                    temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
                })
            );
        }
    },
    "BicyclingLayer": {
        "name": i18n("msg308"), //Cycling
        "load": function() {
            this.layers.push(
                new google.maps.BicyclingLayer()
            );
        }
    },
    "PanoramioLayer": {
        "name": i18n("ser114"), //i18n todo
        "load": function() {
            this.layers.push(
                new google.maps.panoramio.PanoramioLayer()
            );
        }
    }
};

mapsPage.maptypes = {
    "ROADMAP": {
        "name": i18n("msg171")
    }, //Roadmap
    "TERRAIN": {
        "name": i18n("msg172")
    }, //Terrain
    "SATELLITE": {
        "name": i18n("msg173")
    }, //Satellite
    "HYBRID": {
        "name": i18n("msg174")
    } //Hybrid
};

mapsPage.init = function() {
    changeLoading("on", mapsPage.body);

    mapsPage.header = createPageHeader({
        "iconName": "places",
        "withBottomBorder": true,
        "searchboxProperties": {
            "onEnter": mapsPage.searchOnEnter,
            "placeholder": i18n("msg476"), //Search Google Maps...
            "stayOnPageOnEnter": true
        },
        "sidenavProperties": {}
    });

    mapsPage.header.classList.add("transparent");

    mapsPage.pageTabs = createTabs({
        "items": mapsPage.layers,
        "onChange": function(value) {
            if (!mapsPage.layers[value].loaded) {
                mapsPage.layers[value].layers = [];
                mapsPage.layers[value].loaded = true;
                if (mapsPage.layers[value].load) {
                    mapsPage.layers[value].load();
                };
            };
            mapsPage.layers[value].layers.forEach(function(layer) {
                layer.setMap(mapsPage.map);
            });
            if (mapsPage.previousLayer) {
                mapsPage.layers[mapsPage.previousLayer].layers.forEach(function(layer) {
                    layer.setMap();
                });
            };

            mapsPage.previousLayer = value;
        },
        "activeItem": "none"
    });
    mapsPage.header.sidenav.appendChild(mapsPage.pageTabs);

    //mapsPage.body.appendChild(mapsPage.header);

    mapsPage.content = createContent();
    mapsPage.body.appendChild(mapsPage.content);

    mapsPage.minimap = document.createElement("div");
    mapsPage.minimap.className = "minimap";
    mapsPage.mapType = "ROADMAP";
    mapsPage.minimap.addEventListener("click", function() {
        mapsPage.mapType = mapsPage.mapType == "ROADMAP" ? "HYBRID" : "ROADMAP";
        mapsPage.minimap.dataset.mapType = mapsPage.mapType;
        mapsPage.map.setMapTypeId(google.maps.MapTypeId[mapsPage.mapType]);
    })
    mapsPage.minimap.appendChild(document.createElement("div"));
    //mapsPage.body.appendChild(mapsPage.minimap);

    mapsPage.loadMapsApi();
};

mapsPage.createToolbar = function() {
    var toolbar = createToolbar();
    toolbar.classList.add("layerToolbar");


    /* layer */
    var layerOptions = [];
    for (var i in mapsPage.layers) {
        layerOptions.push({
            "value": i,
            "label": mapsPage.layers[i].name
        });
    };

    var layerSelect = createSelectBox({
        "onChange": function() {
            var value = this.value;
            if (!mapsPage.layers[value].loaded) {
                mapsPage.layers[value].layers = [];
                mapsPage.layers[value].loaded = true;
                if (mapsPage.layers[value].load) {
                    mapsPage.layers[value].load();
                };
            };
            mapsPage.layers[value].layers.forEach(function(layer) {
                layer.setMap(mapsPage.map);
            });
            if (mapsPage.previousLayer) {
                mapsPage.layers[mapsPage.previousLayer].layers.forEach(function(layer) {
                    layer.setMap();
                });
            };

            mapsPage.previousLayer = value;
        },
        "options": layerOptions
    });
    toolbar.appendChild(layerSelect);


    /* maptype */
    var maptypeOptions = [{
            "value": "ROADMAP",
            "label": i18n("msg171")
        }, //Roadmap
        {
            "value": "TERRAIN",
            "label": i18n("msg172")
        }, //Terrain
        {
            "value": "SATELLITE",
            "label": i18n("msg173")
        }, //Satellite
        {
            "value": "HYBRID",
            "label": i18n("msg174")
        } //Hybrid
    ];
    var defaultMapType = mapsPage.getDefaultMapType();

    maptypeOptions.forEach(function(json) {
        if (json.value == defaultMapType) {
            json.selected = true;
        };
    });
    var maptypeSelect = createSelectBox({
        "onChange": function() {
            mapsPage.map.setMapTypeId(google.maps.MapTypeId[this.value]);
        },
        "options": maptypeOptions
    });
    toolbar.appendChild(maptypeSelect);

    return toolbar;
};

mapsPage.searchOnEnter = function(query) {
    mapsPage.codeAddress(unescape(encodeURIComponent(query)), true);
    mapsPage.header.searchbox.blur();
};

mapsPage.getDefaultMapType = function() {
    var mapType = storage.get("prefMapsMaptype");
    var mapTypeConversion = {
        "up_mapType=m": "ROADMAP",
        "up_mapType=k": "SATELLITE",
        "up_mapType=p": "TERRAIN",
        "up_mapType=h": "HYBRID"
    };
    return mapTypeConversion[mapType] || "ROADMAP";
};

mapsPage.loadLinksSection = function(linksSection) {
    var links = [{
        "name": i18n("msg309"), //Location History
        "link": "https://maps.google.com/locationhistory/",
        "icon": "maps"
    }, {
        "name": i18n("ser100"),
        "link": "http://www.google.com/mapmaker",
        "icon": "mapmaker"
    }, {
        "name": i18n("msg43"),
        "link": "https://plus.google.com/local",
        "icon": "local"
    }, {
        "name": i18n("ser132"),
        "link": "https://www.google.com/sky/",
        "icon": "skymap"
    }, {
        "name": i18n("ser106"),
        "link": "https://www.google.com/moon/",
        "icon": "moon"
    }, {
        "name": i18n("ser103"),
        "link": "https://www.google.com/mars/",
        "icon": "mars"
    }];
    linksSection.appendChild(createShortcutList(links));
};

mapsPage.loadMapsApi = function() {
    var url = createUrl("https://maps.googleapis.com/maps/api/js", {
        "key": googleApi.key,
        "v": "3.exp",
        "sensor": false,
        "libraries": "places,weather,panoramio",
        "callback": "mapsPageApiCallback",
        "hl": browserLang
    });
    var script = document.createElement("script");
    script.setAttribute("async", true);
    script.setAttribute("src", url);
    document.head.appendChild(script);
};

function mapsPageApiCallback() {
    mapsPage.geocoder = new google.maps.Geocoder();
    google.maps.visualRefresh = true;
    var mapDiv = mapsPage.content;
    var mapOptions = {
        panControl: false,
        center: new google.maps.LatLng(10, 0),
        zoom: 1,
        mapTypeId: google.maps.MapTypeId[mapsPage.getDefaultMapType()],
        mapTypeControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
            style: google.maps.ZoomControlStyle.SMALL
        }
    };
    mapsPage.map = new google.maps.Map(mapDiv, mapOptions);
    google.maps.event.addListenerOnce(mapsPage.map, "tilesloaded", function() {
        changeLoading("off", mapsPage.body);
    });

    mapsPage.infowindow = new google.maps.InfoWindow();
    mapsPage.marker = new google.maps.Marker({
        map: mapsPage.map
    });

    mapsPage.map.controls[google.maps.ControlPosition.TOP_CENTER].push(mapsPage.header);
    mapsPage.map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(mapsPage.minimap);

    mapsPage.displayDefaultLocation();
    var autocomplete = new google.maps.places.Autocomplete(mapsPage.header.searchbox);
    autocomplete.bindTo("bounds", mapsPage.map);
    google.maps.event.addListener(autocomplete, "place_changed", function() {
        mapsPage.browseToAddress(autocomplete.getPlace(), true);
    });

    google.maps.event.addListener(mapsPage.map, "idle", mapsPage.fixMinimap);
    google.maps.event.addListener(mapsPage.map, "drag", mapsPage.fixInfoWindows);
    google.maps.event.addListener(mapsPage.map, "click", function() {
        mapsPage.header.sidenav.hide();
        mapsPage.header.closeSidenavButton();
    });
    setInterval(mapsPage.fixInfoWindows);
};

mapsPage.fixInfoWindows = function() {
    [].forEach.call(document.querySelectorAll('#mapsPage .content div[style*="cursor: default;"]:not(.infoWindow)'), function(infoWindow) {
        var oldInfoWindow = mapsPage.body.querySelector(".content>.infoWindow");
        if (oldInfoWindow) {
            mapsPage.content.removeChild(oldInfoWindow);
        };
        mapsPage.content.appendChild(infoWindow);
        infoWindow.classList.add("infoWindow");
    });
};

mapsPage.fixMinimap = function() {
    /*
    var mapContainer = mapsPage.content.querySelector("div:first-child>div:first-child>div:first-child>div:first-child");
    var innerHTML = mapContainer.getAttribute("style").indexOf("cursor") != -1 ? mapContainer.innerHTML : mapContainer.querySelector("div").innerHTML;
    if (innerHTML.indexOf("khms") != -1) {
        mapsPage.minimap.querySelector("div").innerHTML = innerHTML.replace(/\khms/g, 'mts').replace(/\kh?/g, 'vt?lyrs=m@0&');
    } else {
        mapsPage.minimap.querySelector("div").innerHTML = innerHTML.replace(/\lyrs=m/g, 'lyrs=s');

    };
    */
};

mapsPage.codeAddress = function(query, markerAndBubble) {
    mapsPage.geocoder.geocode({
        "address": query
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            mapsPage.browseToAddress(results[0], markerAndBubble);
        };
    });
};

mapsPage.browseToAddress = function(place, markerAndBubble) {
    if (place.geometry) {
        if (place.geometry.viewport) {
            mapsPage.map.fitBounds(place.geometry.viewport);
        } else {
            mapsPage.map.setCenter(place.geometry.location);
            mapsPage.map.setZoom(17);
        };
    };
    if (markerAndBubble) {
        mapsPage.infowindow.close();
        mapsPage.marker.setPosition(place.geometry.location);

        google.maps.event.addListener(mapsPage.marker, 'click', function() {
            mapsPage.infowindow.open(mapsPage.map, this);
        });

        var name = place.name ? place.name : place.address_components[0].short_name;

        var infoWindowContent = document.createElement("div");
        infoWindowContent.className = "infowindow-container";

        var leftDiv = document.createElement("div");

        var header = document.createElement("div");
        header.className = "gm-title";
        header.textContent = name;
        leftDiv.appendChild(header);

        var placeInfo = document.createTextNode(place.formatted_address);
        leftDiv.appendChild(placeInfo);

        var br = document.createElement("br");
        leftDiv.appendChild(br);

        var a = document.createElement("a");
        a.className = "view-on-maps";
        a.href = "#";
        a.addEventListener("click", function(){
          var url = createUrl("https://maps.google.com/", {
            "ll": mapsPage.map.center.k + "," + mapsPage.map.center.A,
            "z": mapsPage.map.zoom,
            "q": mapsPage.header.searchbox.value
          });
          window.open(url, "_blank");
        });
        a.textContent = "View on Google Maps";
        leftDiv.appendChild(a);

        infoWindowContent.appendChild(leftDiv);

        var rightDiv = document.createElement("div");

        //"text": i18n("msg648"), //Navigate to
        var navigateTo = document.createElement("div");
        navigateTo.className = "directions-button";
        navigateTo.addEventListener("click", function() {
            var url = "https://www.google.com/maps?daddr=" + mapsPage.header.searchbox.value;
            window.open(url, "_blank");

        })
        rightDiv.appendChild(navigateTo);

        infoWindowContent.appendChild(rightDiv);

        mapsPage.infowindow.setContent(infoWindowContent);

        mapsPage.infowindow.open(mapsPage.map, mapsPage.marker);
    };
};

mapsPage.displayDefaultLocation = function() {
    var prefMapsLocation = storage.get("prefMapsLocation");
    if (prefMapsLocation && prefMapsLocation != i18n("chromeLangLocation") && prefMapsLocation != "Atlantic Ocean") {
        var locationString = decodeURI(storage.get("prefMapsLocation"));
        mapsPage.codeAddress(locationString, false);
    };
};

window.addEventListener("load", function() {
  document.body.id = "mapsPage";
  mapsPage.body = document.body;
  mapsPage.init();
});

