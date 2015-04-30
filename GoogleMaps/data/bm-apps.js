var i18nMessages = {};

function i18n(id, message) {
  return i18nMessages[id] ? i18nMessages[id].message : (message || "placeholder");
};

try {
  var isChrome = chrome ? true : false;
} catch (e) {
  var isChrome = false;
};

var isOpera = window.navigator.userAgent.indexOf("OPR") != -1;
var browserLang = window.navigator.language;
var extensionId = i18n("@@extension_id", "eignhdfgaldabilaaegmdfbajngjmoke");
var retina = window.devicePixelRatio > 1;

var googleApi = {
  "scopes": [],
  "key": "AIzaSyBxQHSmNx3qqtgEWbm_buYhl6IkjMYAGZA",
  "clientId": "472288864107.apps.googleusercontent.com",
  "functionsToCall": [],
  "script": document.createElement("script"),
  "load": function(item) {
    if (!googleApi.script.src) {
      googleApi.script.src = "https://apis.google.com/js/client.js?onload=googleApiOnFirstLoad";
      document.head.appendChild(googleApi.script);
    }
    if (googleApi.script.getAttribute("gapi_processed") != "true") {
      console.log("GAPI NOT PROCESSED");
      googleApi.functionsToCall.push(item);
    } else {
      console.log("GAPI PROCESSED");
      item.callback();
    };
  }
};

googleApi.authorize = function(parameters){
  console.log("auth1");
  if(googleApi.authorizationInProcess){
    console.log("auth7");
    setTimeout(function(){googleApi.authorize(parameters)},100);
  } else {
    console.log("auth2");
    googleApi.authorizationInProcess = true;

    var authorizeParameters = {
      "client_id": googleApi.clientId,
      "include_granted_scopes": true,
      "scope": googleApi.scopes.concat(parameters.scope),
      "immediate": parameters.immediate
    };
    console.log("auth8", authorizeParameters);
    var authorizeCallback = function(authResult){
      console.log("auth3", authResult);
      googleApi.authorizationInProcess = false;
      if (authResult && !authResult.error) {
        // Access token has been successfully retrieved, requests can be sent to the API.
        googleApi.scopes = googleApi.scopes.concat(parameters.scope);
        if(parameters.success){
          parameters.success();
        };
      } else {
        if(googleApi.scopes.length !== 0){
          gapi.auth.authorize({
            "client_id": googleApi.clientId,
            "include_granted_scopes": true,
            "scope": googleApi.scopes,
            "immediate": true
          });
        };
        // No access token could be retrieved, show the button to start the authorization flow.
        if(parameters.error){
          parameters.error();
        };
      };
    };

    console.log("auth9", authorizeCallback);
    gapi.auth.authorize(authorizeParameters, authorizeCallback);
    console.log("auth4");
  };
  console.log("auth5");
};

function googleApiOnFirstLoad() {
  googleApi.functionsToCall.forEach(function(item) {
    item.callback();
  });
};

var storage = {
  "get": function(storageValue, defaultValue) {
    var value = localStorage.getItem(storageValue);
    if (defaultValue) {
      if (!value || value == "") {
        return defaultValue;
      };
    };
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    };
  },
  "set": function(storageValue, value) {
    localStorage.setItem(storageValue, JSON.stringify(value));
  },
  "remove": function(storageValue) {
    localStorage.removeItem(storageValue);
  }
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function createMoreLinksGhostContainer(clickFunction) {
  var moreLinksGhostContainer = document.createElement("div");
  moreLinksGhostContainer.className = "moreLinksGhostContainer";
  if (clickFunction) {
    moreLinksGhostContainer.addEventListener("click", clickFunction);
  };
  return moreLinksGhostContainer;
};

function createSearchMenu() {
  var searchMenu = document.createElement("div");
  searchMenu.toggle = function() {
    searchMenu.classList.toggle("on");
  };
  searchMenu.hide = function() {
    searchMenu.classList.remove("on");
  };
  searchMenu.show = function() {
    searchMenu.classList.add("on");
  };
  searchMenu.className = "searchbox-menu";
  return searchMenu;
};

function createSidenav(searchbox) {
  var sidenav = document.createElement("div");
  sidenav.className = "sidenav";
  sidenav.hide = function() {
    sidenav.classList.remove("on")
  };
  sidenav.show = function() {
    sidenav.classList.add("on")
  };
  sidenav.toggle = function() {
    sidenav.classList.toggle("on")
  };
  sidenav.addEventListener("click", function() {
    this.hide();
    if (searchbox) {
      searchbox.closeSidenavButton();
    };
  });
  return sidenav;
};

function createTabs(properties) {
  /* properties = {
    "items": {
      "id": {"name": string}
    },
    "onChange": function //optional
    "onActiveClick": function //optional
    "activeItem": string //optional
    "changeOnLoad": boolean //optional //onChange function will be called when the tabs are loaded
  } */
  var tabbar = document.createElement("div");
  tabbar.className = "toolbarTabs";
  tabbar.displayTab = function(id) {
    if (this.querySelector(".on").dataset.id != id) {
      this.querySelector(".on").classList.remove("on");
      this.querySelector('[data-id="' + id + '"]').classList.add("on");
      this.previousItem = this.activeItem;
      this.activeItem = id;
    };
  };
  tabbar.hideActiveItem = function() {
    tabbar.querySelector(".on").classList.remove("on");
  }
  tabbar.activeItem = properties.activeItem;
  for (var i in properties.items) {
    var li = document.createElement("li");
    li.dataset.id = i;
    li.addEventListener("click", function() {
      if (tabbar.querySelector(".on") != this) {
        if (tabbar.querySelector(".on")) {
          tabbar.querySelector(".on").classList.remove("on");
        };
        this.classList.add("on");
        tabbar.previousItem = tabbar.activeItem;
        tabbar.activeItem = this.dataset.id;
        if (properties.onChange) {
          properties.onChange(this.dataset.id);
        };
      } else {
        if (properties.onActiveClick) {
          properties.onChange(this.dataset.id);
        };
      };
    });
    if (i == properties.activeItem) {
      li.classList.add("on");
    };
    var span = document.createElement("span");
    span.textContent = properties.items[i].name;
    li.appendChild(span);
    tabbar.appendChild(li);
  };
  if (properties.changeOnLoad) {
    if (properties.onChange && properties.activeItem) {
      properties.onChange(properties.activeItem);
    };
  };
  return tabbar;
};

/**
 * Create a content container.
 * @param {object} properties The properties.
 * @config {boolean} [noContentShadow] Disables scroll shadow.
 * @config {boolean} [container] Defines whether the content inside the container has overflow or not.
 * @config {function} [onScrollBottom] Function that fires when the user scrolls all the way to the bottom.
 * @return {HTMLElement} The content container.
 */

function createContent(parameters) {
  var properties = parameters || {};

  var content = document.createElement("div");
  if (properties.container) {
    return createContainer();
  } else {
    content.className = "content";
    if (!properties.noContentShadow) {
      loadScrollShadow(content);
    };
    if (properties.onScrollBottom) {
      content.addEventListener("scroll", function() {
        if (this.scrollTop + this.offsetHeight == this.scrollHeight) {
          properties.onScrollBottom();
        };
      });
    };
  };
  return content;
};

function createCard(parameters) {
  var properties = parameters || {};

  var card = document.createElement("div");
  card.className = "card";

  if (properties.withPadding) {
    card.classList.add("with-padding");
  };

  return card;
};

function createContainer() {
  var container = document.createElement("div");
  container.className = "container";
  return container;
};

/**
 * Create a container for multiple contents.
 * @param {object} properties The properties.
 * @config {object} [items] The items that should be added to the container.
 * @config {string} [activeItem] The item that should be activated when loading the container.
 * @return {HTMLElement} The container with multiple contents.
 */

