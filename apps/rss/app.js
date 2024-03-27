// Object definitions
//Feed - App model that binds to an RSS or Atom Feed or Channel
// string displayName:  The display name of this feed in menu items
// string url:          The URL associated with this feed
// FeedConfig config:   The configuration data for this feed

// FeedConfig - Represents configuration so that the RSS/Atom feed maps to UI elements correctly
// string feedTag:  The tag that represents this feed - "channel" for RSS, "feed" for Atom
// string itemTag:  The tag that represents an item in the feed - "item" for RSS, "entry" for Atom
// string titleTag: The tag the user has configured to map to title UI elements - generally "title"
// string bodyTag:  The tag the user has configured to map to body UI elements - generally "description" for RSS, "content" for Atom
// string linkTag:  The tag that the user has configured that links to the source of an item - generally "link" or "comments"
// string[] order:  The order in which the elements appear in the document, index -> "title","body","link"

//Item - App model of an item or entry in a Feed
// bool new: Whether or not the item has been read in this session - used for UI etc.
// int id: Index of the item in the feed on this request - NOT the guid from the feed
// src: Unknown
// string title: The title of this item
// string link:  The link associated with this item
// string desc:  The description/body of this item

//Settings file
// Feed[]

var Layout = require("Layout");
var layout; // global var containing the layout for the currently displayed message
var settings =
  require("Storage").readJSON("messages.settings.json", true) || {};

// Font data
var fontSmall = "6x8";
var fontMedium = g.getFonts().includes("6x15") ? "6x15" : "6x8:2";
var fontBig = g.getFonts().includes("12x20") ? "12x20" : "6x8:2";
var fontLarge = g.getFonts().includes("6x15") ? "6x15:2" : "6x8:4";
var fontVLarge = g.getFonts().includes("6x15") ? "12x20:2" : "6x8:5";

var mainmenu;
var title;
var feeds = require("Storage").readJSON("rss.feeds.json", true) || [
  {
    displayName: "Hacker News",
    url: "https://news.ycombinator.com/rss",
    config: {
        feedTag: "channel",
        itemTag: "item",
        titleTag: "description",
        bodyTag: "link",
        linkTag: "comments",
        order: [
            "title",
            "body",
            "link"
        ]
    }
},
  {
    displayName: "RTÉ News",
    url: "https://www.rte.ie/feeds/rss/?index=/news/",
    config: {
      feedTag: "channel",
      itemTag: "item",
      titleTag: "title",
      bodyTag: "description",
      linkTag: "link",
    },
  },
  {
    displayName: "Reddit Ireland",
    url: "https://old.reddit.com/r/ireland.rss",
    config: {
      feedTag: "feed",
      itemTag: "entry",
      titleTag: "title",
      bodyTag: "published",
      linkTag: "link",
    },
  },
];
var items = [];

// If a font library is installed, just switch to using that for everything in messages
if (Graphics.prototype.setFontIntl) {
  fontSmall = "Intl";
  fontMedium = "Intl";
  fontBig = "Intl";
  /* 2v21 and before have a bug where the scale factor for PBF fonts wasn't
  taken into account in metrics, so we can't have big fonts on those firmwares.
  Having 'PBF' listed as a font was a bug fixed at the same time so we check for that. */
  let noScale = g.getFonts().includes("PBF");
  fontLarge = noScale ? "Intl" : "Intl:2";
  fontVLarge = noScale ? "Intl" : "Intl:3";
}

// Old experiment for navigating/viewing item
function display(index) {
  g.setFont(fontSmall);
  E.showPrompt(items[index].title, {
    title: items[index].link.substring(0, 3),
    buttons: { Prev: index - 1, Back: -1, Next: index + 1 },
  }).then(function (v) {
    if (v < 0 || v > items.length) {
      E.showMenu(mainmenu);
    } else {
      display(v);
    }
  });
}

