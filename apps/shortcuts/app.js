var storage = require("Storage");

var icons = [
  {name:"agenda", img :"GBiBAAAAAAA8AAB+AA/n8B/n+BgAGBgAGBn/mBn/mBgAGBgAGBn/mBn/+BgD/BgHDhn+Bhn8MxgMIxgMIx/8Ew/+BgAHDgAD/AAA8A=="},
  {name:"alarm", img:"GBiBAAAAAAAAAAYAYA4AcBx+ODn/nAOBwAcA4A4YcAwYMBgYGBgYGBgYGBgYGBgeGBgHGAwBMA4AcAcA4AOBwAH/gAB+AAAAAAAAAA=="},
  {name:"mail", img:"GBiBAAAAAAAAAAAAAAAAAB//+D///DAADDgAHDwAPDcA7DPDzDDnDDA8DDAYDDAADDAADDAADDAADD///B//+AAAAAAAAAAAAAAAAA=="},
  {name:"android", img: "GBiBAAAAAAEAgAD/AAD/AAHDgAGBgAMkwAMAwAP/wBv/2BsA2BsA2BsA2BsA2BsA2BsA2Bv/2AP/wADnAADnAADnAADnAADnAAAAAA=="},
  {name:"add", img:"GBiBAAAAAAAAAAAAAA//8B//+BgAGBgAGBgYGBgYGBgYGBgYGBn/mBn/mBgYGBgYGBgYGBgYGBgAGBgAGB//+A//8AAAAAAAAAAAAA=="},
  {name:"bangle", img:"GBiBAAD+AAH+AAH+AAH+AAH/AAOHAAYBgAwAwBgwYBgwYBgwIBAwOBAwOBgYIBgMYBgAYAwAwAYBgAOHAAH/AAH+AAH+AAH+AAD+AA=="},
  {name:"bike", img:"GBiBAAAAAAAAAAAAAAAD+AAD/AADjAABjAfhnAfjyAMDwAcGwB4O+H8M/GGZ5sD7c8fzM8fjM8DDA2GBhn8B/h4AeAAAAAAAAAAAAA=="},
  {name:"play", img:"GBiBAAAAAAAAAAAAAA//8B//+BgAGBjAGBjwGBj8GBjeGBjHmBjB2BjB2BjHmBjeGBj8GBjwGBjAGBgAGB//+A//8AAAAAAAAAAAAA=="},
  {name:"fast forward", img:"GBiBAAAAAAAAAAAAAH///v///8AAA8YYA8eeA8f/g8b7w8Y488YYO8YYO8Y488b7w8f/g8eeA8YYA8AAA////3///gAAAAAAAAAAAA=="},
  {name:"rewind", img:"GBiBAAAAAAAAAAAAAH///v///8AAA8AYY8B548H/48PfY88cY9wYY9wYY88cY8PfY8H/48B548AYY8AAA////3///gAAAAAAAAAAAA=="},
  {name:"timer", img:"GBiBAAAAAAB+AAB+AAAAMAB+OAH/nAOByAcA4A4YcAwYMBgYGBgYGBgYGBgYGBgAGBgAGAwAMA4AcAcA4AOBwAH/gAB+AAAAAAAAAA=="},
  {name:"connected", img:"GBiBAAAAAAAAAAAAAA//8B//+BgAGBgAGBngGBn4GBgcGBgOGBnHGBnzGBgxmBgZmBmZmBmZmBgAGBgAGB//+A//8AAAAAAAAAAAAA=="},
  {name:"lock", img:"GBiBAAAAAAA8AAD/AAHDgAGBgAMAwAMAwAMAwAf/4A//8AwAMAwAMAwAMAwYMAw8MAw8MAwYMAwAMAwAMAwAMA//8Af/4AAAAAAAAA=="},
  {name:"battery", img:"GBiBAAAAAAAAAAB+AAB+AAHngAPnwAMAwAMAwAMIwAMIwAMYwAM4wAM+wAN8wAMcwAMYwAMQwAMQwAMAwAMAwAP/wAH/gAAAAAAAAA=="},
  {name:"game", img:"GBiBAAAAAAAAAAAAAAA8AAB+AABmAABmAAB+AAA8AAAYAAAYAAAYAAMYAA//8B//+BgAGBgAGBgAGBgAGB//+A//8AAAAAAAAAAAAA=="},
  {name:"dice", img:"GBiBAAAAAB//8D//+HAAPGMDHmeHnmeHnmMDHmAAHmMDHmeHnmeHnmMDHmAAHmMDHmeHnmeHnmMDHnAAPn///j///h///g///AAAAA=="},
  {name:"gear", img:"GBiBAAAAAAAAAAA8AAB+AABmAA3nsA/D8B8A+Dg8HBx+OAznMAzDMAzDMAznMBx+ODg8HB8A+A/D8A3nsABmAAB+AAA8AAAAAAAAAA=="},
  {name:"wrench", img:"GBiBAAAAAAAAAAAAAAAHgAAfwAA7gAAzEABjOABj+ABh+ABgGADgMAHAcAOP4AcfgA44AB9wADHgADHAADGAAB8AAA4AAAAAAAAAAA=="},
  {name:"calendar", img:"FhgBDADAMAMP/////////////////////8AADwAAPAAA8AADwAAPAAA8AADwAAPAAA8AADwAAPAAA8AADwAAP///////"},
  {name:"power", img:"GBiBAAAAAAAAAAB+AAH/gAeBwA4YcAwYMBjbGBnbmDGZjDMYzDMYzDMAzDMAzDGBjBnDmBj/GAw8MA4AcAeB4AH/gAB+AAAAAAAAAA=="},
  {name:"terminal", img:"GBiBAAAAAAAAAAAAAA//8B//+B//+B//+B//+BgAGBgAGBgAGBmAGBjAGBhgGBhgGBjAGBmPmBgAGBgAGB//+A//8AAAAAAAAAAAAA=="},
  {name:"camera", img:"GBiBAAAAAAAAAAD/AAH/gAMAwD8A/H8A/mA8BmD/BmHDhmGBhmMAxmMAxmMAxmMAxmGBhmHDhmD/BmA8BmAABn///j///AAAAAAAAA=="},
  {name:"phone", img:"GBiBAAAAAAAAAAOAAA/AABzgADBgADBgADBgABjgABjAABzAAAxgAA5wAAc58AMf+AGHHADgDABwDAA8GAAfGAAH8AAA4AAAAAAAAA=="},
  {name:"two prong plug", img:"GBiBAAABgAADwAAHwAAPgACfAAHOAAPkBgHwDwP4Hwf8Pg/+fB//OD//kD//wD//4D//8D//4B//QB/+AD/8AH/4APnwAHAAACAAAA=="},
  {name:"steps", img:"GBiBAAcAAA+AAA/AAA/AAB/AAB/gAA/g4A/h8A/j8A/D8A/D+AfH+AAH8AHn8APj8APj8AHj4AHg4AADAAAHwAAHwAAHgAAHgAADAA=="},
  {name:"graph", img:"GBiBAAAAAAAAAAAAAAAAAAAAAADAAADAAAHAAAHjAAHjgAPngH9n/n82/gA+AAA8AAA8AAAcAAAYAAAYAAAAAAAAAAAAAAAAAAAAAA=="},
  {name:"hills", img:"GBiBAAAAAAAAAAAAAAAAAAAAAAACAAAGAAAPAAEZgAOwwAPwQAZgYAwAMBgAGBAACDAADGAABv///////wAAAAAAAAAAAAAAAAAAAA=="},
  {name:"sun", img:"GBiBAAAYAAAYAAAYAAgAEBwAOAx+MAD/AAHDgAMAwAcA4AYAYOYAZ+YAZwYAYAcA4AMAwAHDgAD/AAx+MBwAOAgAEAAYAAAYAAAYAA=="},
  {name:"home", img:"GBiBAAAAAAAAAAAAAAH/gAP/wAdg4A5wYA44MBwf+DgP/BgAGBgAGBgAGBnnmBnnmBnnmBnnmBngGBngGB//+B//+AAAAAAAAAAAAA=="},
  {name:"bell", img:"GBiBAAAAAAAAAAAfgAB/2ADw+AHAMAOAGAcAGD4ADHgADDgADBwADA4AHAcAGAOAOAHAcAPg4ANxwAM5gAP/AAHvAAAHAAACAAAAAA=="},
];