function createMultipleContents(parameters) {
  var properties = parameters || {
    "items": {}
  };
  /* how the items object should look like:
    "items": {
      itemId: {something}
    }
  */
  var container = createContainer();

  container.classList.add("multipleContents");
  container.pages = {};

  container.addPage = function(id, subContent) {
    container.pages[id] = subContent || createContent();
    container.pages[id].dataset.id = id;
    if (properties.activeItem == id) {
      container.pages[id].classList.add("on");
    };
    container.appendChild(container.pages[id]);
  };

  container.loadPage = function(id) {
    var item = properties.items[id];

    if (!item.loaded) {
      /* mark item as loaded */
      item.loaded = true;

      /* load and append content */
      var content = item.content ? item.content() : createContent();
      container.addPage(id, content);

      /* call after load function */
      if (item.afterLoad) {
        item.afterLoad(container.pages[id]);
      };
    };
  };

  if (properties.items) {
    for (var i in properties.items) {
      if (properties.items[i].loadOnInit) {
        container.loadPage(i);
      };
    };
  };

  container.displayPage = function(id) {
    var item = properties.items[id];
    container.loadPage(id);
    var displayedItem = container.querySelector(".on.container, .on.content");
    if (container.pages) {
      if (container.activeItem == id) {
        return;
      };
      if (container.pages[container.activeItem]) {
        container.pages[container.activeItem].classList.remove("on");
      };
    };
    container.querySelector('[data-id="' + id + '"]').classList.add("on");
    container.activeItem = id;
    if (item.onDisplay) {
      item.onDisplay(container.pages[id]);
    };
  };

  if (!properties.activeItem) {
    for (properties.activeItem in properties.items) break;
  };

  container.activeItem = properties.activeItem;

  container.displayPage(container.activeItem)

  return container;
};

/**
 * Create a container with an iframe.
 * @param {object} properties The properties.
 * @config {string} [src] The url of the iframe.
 * @config {boolean} [noLoading] Defines whether a loading graphic should be displayed.
 * @return {HTMLElement} The container with the iframe.
 */

function createIframe(parameters) {
  var properties = parameters || {};
  var container = createContainer();

  var iframe = document.createElement("iframe");

  if (!properties.noLoading) {
    changeLoading("on", container);
    iframe.addEventListener("load", function() {
      changeLoading("off", container);
    });
  };
  iframe.src = properties.src || "about:blank";

  container.changeUrl = function(url) {
    iframe.src = url;
  };

  container.changeHash = function(hash) {
    iframe.src = iframe.src.split("#")[0] + "#" + hash.replace("#", "");
  };

  container.sendMessage = function(message) {
    iframe.contentWindow.postMessage(message, iframe.src);
  };

  container.appendChild(iframe);

  return container;
};

/**
 * Create a links section.
 * @param {object} properties The properties.
 * @config {function} [onMouseEnter] Function which fires when the user enters the links section.
 * @config {function} [onFirstMouseEnter] Function which fires at the first time the user enters the links section.
 * @config {string} [name] The title of the links section.
 * @config {string} [text] The title of the links section.
 */

function createLinksSection(properties) {
  var linksSection = document.createElement("div");
  linksSection.className = "linksSection";

  linksSection.addEventListener("mouseenter", function() {
    if (this.style.maxHeight == "45px") {
      this.removeAttribute("style");
    };
  });
  if (properties.onMouseEnter) {
    linksSection.addEventListener("mouseenter", function() {
      properties.onMouseEnter(this);
    });
  };
  if (properties.onFirstMouseEnter) {
    var onFirstMouseEnter = function() {
      properties.onFirstMouseEnter(this);
      this.removeEventListener("mouseenter", onFirstMouseEnter);
    };
    linksSection.addEventListener("mouseenter", onFirstMouseEnter);
  };

  var header = document.createElement("header");
  header.addEventListener("click", function(i) {
    this.parentNode.style.maxHeight = "45px";
  });
  var p = document.createElement("p");
  p.textContent = properties.text || properties.name || i18n("msg26"); //Links
  header.appendChild(p);
  var arrowIcon = createIcon({
    "name": "arrow_down_large",
    "size": 21
  });
  header.appendChild(arrowIcon);

  linksSection.appendChild(header);
  return linksSection;
};

/**
 * Create a popup.
 * @param {object} properties The properties.
 * @config {deprecated} [className] The classname that should be added.
 * @config {string} [imgName] The image name for the header icon.
 * @config {string} [imgUrl] The image url for the header icon.
 * @config {string} [name] The title of the popup.
 * @config {boolean} [noCloseButton] Defines whether or not a close button should be added.
 */

function createPopup(properties) {
  var popup = document.createElement("div");
  if (properties.className) {
    popup.className = properties.className;
  };
  popup.classList.add("on");
  popup.classList.add("popup");
  var popupHeader = document.createElement("header");
  popupHeader.className = "popupHeader";
  if (properties.imgName || properties.imgUrl) {
    var imgContainer = document.createElement("span");
    var img = createIcon({
      "url": properties.imgUrl || undefined,
      "name": properties.imgName,
      "size": 32
    });
    imgContainer.appendChild(img);
    popupHeader.appendChild(imgContainer);
  }
  var name = document.createElement("p");
  name.textContent = properties.name || "";
  popupHeader.appendChild(name);
  if (!properties.noCloseButton) {
    var closeButton = document.createElement("span");
    closeButton.className = "closePopup";
    closeButton.addEventListener("click", function() {
      this.parentNode.parentNode.classList.remove("on");
    });
    popupHeader.appendChild(closeButton);
  };
  popup.appendChild(popupHeader);
  return popup;
};

/**
 * Create a header for cards.
 * @param {object} properties The properties.
 * @config {string} [text] The text of the header.
 * @config {string} [name] The text of the header, deprecated, use text instead.
 */

function createCardHeader(properties) {
  var cardHeader = document.createElement("div");
  cardHeader.className = "card-header";
  cardHeader.textContent = properties.text || properties.name;
  return cardHeader;
};

function createShortcutList(links, searchBox, onClick) {
  var ul = document.createElement("div");
  ul.setAttribute("class", "buttonList card");
  ul.dataset.searchBox = searchBox;

  function clickFunction() {
    var url;
    if (this.dataset.search) {
      var searchQuery = searchBox ? searchBox.value : null;
      url = searchQuery ? this.dataset.search.replace("[query]", encodeURIComponent(searchQuery)) : this.dataset.link;
    } else {
      url = this.dataset.link;
    };
    url.replace("[browserLang]", browserLang);
    window.open(url, "_blank");
  };

  links.forEach(function(item) {
    var properties = {
      "name": item.name || i18n("msg" + item.i18n),
      "imgName": item.icon || item.imgName,
      "searchUrl": item.search,
      "linkUrl": item.link,
      "onClick": onClick || clickFunction
    };

    ul.appendChild(createShortcut(properties));
  });

  return ul;
};

/**
 * Create a shortcut item.
 * @param {object} properties The properties.
 * @config {string} [text] The text of the shortcut.
 * @config {string} [name] The text of the shortcut, deprecated, use text instead.
 * @config {number} [i18n] The i18n id of the shortcut, deprecated, use text instead.
 * @config {url} [imgUrl] The url of the icon.
 * @config {url} [imgSrc] The src of the icon, deprecated, use imgUrl instead.
 * @config {string} [imgName] The name of the icon.
 * @config {string} [id] The id of the shortcut.
 * @config {url} [searchUrl] The search url.
 * @config {url} [linkUrl] The link url.
 * @config {function} [onClick] Function that is fired after clicking the shortcut.
 * @config {string} [tooltip] The tooltip of the shortcut.
 */

function createShortcut(properties) {
  var li = document.createElement("li");
  if (properties.id) {
    li.dataset.id = properties.id;
  };
  if (properties.searchUrl) {
    li.dataset.search = properties.searchUrl;
  };
  if (properties.linkUrl) {
    li.dataset.link = properties.linkUrl;
  };
  if (properties.tooltip) {
    li.setAttribute("tooltip", properties.tooltip);
  };
  var onClick = properties.onClick || properties.clickFunction || (properties.linkUrl ? function() {
    window.open(this.dataset.link, "_blank")
  } : undefined);
  if (onClick) {
    li.addEventListener("click", onClick);
  };
  var img = createIcon({
    "url": properties.imgUrl || properties.imgSrc || undefined,
    "name": properties.imgName,
    "size": 32
  });
  li.appendChild(img);

  var p = document.createElement("p");
  p.textContent = properties.text || properties.name || i18n(properties.i18n);
  li.appendChild(p);

  return li;
};

/**
 * Create an icon.
 * @param {object} properties The properties.
 * @config {string} [name] The name of the icon.
 * @config {url} [url] The url of the icon.
 * @config {url} [src] The url of the icon, deprecated, use url instead.
 * @config {number} [size] The size of the icon.
 * @config {string} [tooltip] The tooltip of the shortcut.
 */

