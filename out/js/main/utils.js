"use strict";

// Select a single element
App.el = function (query, root = document) {
  return root.querySelector(query);
};

// Select an array of elements
App.els = function (query, root = document) {
  return Array.from(root.querySelectorAll(query));
};

// Centralized function to create debouncers
App.create_debouncer = function (func, delay) {
  return function () {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        func(...args);
      }, delay);
    };
  }();
};

// Create an html element
App.create = function (type, classes = "", id = "") {
  let el = document.createElement(type);
  if (classes) {
    let classlist = classes.split(" ").filter(x => x != "");
    for (let cls of classlist) {
      el.classList.add(cls);
    }
  }
  if (id) {
    el.id = id;
  }
  return el;
};

// Add an event listener
App.ev = function (element, action, callback, extra) {
  element.addEventListener(action, callback, extra);
};

// Remove protocol like https://
App.remove_protocol = function (url) {
  return url.replace(/^https?:\/\//, "");
};

// Copy text to the clipboard
App.copy_to_clipboard = function (text) {
  navigator.clipboard.writeText(text);
};

// Get singular or plural
App.plural = function (n, singular, plural) {
  if (n === 1) {
    return `${n.toLocaleString()} ${singular}`;
  } else {
    return `${n.toLocaleString()} ${plural}`;
  }
};

// Get url hostname
App.get_hostname = function (url) {
  let url_obj;
  try {
    url_obj = new URL(url);
  } catch (err) {
    return "";
  }
  return url_obj.hostname;
};

// Get image favicon
App.get_img_icon = function (favicon, url) {
  let icon_container = App.create("div", "item_icon_container");
  let icon = App.create("img", "item_icon");
  icon.loading = "lazy";
  icon.width = 25;
  icon.height = 25;
  App.ev(icon, "error", function () {
    icon_container.replaceWith(App.get_jdenticon(url));
  });
  icon.src = favicon;
  icon_container.append(icon);
  return icon_container;
};

// Get jdenticon icon
App.get_jdenticon = function (url) {
  let icon_container = App.create("div", "item_icon_container");
  let hostname = App.get_hostname(url) || "hostname";
  let icon = App.create("canvas", "item_icon");
  icon.width = 25;
  icon.height = 25;
  jdenticon.update(icon, hostname);
  icon_container.append(icon);
  return icon_container;
};

// Wrap select for extra functionality
App.wrap_select = function (select, on_change) {
  select.addEventListener("wheel", function (e) {
    if (this.hasFocus) {
      return;
    }
    let index;
    if (e.deltaY < 0) {
      if (this.selectedIndex === 0) {
        index = this.length - 1;
      } else {
        index = this.selectedIndex - 1;
      }
    } else if (e.deltaY > 0) {
      if (this.selectedIndex === this.length - 1) {
        index = 0;
      } else {
        index = this.selectedIndex + 1;
      }
    }
    this.selectedIndex = index;
    on_change(select);
    e.preventDefault();
  });
};

// Check if urls match
App.urls_equals = function (u1, u2) {
  return App.remove_slashes_end(u1) === App.remove_slashes_end(u2);
};

// Remove slashes from ending
App.remove_slashes_end = function (s) {
  return s.replace(/\/+$/g, "");
};