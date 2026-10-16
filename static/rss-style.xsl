<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> - RSS Feed Preview</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          :root {
            --bg: #090d16;
            --surface: #131d31;
            --border: rgba(255, 255, 255, 0.1);
            --primary: #00f0ff;
            --text: #f1f5f9;
            --muted: #94a3b8;
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            margin: 0;
            padding: 2rem 1.5rem;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .badge {
            display: inline-block;
            background: rgba(0, 240, 255, 0.15);
            color: var(--primary);
            padding: 0.2rem 0.6rem;
            border-radius: 9999px;
            font-size: 0.8rem;
            font-weight: 700;
            font-family: monospace;
          }
          h1 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
          a { color: var(--primary); text-decoration: none; }
          a:hover { text-decoration: underline; }
          .feed-url-box {
            display: flex;
            gap: 0.5rem;
            margin: 1rem 0;
            background: #060911;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid var(--border);
            font-family: monospace;
            word-break: break-all;
          }
          .post-item {
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.25rem;
            margin-bottom: 1.25rem;
          }
          .post-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          .post-date {
            font-size: 0.8rem;
            color: var(--primary);
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <span class="badge">📡 RSS FEED / ATOM WEB PREVIEW</span>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p><xsl:value-of select="/rss/channel/description"/></p>
            <p style="color: var(--muted); font-size: 0.9rem;">
              This is the raw XML web feed. Subscribe by copying the feed URL below into your preferred RSS news reader (such as NetNewsWire, Feedly, Thunderbird, or Inoreader):
            </p>
            <div class="feed-url-box">
              <span id="feed-url"><xsl:value-of select="/rss/channel/link"/>index.xml</span>
            </div>
            <a href="{/rss/channel/link}">&larr; Return to Homepage</a>
          </div>

          <div class="card">
            <h2 style="margin-top: 0;">Recent Posts in Feed</h2>
            <xsl:for-each select="/rss/channel/item">
              <div class="post-item">
                <div class="post-date"><xsl:value-of select="pubDate"/></div>
                <h3 style="margin: 0.35rem 0 0.5rem;">
                  <a href="{link}"><xsl:value-of select="title"/></a>
                </h3>
                <p style="color: var(--muted); font-size: 0.95rem; margin: 0;">
                  <xsl:value-of select="description" disable-output-escaping="yes"/>
                </p>
              </div>
            </xsl:for-each>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