function display2(index) {
  var item = items[index];
  item.new = false;
  // Normal text message display
  var title = item.title,
    titleFont = fontLarge,
    lines;
  var body = item.desc,
    bodyFont = fontLarge;
  // If no body, use the title text instead...
  if (body === undefined) {
    body = title;
    title = undefined;
  }
  if (title) {
    var w = g.getWidth() - 48;
    if (g.setFont(titleFont).stringWidth(title) > w) {
      titleFont = fontBig;
      if (settings.fontSize != 1 && g.setFont(titleFont).stringWidth(title) > w)
        titleFont = fontMedium;
    }
    if (g.setFont(titleFont).stringWidth(title) > w) {
      lines = g.wrapString(title, w);
      title =
        lines.length > 2
          ? lines.slice(0, 2).join("\n") + "..."
          : lines.join("\n");
    }
  }
  if (body) {
    // Try and find a font that fits...
    var w = g.getWidth() - 2,
      h = Bangle.appRect.h - 60;
    if (
      g.setFont(bodyFont).wrapString(body, w).length * g.getFontHeight() >
      h
    ) {
      bodyFont = fontBig;
      if (
        settings.fontSize != 1 &&
        g.setFont(bodyFont).wrapString(body, w).length * g.getFontHeight() > h
      ) {
        bodyFont = fontMedium;
      }
    }
    // Now crop, given whatever font we have available
    lines = g.setFont(bodyFont).wrapString(body, w);
    var maxLines = Math.floor(h / g.getFontHeight());
    if (lines.length > maxLines)
      // if too long, wrap with a bit less spae so we have room for '...'
      body =
        g
          .setFont(bodyFont)
          .wrapString(body, w - 10)
          .slice(0, maxLines)
          .join("\n") + "...";
    else body = lines.join("\n");
  }
  function goBack() {
    layout = undefined;
    showItemList(items);
  }

  layout = new Layout(
    {
      type: "v",
      c: [
        {
          type: "h",
          fillx: 1,
          bgCol: g.theme.bg2,
          col: g.theme.fg2,
          c: [
            {
              type: "v",
              fillx: 1,
              c: [
                {
                  type: "txt",
                  font: fontSmall,
                  label: item.src || title,
                  bgCol: g.theme.bg2,
                  col: g.theme.fg2,
                  fillx: 1,
                  pad: 2,
                  halign: 1,
                },
                title
                  ? {
                      type: "txt",
                      font: titleFont,
                      label: title,
                      bgCol: g.theme.bg2,
                      col: g.theme.fg2,
                      fillx: 1,
                      pad: 2,
                    }
                  : {},
              ],
            },
          ],
        },
        {
          type: "txt",
          font: bodyFont,
          label: body,
          fillx: 1,
          filly: 1,
          pad: 2,
          cb: () => {
            // allow tapping to show a larger version
            showItemScroller(item);
          },
        },
      ],
    },
    { back: goBack }
  );

  Bangle.swipeHandler = (lr, ud) => {
    if (lr > 0) goBack();
    if (lr < 0) console.log("item settings will go here");
    if (ud < 0 && index < items.length - 1) display2(items[index + 1].id);
    if (ud > 0 && index > 0) display2(items[index - 1].id);
  };
  Bangle.on("swipe", Bangle.swipeHandler);
  g.reset().clearRect(Bangle.appRect);
  layout.render();
}

// Clicking on an item in the list of items opens the item so you can scroll through the full text
// This function handles that page
function showItemScroller(msg) {
  active = "scroller";
  var bodyFont = fontBig;
  g.setFont(bodyFont);
  var lines = [];
  if (msg.title) lines = g.wrapString(msg.title, g.getWidth() - 10);
  var titleCnt = lines.length;
  if (titleCnt) lines.push(""); // add blank line after title
  lines = lines.concat(g.wrapString(msg.desc, g.getWidth() - 10)); // click to open message?,["",/*LANG*/"< Back"]);
  E.showScroller({
    h: g.getFontHeight(), // height of each menu item in pixels
    c: lines.length, // number of menu items
    // a function to draw a menu item
    draw: function (idx, r) {
      clearRect(r);
      g.setFont(bodyFont)
        .setFontAlign(0, -1)
        .drawString(lines[idx], r.x + r.w / 2, r.y);
    },
    select: () =>
      Bluetooth.println(
        JSON.stringify({
          t: "intent",
          action: "android.intent.action.VIEW",
          target: "activity",
          data: msg.link,
          flags: ["FLAG_ACTIVITY_NEW_TASK"],
        })
      ),
    back: () => display2(msg.id),
  });
}