function createIcon(properties) {
  var container = document.createElement("div");
  var img = document.createElement("img");
  if (properties.tooltip) {
    img.title = properties.tooltip;
  };
  if (properties.rotate) {
    img.setAttribute("style", "-webkit-transform: rotate(" + properties.rotate + ");transform: rotate(" + properties.rotate + ");");
  };
  if (properties.src || properties.url) {
    img.src = properties.src || properties.url;
    container.appendChild(img);
  } else {
    var defaultSize = properties.size || 32;
    img.height = defaultSize;
    img.width = defaultSize;

    var imgSize = retina ? defaultSize * 2 : defaultSize;
    var size = imgSize;

    function setIconSrc() {
      img.src = "http://altaica.altervista.org/img/bm-apps/" + size + "/" + properties.name + "-" + (properties.color || "") + size + ".png";
    };

    function imgOnError() {
      console.log("error");
      if (size == defaultSize) {
        console.log(img.src);
        properties.name = "placeholder";
        size = imgSize;
        console.log(imgSize);
        console.log(size);
        setIconSrc();
      } else {
        if (size == 2 * defaultSize) {
          size = defaultSize;
          setIconSrc();
        };
      };
    };

    img.addEventListener("error", imgOnError);
    setIconSrc();
  };
  container.appendChild(img);

  return container;
};

function createToolbar() {
  var toolbar = document.createElement("div");
  toolbar.className = "toolbar";
  return toolbar;
};

function createPageHeader(properties) {
  /*var properties = {
    onOpenSidenav: function, //optional
    onCloseSidenav: function, //optional
    withBottomBorder: boolean, //optional
    iconName: string,
    noWindowButton: boolean,
    sidenavProperties {
      onOpen: function,
      onClose: function
    },
    searchboxProperties: {
      onInput: function, //optional
      onEnter: function, //optional
      stayOnPageOnEnter: boolean, //optional
      buttonIcon: string, //optional
      buttonTooltip: string, //optional
      placeholder: string, //optional
      autoComplete: boolean, //optional
      noClearButton: boolean, //optional
      searchMenu: boolean
    },
    "searchmenuProperties": {}
  }*/

  var header = createToolbar();
  header.classList.add("page-header");
  if (properties.withBottomBorder) {
    header.classList.add("noSecondTopToolbar");
  };

  if (properties.iconName) {
    var serviceIcon = createIcon({
      "name": properties.iconName
    });
    if (properties.sidenavProperties) {
      if (properties.sidenavProperties.createSidenav !== false) {
        header.sidenav = createSidenav(header);
        header.appendChild(header.sidenav);
      };
      header.closeSidenavButton = function() {
        serviceIcon.classList.remove("on");
      };
      serviceIcon.classList.add("sidenav-button");
      serviceIcon.addEventListener("click", function() {
        if (header.sidenav) {
          header.sidenav.toggle();
        };
        this.classList.toggle("on");
        var sidenavEvent = this.classList.contains("on") ? "onOpen" : "onClose";
        if (properties.sidenavProperties[sidenavEvent]) {
          properties.sidenavProperties[sidenavEvent]();
        };
      });
    };
    header.appendChild(serviceIcon);
  };


  /* searchbox */
  header.searchbox = document.createElement("input");
  header.searchbox.className = "searchbox-input";
  header.searchbox.type = properties.searchboxProperties.noClearButton ? "text" : "search";
  header.searchbox.autocomplete = properties.searchboxProperties.autoComplete ? "on" : "off";
  header.searchbox.placeholder = properties.searchboxProperties.placeholder || "Search...";

  var searchButton = createButton({
    "color": "blue",
    "iconName": properties.searchboxProperties.buttonIcon || "search",
    "leftOpen": true
  });
  searchButton.classList.add("searchbox-button");
  if (properties.searchboxProperties.buttonTooltip) {
    searchButton.title = properties.searchboxProperties.buttonTooltip;
  };
  if (properties.searchboxProperties.onInput) {
    header.searchbox.addEventListener("input", function() {
      properties.searchboxProperties.onInput(header.searchbox.value);
    });
  };
  if (properties.searchboxProperties.onEnter) {
    searchButton.addEventListener("click", function() {
      properties.searchboxProperties.onEnter(header.searchbox.value);
    });
    if (properties.searchboxProperties.stayOnPageOnEnter) {
      header.searchbox.addEventListener("search", function() {
        properties.searchboxProperties.onEnter(header.searchbox.value);
      });
    } else {
      header.searchbox.addEventListener("keyup", function(evt) {
        if (evt.keyCode == 13) {
          properties.searchboxProperties.onEnter(header.searchbox.value);
        };
      });
    }
  };
  header.appendChild(header.searchbox);
  if (properties.searchmenuProperties) {
    header.searchmenu = createSearchMenu();
    header.searchbox.classList.add("searchbox-input-with-menu");
    header.appendChild(header.searchmenu);

    var searchMenuButton = document.createElement("div");
    searchMenuButton.className = "searchbox-menu-button";
    searchMenuButton.addEventListener("click", function() {
      header.searchmenu.toggle();
    });
    header.appendChild(searchMenuButton);

  };
  header.appendChild(searchButton);


  /* open in panel */
  if (false && !properties.noWindowButton) {
    var openInPanelIcon = createIcon({
      "name": "panel",
      "size": 21,
      "tooltip": i18n("msg482") //open widget in a panel
    });
    openInPanelIcon.className = "open-in-panel";
    openInPanelIcon.addEventListener("click", function() {
      var service = this.parentNode.parentNode.id.split("Page")[0];
      var servicePage = window[service + "Page"];
      var panel = "";
      if(!panel.length) {
        panel = openWindow({
          "type": "panel",
          "url": window.location,
          "width": 380,
          "height": 400,
        });
      }
    });
    header.appendChild(openInPanelIcon);
  };

  return header;
};

function refreshScrollShadow(element) {
  var scrollTop = element.scrollTop;
  element.classList[scrollTop + element.offsetHeight == element.scrollHeight ? "remove" : "add"]("bottomShadow");
  element.classList[scrollTop == 0 ? "remove" : "add"]("topShadow");
};

function loadScrollShadow(element) {
  element.addEventListener("scroll", function() {
    refreshScrollShadow(this);
  });
};

function changeLoading(state, element) {
  var ele = element;
  if (!element) {
    ele = document.body;
  };
  if (!ele.nodeType) {
    console.log("changeLoading with pagename is deprecated" + ">" + ele);
    ele = document.getElementById(element + "Page");
  };
  ele.classList[state == "on" ? "add" : "remove"]("loading");
};

function createUrl(baseUrl, urlParameters) {
  return baseUrl + createUrlParameters(urlParameters);
};

function createUrlParameters(object) {
  var urlParameters = "";
  for (var i in object) {
    if ((object[i] != undefined) && (object[i] != "undefined") && (object[i] != null)) {
      urlParameters += ((urlParameters.indexOf("?") == -1) ? "?" : "&") + i + "=" + object[i];
    };
  };
  return urlParameters;
};

/**
 * Open a new window.
 * @param {object} properties The properties.
 * @config {url} [url] The url of the window.
 * @config {number} [height] The height of the window.
 * @config {number} [width] The width of the window.
 * @config {string} [type] The type of the window, possible values: "tab", "window", "panel" and "popup"
 */

function openWindow(properties) {
  if (properties.type == "tab") {
    window.open(properties.url)
  } else {
    var cdpanel = parent.panels.create({"url":properties.url,"title":"Black Menu app","height":properties.height,"width":properties.width});
    return cdpanel;
  }
};


function createButton(properties) {
  /* properties = {
    color: string (blue, red, grey, white or green),
    style: jfk1 or jfk2,//optional
    iconName: //optional
    iconRotate: //optional
    size: string (small, medium or large)
    text: string,
    rightOpen: true,
    leftOpen: true,
    onClick: function,
    tooltip: string
  }*/

  var button = document.createElement("button");
  var classNames = [
    "button",
    properties.style,
    properties.rightOpen ? "right-open" : null,
    properties.leftOpen ? "left-open" : null,
    properties.size || "small",
    properties.color || "grey", (["red", "blue", "green"].indexOf(properties.color) != -1) ? "white-text" : null,
  ];
  button.className = classNames.filter(function(n) {
    return n
  }).join(" ");

  if (properties.text) {
    button.textContent = properties.text;
  };

  if (properties.tooltip) {
    button.title = properties.tooltip;
  };

  if (properties.onClick) {
    button.addEventListener("click", properties.onClick);
  };

  if (properties.iconName) {
    var img = createIcon({
      "size": 21,
      "name": properties.iconName,
      "rotate": properties.iconRotate
    });
    button.appendChild(img);
  };

  return button;
};

function createSelectBox(properties) {
  var selectBox = document.createElement("select");
  if (properties.id) {
    selectBox.id = properties.id;
  };
  selectBox.addEventListener("change", properties.onChange);
  properties.options.forEach(function(item) {
    var option = document.createElement("option");
    option.textContent = item.label || item.text;
    option.setAttribute("value", item.value);
    if (item.selected) {
      option.setAttribute("selected", "true")
    }
    selectBox.appendChild(option);
  });
  return selectBox;
};

