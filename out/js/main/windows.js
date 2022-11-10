"use strict";

// Get a template
App.get_template = function (id) {
  return App.el(`#template_${id}`).innerHTML.trim();
};

// Create a window
App.create_window = function (args) {
  if (args.close_button === undefined) {
    args.close_button = true;
  }
  if (args.align_top === undefined) {
    args.align_top = "center";
  }
  let w = {};
  let el = App.create("div", "window_main", `window_${args.id}`);
  let top = App.create("div", `window_top window_top_${args.align_top}`);
  top.innerHTML = App.get_template(`${args.id}_top`);
  if (args.close_button) {
    let x = App.create("div", "window_x action unselectable");
    x.textContent = "x";
    top.append(x);
    App.ev(x, "click", function () {
      w.hide();
    });
  }
  el.append(top);
  let content = App.create("div", "window_content");
  content.innerHTML = App.get_template(args.id);
  el.append(content);
  w.element = el;
  document.body.append(el);
  w.setup = false;
  w.show = function () {
    if (args.setup && !w.setup) {
      args.setup();
      w.setup = true;
      console.info(`${args.id} window setup`);
    }
    App.hide_all_windows();
    w.element.style.display = "flex";
    App.window_mode = args.id;
  };
  w.hide = function () {
    if (args.on_hide) {
      args.on_hide();
    } else {
      App.show_first_item_window();
    }
  };
  App.windows[args.id] = w;
};

// Hide window
App.hide_window = function (w) {
  w.element.style.display = "none";
};

// Hide all windows
App.hide_all_windows = function () {
  for (let id in App.windows) {
    App.hide_window(App.windows[id]);
  }
};