var showMainMenu = () => {
  var storedApps = storage.readJSON("shortcuts.json", 1) || {};

  var mainmenu = {
    "": {
      title: "Shortcuts",
    },
    "< Back": () => {
      load();
    },
    "Add App": () => {
          // Select the app
          getSelectedApp().then((app) => {
            var confirmPromise = new Promise((resolve) => resolve(true));
            if (storedApps[app.name]) {
                confirmPromise = E.showPrompt("Shortcut already exists\nOverwrite?", {
                  title: "Confirm",
                  buttons: { Yes: true, No: false },
                });
              }

            confirmPromise.then((confirm) => {
              if (!confirm) {
                showMainMenu();
                return;
              }

              getSelectedIcon().then((icon) => {
                E.showMessage("Saving...");
                storedApps[app.name] = {
                  name: app.name, src: app.src, icon: icon
                };
                storage.writeJSON("shortcuts.json", storedApps);
                showMainMenu();
              });
            });
      });
    },
    "Manage Apps": () => {
      showAppsWithIcons(storedApps).then((selected) => {
          E.showPrompt("\0" + atob(selected.icon) + " " + selected.name, {
            title: "Remove Shortcut?",
            buttons: { Yes: true, No: false },
          }).then((confirm) => {
            if (confirm) {
              E.showMessage("Deleting...");
              delete storedApps[selected.name];
              storage.writeJSON("shortcuts.json", storedApps);
              showMainMenu();
            } else {
              showMainMenu();
            }
          });
      });
    },
  };
  E.showMenu(mainmenu);
};