// Shows the list of items in the feed
function showItemList(items) {
  E.showScroller({
    h: 48,
    c: items.length,
    draw: function (idx, r) {
      var item = items[idx];
      if (item && item.new) g.setBgColor(g.theme.bgH).setColor(g.theme.fgH);
      else g.setBgColor(g.theme.bg).setColor(g.theme.fg);
      g.clearRect(r.x, r.y, r.x + r.w, r.y + r.h);
      if (!item) return;
      var x = r.x + 2,
        title = item.title,
        body = item.desc;
      if (title)
        g.setFontAlign(-1, -1)
          .setFont(fontBig)
          .drawString(title, x, r.y + 2);
      var longBody = false;
      if (body) {
        g.setFontAlign(-1, -1).setFont(fontSmall);
        // if the body includes an image, it probably won't be small enough to allow>1 line
        let maxLines = Math.floor(34 / g.getFontHeight()),
          pady = 0;
        if (body.includes("\0")) {
          maxLines = 1;
          pady = 4;
        }
        var l = g.wrapString(body, r.w - (x + 14));
        if (l.length > maxLines) {
          l = l.slice(0, maxLines);
          l[l.length - 1] += "...";
        }
        longBody = l.length > 2;
        // draw the body
        g.drawString(l.join("\n"), x + 10, r.y + 20 + pady);
      }
      if (!longBody && item.src)
        g.setFontAlign(1, 1)
          .setFont("6x8")
          .drawString(item.src, r.x + r.w - 2, r.y + r.h - 2);
      g.setColor("#888").fillRect(
        r.x,
        r.y + r.h - 1,
        r.x + r.w - 1,
        r.y + r.h - 1
      ); // dividing line between items
    },
    select: (idx) => {
      if (idx < items.length) display2(items[idx].id);
    },
    back: () => showFeedList(),
  });
}

// Display a loading screen with the app logo and feed title
function displayLoadingPage(feed) {
  layout = new Layout({
    type: "v",
    c: [
      {
        type: "img",
        pad: 4,
        src: function () {
          return require("heatshrink").decompress(
            atob(
              "mEw4UA///4H8AYNZ/5L/ABMVqoAEqgKCgIKFAANABZsFBY9QBZ1W1/VBZOq1YMEBYuq1oLK1QYDHYv61WlBZFX9WrKZNeEgYLGq+q2prJvRJCBY9eGARTE34kDL44gC9WVNY5FBtQ8BBYwIBvRtBHYgsBEgNeAQJHFvRFBq2pQY4wBq4OBL4xFBBZJFCMAILEvZFD9QLF1WVrQLC6oLDUgRRCtQLENYOlqwLHC4RdCtWVF4wLJI4ILJAAwLOgILHoALNgEVBQtUBQQA/AAw="
            )
          );
        },
      },
      { type: "txt", font: "6x8", label: feed.displayName, id: "title" },
    ],
  });
  g.clear();
  layout.render();
}

// Makes the HTTP request to fetch a feed and stores it in items
// Todo make this a promise maybe
function fetchData(feed) {
  var config = feed.config;
  var conditions = `[./${config.bodyTag}/text() != "" and ./${config.titleTag}/text() != "" and ./${config.linkTag}/text() != ""]`;
  Bangle.http(feed.url, {
    return: "array",
    xpath: `//${config.itemTag}${conditions}/${config.titleTag}|//${config.itemTag}${conditions}/${config.bodyTag}|//${config.itemTag}${conditions}/${config.linkTag}`,
  }).then((data) => {
    //function mockData(data) {
    console.log(data.resp);
    mainmenu = {
      "": { title: title }, // options
      //"Exit" : function() { E.showMenu(); }, // remove the menu
    };
    for (var i = 0; i < data.resp.length; i += 3) {
      let index = Math.floor(i / 3);
      let itemTitle = data.resp[i];
      items[index] = {
        new: true,
        id: index,
        src: title,
        title: data.resp[i],
        link: data.resp[i + 1],
        desc: data.resp[i + 2],
      };
      //mainmenu = Object.assign(mainmenu, { itemTitle : () => { display2(index) } });
    }
  });
}

// Open a feed - display the loading screen, fetch the XML data and display the items
function openFeed(feed) {
  displayLoadingPage(feed);
  fetchData(feed);
  showItemList(items);
}

// Entrypoint into the app - shows the list of registered feeds
function showFeedList() {
  var mainmenu = {
    "": { title: "RSS Reader" }, // options
  };
  feeds.forEach((feed) => {
    mainmenu = Object.defineProperty(mainmenu, feed.displayName, {
      value: () => openFeed(feed),
    });
  });
  E.showMenu(mainmenu);
}
showFeedList();