function deprecatedProperty(property, name, extraText) {
  if (property) {
    console.log((name ? "the [" + name + "]" : "this") + "property is deprecated" + (extraText ? " - " + extraText : ""));
  };
};


var currentDate = new Date();
var currentDateArray = [
  currentDate.getFullYear(),
  currentDate.getMonth(),
  currentDate.getDate()
];

var monthNames = [
  "Jan",
  "Feb",
  "Mrt",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

function createDate(dateArray) {
  var date = "";
  if ((currentDateArray[0] == dateArray[0]) && (currentDateArray[1] == dateArray[1]) && (currentDateArray[2] == dateArray[2])) {
    date = "today";
  } else {
    if ((currentDateArray[0] == dateArray[0]) && (currentDateArray[1] == dateArray[1]) && ((currentDateArray[2] - dateArray[2]) == 1)) {
      date = "yesterday";
    } else {
      date = dateArray[2] + " " + monthNames[dateArray[1]] + ((currentDateArray[0] != dateArray[0]) ? (" " + dateArray[0]) : "");
    };
  };
  return date;
};


function getIndexes(source, find) {
  var result = [];
  for (i = 0; i < source.length; ++i) {
    if (source.substring(i, i + find.length) == find) {
      result.push(i);
    }
  }
  return result;
};

function highlight(container, text) {
  container.innerHTML = container.innerHTML.replace(/<mark class="highlight">/g, "").split("</mark>").join("");
  if (text) {
    [].forEach.call(container.querySelectorAll("*"), function(element) {
      if (element.textContent == element.innerHTML && element.textContent) {
        /*var regextext = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        var regex = new RegExp(regextext, "g");*/
        var regex = new RegExp('(' + text + ')', 'ig');
        element.innerHTML = element.innerHTML.replace(regex, '<mark class="highlight">$1</mark>');
      };
    });
  };
};



/**
 * Send an XMLHttpRequest
 * @param {object} properties The properties of the request.
 * @config {string} [type] The method of the request. Default: "GET"
 * @config {url} [url] The url of the request.
 * @config {function} [success] The function to call on success. Required
 * @config {function} [error] The function to call on error.
 * @config {function} [beforeSend] The function to call before the request is send.
 * @config {string} [data] The data to send with the request.
 * @config {string} [dataType] The dataType to return. Default is "TEXT". could be "TEXT", "JSON" and "XML"
 */

function ajax(parameters) {
  var xhr = new XMLHttpRequest();
  var url = parameters.proxy ? "../../proxy.php" : parameters.url;
  var type = parameters.proxy ? "POST" : (parameters.type || "GET");
  var data = parameters.proxy ? ("address="+encodeURIComponent(parameters.url)) : (parameters.data || null);
  xhr.open(type, url);
  if(parameters.proxy) {
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  }
  xhr.addEventListener("readystatechange", function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        if (parameters.dataType === "TEXT" || !parameters.dataType) {
          parameters.success(xhr.responseText);
          return;
        };
        if (parameters.dataType === "XML") {
          parameters.success(xhr.responseXML);
          return;
        };
        if (parameters.dataType === "JSON") {
          parameters.success(JSON.parse(xhr.responseText));
        }
      }
      else {if(parameters.error) {parameters.error(xhr.statusText)}}
    }
  });
  if (parameters.error) {
    xhr.addEventListener("error", parameters.error);
  };
  if (parameters.beforeSend) {
    parameters.beforeSend(xhr);
  };
  xhr.send(data);

  return xhr;
};
i18nMessages = {
  "chromeLangLocation": {
    "message": "The United States"
  },
  "extDescription": {
    "message": "The easiest access to the Google universe"
  },
  "lang_af": {
    "message": "Afrikaans"
  },
  "lang_ar": {
    "message": "Arabic"
  },
  "lang_auto": {
    "message": "Detect language"
  },
  "lang_az": {
    "message": "Azerbaijani"
  },
  "lang_be": {
    "message": "Belarusian"
  },
  "lang_bg": {
    "message": "Bulgarian"
  },
  "lang_bn": {
    "message": "Bengali"
  },
  "lang_bs": {
    "message": "Bosnian"
  },
  "lang_ca": {
    "message": "Catalan"
  },
  "lang_ceb": {
    "message": "Cebuano"
  },
  "lang_cs": {
    "message": "Czech"
  },
  "lang_cy": {
    "message": "Welsh"
  },
  "lang_da": {
    "message": "Danish"
  },
  "lang_de": {
    "message": "German"
  },
  "lang_el": {
    "message": "Greek"
  },
  "lang_en": {
    "message": "English"
  },
  "lang_eo": {
    "message": "Esperanto"
  },
  "lang_es": {
    "message": "Spanish"
  },
  "lang_et": {
    "message": "Estonian"
  },
  "lang_eu": {
    "message": "Basque"
  },
  "lang_fa": {
    "message": "Persian"
  },
  "lang_fi": {
    "message": "Finnish"
  },
  "lang_fr": {
    "message": "French"
  },
  "lang_ga": {
    "message": "Irish"
  },
  "lang_gl": {
    "message": "Galician"
  },
  "lang_gu": {
    "message": "Gujarati"
  },
  "lang_ha": {
    "message": "Hausa"
  },
  "lang_hi": {
    "message": "Hindi"
  },
  "lang_hmn": {
    "message": "Hmong"
  },
  "lang_hr": {
    "message": "Croatian"
  },
  "lang_ht": {
    "message": "Haitian Creole"
  },
  "lang_hu": {
    "message": "Hungarian"
  },
  "lang_hy": {
    "message": "Armenian"
  },
  "lang_id": {
    "message": "Indonesian"
  },
  "lang_ig": {
    "message": "Igbo"
  },
  "lang_is": {
    "message": "Icelandic"
  },
  "lang_it": {
    "message": "Italian"
  },
  "lang_iw": {
    "message": "Hebrew"
  },
  "lang_ja": {
    "message": "Japanese"
  },
  "lang_jw": {
    "message": "Javanese"
  },
  "lang_ka": {
    "message": "Georgian"
  },
  "lang_km": {
    "message": "Khmer"
  },
  "lang_kn": {
    "message": "Kannada"
  },
  "lang_ko": {
    "message": "Korean"
  },
  "lang_la": {
    "message": "Latin"
  },
  "lang_lo": {
    "message": "Lao"
  },
  "lang_lt": {
    "message": "Lithuanian"
  },
  "lang_lv": {
    "message": "Latvian"
  },
  "lang_mi": {
    "message": "Maori"
  },
  "lang_mk": {
    "message": "Macedonian"
  },
  "lang_mn": {
    "message": "Mongolian"
  },
  "lang_mr": {
    "message": "Marathi"
  },
  "lang_ms": {
    "message": "Malay"
  },
  "lang_mt": {
    "message": "Maltese"
  },
  "lang_ne": {
    "message": "Nepali"
  },
  "lang_nl": {
    "message": "Dutch"
  },
  "lang_no": {
    "message": "Norwegian"
  },
  "lang_pa": {
    "message": "Punjabi"
  },
  "lang_pl": {
    "message": "Polish"
  },
  "lang_pt": {
    "message": "Portuguese"
  },
  "lang_ro": {
    "message": "Romanian"
  },
  "lang_ru": {
    "message": "Russian"
  },
  "lang_sk": {
    "message": "Slovak"
  },
  "lang_sl": {
    "message": "Slovenian"
  },
  "lang_so": {
    "message": "Somali"
  },
  "lang_sq": {
    "message": "Albanian"
  },
  "lang_sr": {
    "message": "Serbian"
  },
  "lang_sv": {
    "message": "Swedish"
  },
  "lang_sw": {
    "message": "Swahili"
  },
  "lang_ta": {
    "message": "Tamil"
  },
  "lang_te": {
    "message": "Telugu"
  },
  "lang_th": {
    "message": "Thai"
  },
  "lang_tl": {
    "message": "Filipino"
  },
  "lang_tr": {
    "message": "Turkish"
  },
  "lang_uk": {
    "message": "Ukrainian"
  },
  "lang_ur": {
    "message": "Urdu"
  },
  "lang_vi": {
    "message": "Vietnamese"
  },
  "lang_yi": {
    "message": "Yiddish"
  },
  "lang_yo": {
    "message": "Yoruba"
  },
  "lang_zh_CN": {
    "message": "Chinese (Simplified)"
  },
  "lang_zh_TW": {
    "message": "Chinese (Traditional)"
  },
  "lang_zu": {
    "message": "Zulu"
  },
  "msg10": {
    "message": "More"
  },
  "msg100": {
    "message": "My Drive"
  },
  "msg101": {
    "message": "Shared with me"
  },
  "msg102": {
    "message": "Starred"
  },
  "msg103": {
    "message": "Recent"
  },
  "msg104": {
    "message": "Activity"
  },
  "msg105": {
    "message": "All items"
  },
  "msg106": {
    "message": "Trash"
  },
  "msg108": {
    "message": "Calendar"
  },
  "msg12": {
    "message": "Web"
  },
  "msg13": {
    "message": "Videos"
  },
  "msg130": {
    "message": "About"
  },
  "msg132": {
    "message": "Thanks for installing this extension!"
  },
  "msg134": {
    "message": "Donate"
  },
  "msg135": {
    "message": "Rate & review"
  },
  "msg14": {
    "message": "Shopping"
  },
  "msg140": {
    "message": "Thanks to"
  },
  "msg141": {
    "message": "The Google icons in this extension are copyrighted by Google"
  },
  "msg142": {
    "message": "Help translating"
  },
  "msg143": {
    "message": "Go Back"
  },
  "msg146": {
    "message": "Settings"
  },
  "msg15": {
    "message": "Places"
  },
  "msg157": {
    "message": "Source language"
  },
  "msg158": {
    "message": "Target language"
  },
  "msg159": {
    "message": "Map Type"
  },
  "msg16": {
    "message": "Discussions"
  },
  "msg161": {
    "message": "Default location"
  },
  "msg162": {
    "message": "News edition"
  },
  "msg166": {
    "message": "Show empty days"
  },
  "msg17": {
    "message": "Patents"
  },
  "msg170": {
    "message": "Auto detect"
  },
  "msg171": {
    "message": "Roadmap"
  },
  "msg172": {
    "message": "Terrain"
  },
  "msg173": {
    "message": "Satellite"
  },
  "msg174": {
    "message": "Hybrid"
  },
  "msg178": {
    "message": "Opened by me"
  },
  "msg179": {
    "message": "Owned by me"
  },
  "msg18": {
    "message": "Flights"
  },
  "msg180": {
    "message": "Starred"
  },
  "msg185": {
    "message": "Mars"
  },
  "msg187": {
    "message": "Offline Files"
  },
  "msg188": {
    "message": "New Contact"
  },
  "msg189": {
    "message": "Links and Search Filters"
  },
  "msg19": {
    "message": "Images"
  },
  "msg190": {
    "message": "Open Black Menu in a panel"
  },
  "msg193": {
    "message": "My Profile"
  },
  "msg194": {
    "message": "My Uploads"
  },
  "msg195": {
    "message": "My Favorites"
  },
  "msg196": {
    "message": "My Liked Videos"
  },
  "msg197": {
    "message": "Subscription Videos"
  },
  "msg198": {
    "message": "Browse Channels"
  },
  "msg199": {
    "message": "Dashboard"
  },
  "msg20": {
    "message": "News"
  },
  "msg200": {
    "message": "Video Editor"
  },
  "msg201": {
    "message": "Analytics"
  },
  "msg202": {
    "message": "Inbox"
  },
  "msg203": {
    "message": "My feed"
  },
  "msg204": {
    "message": "Watch History"
  },
  "msg205": {
    "message": "My subscriptions"
  },
  "msg206": {
    "message": "Social"
  },
  "msg21": {
    "message": "Books"
  },
  "msg214": {
    "message": "Please enable panels"
  },
  "msg215": {
    "message": "ok"
  },
  "msg216": {
    "message": "Before you can open Black Menu, or parts of Black Menu in a panel, you need to enable panels. To do that, follow these steps."
  },
  "msg217": {
    "message": "1. Go to"
  },
  "msg218": {
    "message": "2. Locate the 'Enable Panels' panel"
  },
  "msg219": {
    "message": "3. Enable the 'Enable Panels' flag"
  },
  "msg22": {
    "message": "Blogs"
  },
  "msg220": {
    "message": "4. Relaunch your browser"
  },
  "msg221": {
    "message": "5. Done"
  },
  "msg23": {
    "message": "Recipes"
  },
  "msg235": {
    "message": "Top Stories"
  },
  "msg236": {
    "message": "World"
  },
  "msg237": {
    "message": "Your Country"
  },
  "msg238": {
    "message": "Business"
  },
  "msg239": {
    "message": "Sci/Tech"
  },
  "msg24": {
    "message": "Applications"
  },
  "msg240": {
    "message": "Entertainment"
  },
  "msg241": {
    "message": "Sports"
  },
  "msg242": {
    "message": "Health"
  },
  "msg243": {
    "message": "Popular"
  },
  "msg247": {
    "message": "About"
  },
  "msg249": {
    "message": "Feedback"
  },
  "msg25": {
    "message": "Maps"
  },
  "msg250": {
    "message": "Awards"
  },
  "msg251": {
    "message": "Changelog"
  },
  "msg252": {
    "message": "I would like to thank these people for helping me, and translating this extension. Thank you guys!"
  },
  "msg253": {
    "message": "Want to tell the world how you like Black Menu, or to help me developing it?"
  },
  "msg254": {
    "message": "Report a bug"
  },
  "msg255": {
    "message": "Ask a question"
  },
  "msg256": {
    "message": "Request a feature"
  },
  "msg257": {
    "message": "Send an email"
  },
  "msg258": {
    "message": "Follow me"
  },
  "msg259": {
    "message": "The award gallery, thanks for awarding this extension!"
  },
  "msg26": {
    "message": "Links"
  },
  "msg270": {
    "message": "Search Google Bookmarks in a new tab..."
  },
  "msg271": {
    "message": "Added"
  },
  "msg272": {
    "message": "Search Google Bookmarks in a new tab"
  },
  "msg273": {
    "message": "Folders"
  },
  "msg274": {
    "message": "Text documents"
  },
  "msg275": {
    "message": "Spreadsheets"
  },
  "msg276": {
    "message": "Presentations"
  },
  "msg277": {
    "message": "Drawings"
  },
  "msg278": {
    "message": "Forms"
  },
  "msg279": {
    "message": "Fusion tables"
  },
  "msg280": {
    "message": "Scripts"
  },
  "msg281": {
    "message": "PDF files"
  },
  "msg282": {
    "message": "Type"
  },
  "msg283": {
    "message": "List View"
  },
  "msg284": {
    "message": "Thumbnail View"
  },
  "msg285": {
    "message": "New"
  },
  "msg286": {
    "message": "Upload"
  },
  "msg287": {
    "message": "Enter document title..."
  },
  "msg288": {
    "message": "Document"
  },
  "msg289": {
    "message": "Spreadsheet"
  },
  "msg290": {
    "message": "Presentation"
  },
  "msg291": {
    "message": "Drawing"
  },
  "msg292": {
    "message": "Form"
  },
  "msg293": {
    "message": "Fusion Table"
  },
  "msg294": {
    "message": "Script"
  },
  "msg295": {
    "message": "From Template..."
  },
  "msg296": {
    "message": "modified"
  },
  "msg297": {
    "message": "No files matched the search query"
  },
  "msg298": {
    "message": "No file selected..."
  },
  "msg299": {
    "message": "Change file"
  },
  "msg30": {
    "message": "Everywhere"
  },
  "msg300": {
    "message": "Upload file"
  },
  "msg301": {
    "message": "Choose file"
  },
  "msg302": {
    "message": "Give permission"
  },
  "msg303": {
    "message": "Before you can use this page, you need to give Black Menu for Google permission to view your Google Drive files and folders."
  },
  "msg304": {
    "message": "No Layer"
  },
  "msg305": {
    "message": "Traffic"
  },
  "msg306": {
    "message": "Public Transport"
  },
  "msg307": {
    "message": "Weather"
  },
  "msg308": {
    "message": "Cycling"
  },
  "msg309": {
    "message": "Location History"
  },
  "msg31": {
    "message": "Communities"
  },
  "msg310": {
    "message": "Auto Detect"
  },
  "msg312": {
    "message": "Chrome Apps"
  },
  "msg315": {
    "message": "Sort by date"
  },
  "msg316": {
    "message": "Sort by rating"
  },
  "msg317": {
    "message": "Sort by relevance"
  },
  "msg318": {
    "message": "Sort by title"
  },
  "msg319": {
    "message": "Sort by views"
  },
  "msg32": {
    "message": "Events"
  },
  "msg320": {
    "message": "Any duration"
  },
  "msg321": {
    "message": "Longer than 20 min"
  },
  "msg322": {
    "message": "Between 4 and 20 min"
  },
  "msg323": {
    "message": "Shorter than 4 min"
  },
  "msg324": {
    "message": "Any type"
  },
  "msg325": {
    "message": "Episodes"
  },
  "msg326": {
    "message": "Movies"
  },
  "msg327": {
    "message": "Open video in a new tab"
  },
  "msg328": {
    "message": "Search books..."
  },
  "msg329": {
    "message": "No books matched the query"
  },
  "msg33": {
    "message": "Posts"
  },
  "msg330": {
    "message": "Please enter a search query"
  },
  "msg331": {
    "message": "Preview"
  },
  "msg332": {
    "message": "Launch first shortcut in the list"
  },
  "msg333": {
    "message": "Search Chrome apps..."
  },
  "msg334": {
    "message": "Before you can use this page, you need to give Black Menu for Google access to load your installed apps as a shortcut."
  },
  "msg335": {
    "message": "Apps"
  },
  "msg336": {
    "message": "Websites"
  },
  "msg337": {
    "message": "Apps & devices"
  },
  "msg338": {
    "message": "Music & movies"
  },
  "msg339": {
    "message": "Reading"
  },
  "msg34": {
    "message": "Hangouts"
  },
  "msg340": {
    "message": "Device Manager"
  },
  "msg341": {
    "message": "Developer console"
  },
  "msg342": {
    "message": "Music Artist Hub"
  },
  "msg343": {
    "message": "My Music in panel"
  },
  "msg344": {
    "message": "My wishlist"
  },
  "msg345": {
    "message": "Redeem"
  },
  "msg346": {
    "message": "All Notes"
  },
  "msg347": {
    "message": "Archive"
  },
  "msg348": {
    "message": "Reminders"
  },
  "msg349": {
    "message": "Search notes..."
  },
  "msg35": {
    "message": "People and Pages"
  },
  "msg350": {
    "message": "Search notes"
  },
  "msg351": {
    "message": "All colors"
  },
  "msg352": {
    "message": "Blank"
  },
  "msg353": {
    "message": "Red"
  },
  "msg354": {
    "message": "Orange"
  },
  "msg355": {
    "message": "Yellow"
  },
  "msg356": {
    "message": "Green"
  },
  "msg357": {
    "message": "Teal"
  },
  "msg358": {
    "message": "Blue"
  },
  "msg359": {
    "message": "Grey"
  },
  "msg360": {
    "message": "Before you can use this page, you need to give Black Menu for Google access to your Google Keep notes."
  },
  "msg361": {
    "message": "Share this page"
  },
  "msg362": {
    "message": "New post"
  },
  "msg363": {
    "message": "Notifications"
  },
  "msg364": {
    "message": "People"
  },
  "msg365": {
    "message": "What's Hot"
  },
  "msg366": {
    "message": "Hangouts On Air"
  },
  "msg367": {
    "message": "Notifications"
  },
  "msg368": {
    "message": "Settings"
  },
  "msg369": {
    "message": "Sorry, you can't share this page"
  },
  "msg37": {
    "message": "Home"
  },
  "msg370": {
    "message": "All Categories"
  },
  "msg371": {
    "message": "New Note"
  },
  "msg372": {
    "message": "Apps store"
  },
  "msg373": {
    "message": "Devices store"
  },
  "msg374": {
    "message": "Music store"
  },
  "msg375": {
    "message": "Movies & TV store"
  },
  "msg376": {
    "message": "Books store"
  },
  "msg377": {
    "message": "Newsstand store"
  },
  "msg378": {
    "message": "My Newsstand"
  },
  "msg379": {
    "message": "More"
  },
  "msg38": {
    "message": "Pages"
  },
  "msg380": {
    "message": "Insert URL to shorten here..."
  },
  "msg381": {
    "message": "All goo.gl URLs and click analytics are public and can be accessed by anyone."
  },
  "msg382": {
    "message": "Press CTRL-C to copy"
  },
  "msg383": {
    "message": "0 minutes ago"
  },
  "msg384": {
    "message": "Please fill in a valid URL"
  },
  "msg385": {
    "message": "Error while generating short URL"
  },
  "msg387": {
    "message": "Search Google Calendar in a new tab..."
  },
  "msg388": {
    "message": "Search Google Calendar in a new tab"
  },
  "msg389": {
    "message": "Add event"
  },
  "msg39": {
    "message": "Profile"
  },
  "msg390": {
    "message": "Print Jobs"
  },
  "msg391": {
    "message": "Printers"
  },
  "msg392": {
    "message": "Search Google Cloud Print..."
  },
  "msg393": {
    "message": "Search Google Cloud Print"
  },
  "msg394": {
    "message": "No print jobs found."
  },
  "msg395": {
    "message": "Created"
  },
  "msg396": {
    "message": "Status"
  },
  "msg397": {
    "message": "No printers found."
  },
  "msg398": {
    "message": "Owned by me"
  },
  "msg399": {
    "message": "Before you can use this page, you need to give Black Menu for Google access to Google Cloudprint. It is possible this page worked before without giving permissions."
  },
  "msg4": {
    "message": "Play"
  },
  "msg400": {
    "message": "Search Google Scholar..."
  },
  "msg401": {
    "message": "Search Google Scholar"
  },
  "msg402": {
    "message": "Before you can use this page, you need to give Black Menu for Google access to Google Scholar."
  },
  "msg403": {
    "message": "Search Google Sites in a new tab..."
  },
  "msg404": {
    "message": "Search Google Sites in a new tab"
  },
  "msg405": {
    "message": "My Sites"
  },
  "msg406": {
    "message": "No Sites found"
  },
  "msg407": {
    "message": "Before you can use this page, you need to give Black Menu for Google access to list your Google Sites."
  },
  "msg408": {
    "message": "Search your tasks"
  },
  "msg409": {
    "message": "Search all Google Services..."
  },
  "msg411": {
    "message": "More Pages - drag to the right to add"
  },
  "msg412": {
    "message": "Google Shortcuts"
  },
  "msg413": {
    "message": "New File"
  },
  "msg414": {
    "message": "Upload"
  },
  "msg415": {
    "message": "Select the services you want to display unread count for"
  },
  "msg416": {
    "message": "Select where the unread count should be displayed"
  },
  "msg417": {
    "message": "In the extension itself"
  },
  "msg418": {
    "message": "As a badge on the extension icon (experimental)"
  },
  "msg419": {
    "message": "Unread Counts"
  },
  "msg420": {
    "message": "Options"
  },
  "msg421": {
    "message": "Tip: Hover over the name of one of the services to get a description. Drag and drop a service to move it between the lists or to re-order items on the right list."
  },
  "msg422": {
    "message": "Available services"
  },
  "msg423": {
    "message": "Your chosen services"
  },
  "msg424": {
    "message": "All Google icons and names are a trademark of Google Inc. Use of this trademark is subject to Google Permissions. "
  },
  "msg425": {
    "message": "Notice: All referenced brands, product names, service names and trademarks are property of their respective owner(s)."
  },
  "msg426": {
    "message": "Panels and Windows"
  },
  "msg427": {
    "message": "Define what the \"Open gadget in window\" button should do: open in a..."
  },
  "msg428": {
    "message": "panel"
  },
  "msg429": {
    "message": "popup"
  },
  "msg43": {
    "message": "Local"
  },
  "msg430": {
    "message": "new tab"
  },
  "msg431": {
    "message": "new window"
  },
  "msg432": {
    "message": "More Page"
  },
  "msg433": {
    "message": "Choose the elements that should be displayed"
  },
  "msg434": {
    "message": "Display all elements"
  },
  "msg435": {
    "message": "Only display the shortcuts"
  },
  "msg436": {
    "message": "Only display the pages"
  },
  "msg437": {
    "message": "Allow more than 10 items in the main menu"
  },
  "msg438": {
    "message": "Hide file extensions"
  },
  "msg439": {
    "message": "Choose default page"
  },
  "msg44": {
    "message": "Photos"
  },
  "msg440": {
    "message": "All categories"
  },
  "msg441": {
    "message": "Food & Drink"
  },
  "msg442": {
    "message": "Shopping"
  },
  "msg443": {
    "message": "Adventure & Activities"
  },
  "msg444": {
    "message": "Events & Classes"
  },
  "msg445": {
    "message": "Travel"
  },
  "msg446": {
    "message": "Beauty"
  },
  "msg447": {
    "message": "Health & Wellness"
  },
  "msg448": {
    "message": "Automotive"
  },
  "msg449": {
    "message": "Services"
  },
  "msg45": {
    "message": "Circles"
  },
  "msg450": {
    "message": "Search offers in a new tab..."
  },
  "msg451": {
    "message": "Search offers in a new tab"
  },
  "msg452": {
    "message": "Select Services"
  },
  "msg453": {
    "message": "Browser Language"
  },
  "msg454": {
    "message": "Web Search"
  },
  "msg455": {
    "message": "Image Search"
  },
  "msg456": {
    "message": "News Search"
  },
  "msg457": {
    "message": "Google Shopping"
  },
  "msg458": {
    "message": "YouTube Search"
  },
  "msg459": {
    "message": "Hot Trends"
  },
  "msg460": {
    "message": "Details"
  },
  "msg461": {
    "message": "Explore"
  },
  "msg462": {
    "message": "Create"
  },
  "msg463": {
    "message": "Add Bookmark"
  },
  "msg464": {
    "message": "All Bookmarks"
  },
  "msg465": {
    "message": "Manage Labels"
  },
  "msg466": {
    "message": "Related Searches"
  },
  "msg467": {
    "message": "Searches"
  },
  "msg468": {
    "message": "News Articles"
  },
  "msg469": {
    "message": "Search Google Trends..."
  },
  "msg470": {
    "message": "Search Google+ in a new tab..."
  },
  "msg471": {
    "message": "Share this page only works in the Black Menu Popup"
  },
  "msg472": {
    "message": "Translation"
  },
  "msg473": {
    "message": "Dictionary"
  },
  "msg474": {
    "message": "Search Google Drive..."
  },
  "msg475": {
    "message": "Search YouTube..."
  },
  "msg476": {
    "message": "Search Google Maps..."
  },
  "msg477": {
    "message": "Enter text to translate here..."
  },
  "msg478": {
    "message": "Search Gmail..."
  },
  "msg479": {
    "message": "Search Google News..."
  },
  "msg480": {
    "message": "Search Google Play store..."
  },
  "msg481": {
    "message": "Search Google..."
  },
  "msg482": {
    "message": "Open widget in a panel"
  },
  "msg56": {
    "message": "Apps"
  },
  "msg57": {
    "message": "Books"
  },
  "msg58": {
    "message": "Magazines"
  },
  "msg59": {
    "message": "Movies & TV"
  },
  "msg60": {
    "message": "Music"
  },
  "msg61": {
    "message": "Devices"
  },
  "msg63": {
    "message": "Orders"
  },
  "msg64": {
    "message": "Settings"
  },
  "msg648": {
    "message": "Navigate to"
  },
  "msg649": {
    "message": "Navigate from"
  },
  "msg65": {
    "message": "My Content"
  },
  "msg650": {
    "message": "Portfolios"
  },
  "msg651": {
    "message": "Markets"
  },
  "msg652": {
    "message": "News"
  },
  "msg653": {
    "message": "Search Google Finance in a new tab..."
  },
  "msg654": {
    "message": "Sector Summary"
  },
  "msg655": {
    "message": "Sector"
  },
  "msg656": {
    "message": "Change"
  },
  "msg657": {
    "message": "% down / up"
  },
  "msg658": {
    "message": "High"
  },
  "msg659": {
    "message": "Low"
  },
  "msg66": {
    "message": "My Apps"
  },
  "msg660": {
    "message": "Market Cap"
  },
  "msg661": {
    "message": "Market News"
  },
  "msg663": {
    "message": "Star"
  },
  "msg664": {
    "message": "Delete"
  },
  "msg665": {
    "message": "No items found"
  },
  "msg666": {
    "message": "Create Alert"
  },
  "msg667": {
    "message": "Export Alerts"
  },
  "msg668": {
    "message": "My Alerts"
  },
  "msg669": {
    "message": "Search query"
  },
  "msg67": {
    "message": "My Books"
  },
  "msg670": {
    "message": "Result type"
  },
  "msg671": {
    "message": "How often"
  },
  "msg672": {
    "message": "How many"
  },
  "msg673": {
    "message": "Deliver to"
  },
  "msg674": {
    "message": "As it happens"
  },
  "msg675": {
    "message": "Once a day"
  },
  "msg676": {
    "message": "Once a week"
  },
  "msg677": {
    "message": "Only the best results"
  },
  "msg678": {
    "message": "All results"
  },
  "msg679": {
    "message": "Email"
  },
  "msg68": {
    "message": "My Magazines"
  },
  "msg680": {
    "message": "Feed"
  },
  "msg681": {
    "message": "Everything"
  },
  "msg682": {
    "message": "Show Phrasebook"
  },
  "msg69": {
    "message": "My Movies & TV"
  },
  "msg70": {
    "message": "My Music"
  },
  "msg71": {
    "message": "My Devices"
  },
  "msg74": {
    "message": "Watch later"
  },
  "msg75": {
    "message": "Playlists"
  },
  "msg81": {
    "message": "All Mail"
  },
  "msg82": {
    "message": "Inbox"
  },
  "msg83": {
    "message": "Unread"
  },
  "msg84": {
    "message": "Important"
  },
  "msg85": {
    "message": "Drafts"
  },
  "msg86": {
    "message": "Spam"
  },
  "msg88": {
    "message": "Anywhere"
  },
  "msg89": {
    "message": "Sent Mail"
  },
  "msg90": {
    "message": "Read"
  },
  "msg91": {
    "message": "Starred"
  },
  "msg92": {
    "message": "Attachments"
  },
  "msg93": {
    "message": "Trash"
  },
  "msg94": {
    "message": "Chats"
  },
  "ser0": {
    "message": "3D Warehouse"
  },
  "ser1": {
    "message": "About Google"
  },
  "ser10": {
    "message": "Alerts"
  },
  "ser100": {
    "message": "Map Maker"
  },
  "ser101": {
    "message": "Maps"
  },
  "ser102": {
    "message": "Maps - Floor plans"
  },
  "ser104": {
    "message": "Merchant Center"
  },
  "ser105": {
    "message": "Moderator"
  },
  "ser106": {
    "message": "Moon"
  },
  "ser107": {
    "message": "Movies"
  },
  "ser108": {
    "message": "My Devices"
  },
  "ser109": {
    "message": "News"
  },
  "ser11": {
    "message": "Analytics"
  },
  "ser110": {
    "message": "News Archive"
  },
  "ser111": {
    "message": "Offers"
  },
  "ser112": {
    "message": "Orkut"
  },
  "ser113": {
    "message": "Pacman"
  },
  "ser114": {
    "message": "Panoramio"
  },
  "ser115": {
    "message": "Patent Search"
  },
  "ser116": {
    "message": "Picasa"
  },
  "ser117": {
    "message": "Places - New Place"
  },
  "ser118": {
    "message": "Postini"
  },
  "ser12": {
    "message": "Android Device Gallery"
  },
  "ser120": {
    "message": "Public Alerts"
  },
  "ser121": {
    "message": "Public Data Explorer"
  },
  "ser125": {
    "message": "Scholar"
  },
  "ser126": {
    "message": "Scripts"
  },
  "ser127": {
    "message": "Search Settings"
  },
  "ser128": {
    "message": "Sheets"
  },
  "ser129": {
    "message": "Shopping"
  },
  "ser13": {
    "message": "Api Console"
  },
  "ser130": {
    "message": "Sites"
  },
  "ser131": {
    "message": "SketchUp Showcase"
  },
  "ser132": {
    "message": "Sky"
  },
  "ser133": {
    "message": "Slides"
  },
  "ser136": {
    "message": "Submit your content"
  },
  "ser137": {
    "message": "Support"
  },
  "ser138": {
    "message": "Support forum"
  },
  "ser139": {
    "message": "Takeout"
  },
  "ser14": {
    "message": "Api Explorer"
  },
  "ser140": {
    "message": "Tasks"
  },
  "ser141": {
    "message": "Teach Parents Tech"
  },
  "ser142": {
    "message": "Templates"
  },
  "ser143": {
    "message": "Transit"
  },
  "ser144": {
    "message": "Translate"
  },
  "ser145": {
    "message": "Translator Toolkit"
  },
  "ser146": {
    "message": "Transparency Report"
  },
  "ser147": {
    "message": "Trends"
  },
  "ser148": {
    "message": "Trends - Cold Searches"
  },
  "ser149": {
    "message": "Trends - Hot Searches"
  },
  "ser15": {
    "message": "App Engine"
  },
  "ser150": {
    "message": "Trusted Stores"
  },
  "ser151": {
    "message": "Trusted Tester"
  },
  "ser152": {
    "message": "Url Shortener"
  },
  "ser153": {
    "message": "Video"
  },
  "ser154": {
    "message": "Voice"
  },
  "ser155": {
    "message": "Wallet"
  },
  "ser156": {
    "message": "Web History"
  },
  "ser157": {
    "message": "Search"
  },
  "ser158": {
    "message": "Webmaster Tools"
  },
  "ser159": {
    "message": "Wenda"
  },
  "ser16": {
    "message": "Apps"
  },
  "ser160": {
    "message": "YouTube"
  },
  "ser161": {
    "message": "YouTube - Analytics"
  },
  "ser162": {
    "message": "YouTube TV"
  },
  "ser163": {
    "message": "Zeitgeist"
  },
  "ser164": {
    "message": "Tag Manager"
  },
  "ser165": {
    "message": "Tables Search"
  },
  "ser166": {
    "message": "Offers - My offers"
  },
  "ser167": {
    "message": "Maps Engine"
  },
  "ser168": {
    "message": "Maps Preview"
  },
  "ser169": {
    "message": "AdWords Express"
  },
  "ser17": {
    "message": "Apps Marketplace"
  },
  "ser170": {
    "message": "Google+ Communities"
  },
  "ser171": {
    "message": "Admin Console"
  },
  "ser172": {
    "message": "Bookmarks - Bookmark this"
  },
  "ser173": {
    "message": "Bookmarks Lists - Bookmark this"
  },
  "ser174": {
    "message": "Custom Search - Add URL"
  },
  "ser175": {
    "message": "Gmail - Mail this"
  },
  "ser176": {
    "message": "Maps - Map this"
  },
  "ser177": {
    "message": "Plus One"
  },
  "ser178": {
    "message": "URL Shortener - Shorten URL"
  },
  "ser179": {
    "message": "Android Device Manager"
  },
  "ser18": {
    "message": "Cultural Institute - Art Project"
  },
  "ser180": {
    "message": "YouTube - Subscriptions"
  },
  "ser181": {
    "message": "Feedback Reports"
  },
  "ser182": {
    "message": "Adwords - Keyword Planner"
  },
  "ser183": {
    "message": "Wallet - Merchant Center"
  },
  "ser184": {
    "message": "DoubleClick Studio"
  },
  "ser185": {
    "message": "Maps - Location History"
  },
  "ser186": {
    "message": "Analytics Gallery"
  },
  "ser187": {
    "message": "YouTube - Keyword tool"
  },
  "ser188": {
    "message": "ReCaptcha"
  },
  "ser189": {
    "message": "Trends - Explore"
  },
  "ser19": {
    "message": "Baraza"
  },
  "ser190": {
    "message": "Webmaster Tools - My Removal Requests"
  },
  "ser191": {
    "message": "Helpouts"
  },
  "ser192": {
    "message": "Earth Tour Builder"
  },
  "ser193": {
    "message": "Maps Views"
  },
  "ser194": {
    "message": "Flu Trends"
  },
  "ser195": {
    "message": "Dengue Trends"
  },
  "ser196": {
    "message": "Person Finder"
  },
  "ser197": {
    "message": "Crisis Map"
  },
  "ser198": {
    "message": "Fiber - My Fiber"
  },
  "ser199": {
    "message": "YouTube - Disco"
  },
  "ser2": {
    "message": "DoubleClick for Publishers"
  },
  "ser20": {
    "message": "Blog Directory"
  },
  "ser200": {
    "message": "Trends - Top Charts"
  },
  "ser201": {
    "message": "YouTube - Trends Dashboard"
  },
  "ser202": {
    "message": "Cloud Console"
  },
  "ser203": {
    "message": "Shopping - Shortlists"
  },
  "ser204": {
    "message": "Partners"
  },
  "ser205": {
    "message": "Cultural Institute"
  },
  "ser206": {
    "message": "Analytics - Url Builder"
  },
  "ser207": {
    "message": "Google Tips"
  },
  "ser208": {
    "message": "Planning Tools"
  },
  "ser209": {
    "message": "Play Books Partner Center"
  },
  "ser21": {
    "message": "Blogger"
  },
  "ser210": {
    "message": "Play Newsstand"
  },
  "ser211": {
    "message": "Media Tools"
  },
  "ser212": {
    "message": "Compare"
  },
  "ser213": {
    "message": "Apps Status Dashboard"
  },
  "ser22": {
    "message": "Blog Search"
  },
  "ser23": {
    "message": "Bookmarks"
  },
  "ser24": {
    "message": "Books"
  },
  "ser25": {
    "message": "Browser Size"
  },
  "ser27": {
    "message": "Calendar"
  },
  "ser28": {
    "message": "Calendar - New event"
  },
  "ser29": {
    "message": "Cars"
  },
  "ser3": {
    "message": "AdWords - Display Planner"
  },
  "ser30": {
    "message": "Chrome Experiments"
  },
  "ser31": {
    "message": "Chrome Web Store"
  },
  "ser32": {
    "message": "Chrome Web Store - Developer Dashboard"
  },
  "ser33": {
    "message": "Chrome Web Store - Extensions"
  },
  "ser34": {
    "message": "Chrome Web Store - Themes"
  },
  "ser35": {
    "message": "Cloud Print"
  },
  "ser36": {
    "message": "Code"
  },
  "ser37": {
    "message": "Consumer Surveys"
  },
  "ser38": {
    "message": "Consumer Surveys - New Survey"
  },
  "ser39": {
    "message": "Contacts"
  },
  "ser4": {
    "message": "AdSense"
  },
  "ser40": {
    "message": "Bookmarks"
  },
  "ser41": {
    "message": "CS4HS"
  },
  "ser42": {
    "message": "Custom Search"
  },
  "ser43": {
    "message": "Dashboard"
  },
  "ser44": {
    "message": "Demo Slam"
  },
  "ser45": {
    "message": "Developers"
  },
  "ser46": {
    "message": "Docs"
  },
  "ser47": {
    "message": "Drawings"
  },
  "ser48": {
    "message": "Drive"
  },
  "ser49": {
    "message": "Earth"
  },
  "ser5": {
    "message": "Advanced Search"
  },
  "ser50": {
    "message": "Earth Engine"
  },
  "ser51": {
    "message": "Ejabat"
  },
  "ser52": {
    "message": "Elections"
  },
  "ser53": {
    "message": "Feedburner"
  },
  "ser54": {
    "message": "Groups"
  },
  "ser55": {
    "message": "Finance - Currency Converter"
  },
  "ser56": {
    "message": "Flights"
  },
  "ser57": {
    "message": "Forms"
  },
  "ser58": {
    "message": "Fusion Tables"
  },
  "ser59": {
    "message": "Gmail"
  },
  "ser6": {
    "message": "AdWords"
  },
  "ser60": {
    "message": "Gmail - New mail"
  },
  "ser61": {
    "message": "Fonts"
  },
  "ser62": {
    "message": "Input Tools"
  },
  "ser63": {
    "message": "Play - Developer Console"
  },
  "ser64": {
    "message": "Play - Artist Hub"
  },
  "ser65": {
    "message": "Play - My Books"
  },
  "ser66": {
    "message": "Play - My Devices"
  },
  "ser67": {
    "message": "Play - My Magazines"
  },
  "ser68": {
    "message": "Play - My Movies"
  },
  "ser69": {
    "message": "Play - My Music"
  },
  "ser7": {
    "message": "AdWords - External Keyword Tool"
  },
  "ser70": {
    "message": "Play Store"
  },
  "ser71": {
    "message": "Play Store - Apps"
  },
  "ser72": {
    "message": "Play Store - Books"
  },
  "ser73": {
    "message": "Play Store - Devices"
  },
  "ser74": {
    "message": "Play Store - Magazines"
  },
  "ser75": {
    "message": "Play Store - Movies"
  },
  "ser76": {
    "message": "Play Store - Music"
  },
  "ser77": {
    "message": "Play Store - Orders"
  },
  "ser78": {
    "message": "Play Store - Settings"
  },
  "ser79": {
    "message": "Google Settings"
  },
  "ser8": {
    "message": "AdWords - My Client Center"
  },
  "ser80": {
    "message": "Google Store"
  },
  "ser81": {
    "message": "Google TV"
  },
  "ser82": {
    "message": "Google+"
  },
  "ser83": {
    "message": "Google+ Circles"
  },
  "ser84": {
    "message": "Google+ Events"
  },
  "ser85": {
    "message": "Google+ What's hot"
  },
  "ser87": {
    "message": "Google+ Hangouts on air"
  },
  "ser88": {
    "message": "Google+ Pages"
  },
  "ser89": {
    "message": "Google+ Photos"
  },
  "ser9": {
    "message": "AdWords - Traffic Estimator"
  },
  "ser90": {
    "message": "Google+ Profile"
  },
  "ser91": {
    "message": "Government requests"
  },
  "ser92": {
    "message": "Green"
  },
  "ser93": {
    "message": "Finance"
  },
  "ser94": {
    "message": "Hotel Finder"
  },
  "ser96": {
    "message": "Image Search"
  },
  "ser97": {
    "message": "Keep"
  },
  "ser99": {
    "message": "LIFE photo archive"
  }
};
