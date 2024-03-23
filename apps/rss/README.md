# Rough and Ready RSS
A semi-working RSS feed reader that can display a title, description and link from RSS feeds based on configuration

Styled on the Messages UI from Bangle for familiarity.

## Known issues/Todos
GadgetBridge/Bangle only exposes XPath 1.0, which has some limitations such as document based ordering - alongside this, GadgetBridge only returns getTextContent() which makes it difficult to parse RSS feeds automatically

Plan is to investigate XPath 2.0 availability in Java (Saxon maybe?) or investigate integrating something like Rome into GadgetBridge to allow rss feeds to be retrieved in a nicer fashion 

## Planned features
- Bookmarks
- Cache and Refresh posts
