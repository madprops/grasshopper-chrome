"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
// Setup stars
App.setup_stars = function () {
  App.setup_item_window("stars");
  App.ev(App.el("#stars_new_button"), "click", function () {
    App.new_star();
  });
  App.create_window({
    id: "star_editor",
    setup: function () {
      App.ev(App.el("#star_editor_save"), "click", function () {
        App.update_star();
      });
    },
    on_hide: function () {
      App.show_item_window("stars");
    }
  });
  App.stars_items = App.get_stars();
};

// Selected stars item action
App.stars_action = function () {
  App.star_item(App.selected_stars_item);
  App.focus_or_open_item(App.selected_stars_item);
};

// Get stars
App.get_stars = function () {
  return App.stars.items;
};

// Add an item to stars
App.star_item = function (item) {
  for (let [i, it] of App.stars_items.entries()) {
    if (it.url === item.url) {
      App.stars_items.splice(i, 1);
      break;
    }
  }
  App.stars_items.unshift({
    id: `${Date.now()}_${item.url.substring(0, 100)}`,
    url: item.url,
    title: item.title,
    date: Date.now()
  });
  App.stars.items = App.stars_items.slice(0, App.max_stars);
  App.stor_save_stars();
};

// Remove an item from stars
App.unstar_item = function (item) {
  let star = App.get_item_by_url("stars", item.url);
  App.remove_item("stars", star);
  App.stars.items = App.stars_items.slice(0, App.max_stars);
  App.stor_save_stars();
};

// Show stars editor
App.show_star_editor = function (item) {
  App.star_edited = item;
  App.el("#star_editor_title").value = item.title;
  App.el("#star_editor_url").value = item.url;
  App.windows["star_editor"].show();
  App.el("#star_editor_title").focus();
};

// Update star information
App.update_star = function () {
  let title = App.el("#star_editor_title").value.trim();
  let url = App.el("#star_editor_url").value.trim();
  if (!title || !url) {
    return;
  }
  try {
    new URL(url);
  } catch (err) {
    alert("Invalid URL");
    return;
  }
  if (App.star_edited) {
    App.unstar_item(App.star_edited);
  }
  App.star_item({
    title: title,
    url: url
  });
  App.windows["star_editor"].hide();
};

// Add a new star manually
App.new_star = function (title = "", url = "") {
  App.star_edited = undefined;
  App.el("#star_editor_title").value = title;
  App.el("#star_editor_url").value = url;
  App.windows["star_editor"].show();
  App.el("#star_editor_title").focus();
};

// Show information about stars
App.show_stars_info = /*#__PURE__*/_asyncToGenerator(function* () {
  let n = App.stars_items.length;
  let s = App.plural(n, "star", "stars");
  alert(`${s} saved`);
});

// Confirm un-star item
App.confirm_unstar_item = function (item) {
  if (confirm("Remove this star?")) {
    App.unstar_item(item);
  }
};