var showAppsWithIcons = (apps) => {
  return new Promise((resolve) => {
    var appMenu = {
      "": {
        title: "Manage Shortcuts",
      },
      "< Cancel": () => {
        showMainMenu();
      },
    };
    let appList = getStoredAppsArray(apps);
    appList.forEach((app) => {
      appMenu["\0" + atob(app.icon) + " " + app.name] = () => {
        resolve(app);
      };
    });
    E.showMenu(appMenu);
  });
};

var getStoredAppsArray = (apps) => {
  var appList = Object.keys(apps);
  var storedAppArray = [];
  for (var i = 0; i < appList.length; i++) {
    var app = "" + appList[i];
    storedAppArray.push(
      apps[app],
    );
  }
  return storedAppArray;
};

var getSelectedIcon = () => {
  return new Promise((resolve) => {
    var iconMenu = {
      "": {
        title: "Select Icon",
      },
      "< Cancel": () => {
        showMainMenu();
      },
    };

    icons.forEach((icon) => {
      iconMenu["\0" + atob(icon.img) + " " + icon.name] = () => {
        resolve(icon.img);
      };
    });

    E.showMenu(iconMenu);
  });
};

var getAppList = () => {
  var appList = storage
    .list(/\.info$/)
    .map((appInfoFileName) => {
      var appInfo = storage.readJSON(appInfoFileName, 1);
      return (
        appInfo && {
          name: appInfo.name,
          sortorder: appInfo.sortorder,
          src: appInfo.src,
        }
      );
    })
    .filter((app) => app && !!app.src);
  appList.sort((a, b) => {
    var n = (0 | a.sortorder) - (0 | b.sortorder);
    if (n) return n;
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  return appList;
};

var getSelectedApp = () => {
  E.showMessage("Loading apps...");
  return new Promise((resolve) => {
    var selectAppMenu = {
      "": {
        title: "Select App",
      },
      "< Cancel": () => {
        showMainMenu();
      },
    };

    var appList = getAppList();
    appList.forEach((app) => {
      selectAppMenu[app.name] = () => {
        resolve(app);
      };
    });

    E.showMenu(selectAppMenu);
  });
};

showMainMenu();