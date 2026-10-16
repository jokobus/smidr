<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> - Web Feed Preview</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          <![CDATA[
          :root {
            --bg: #090d16;
            --surface: #0f172a;
            --surface-elevated: #1e293b;
            --border: #1e293b;
            --border-highlight: #334155;
            --primary: #00f0ff;
            --secondary: #ff007a;
            --text: #f8fafc;
            --muted: #94a3b8;
          }
          * { box-sizing: border-box; }
          body {
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.6;
            margin: 0;
            padding: 2.5rem 1.5rem;
          }
          .container {
            max-width: 820px;
            margin: 0 auto;
          }
          .card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: rgba(0, 240, 255, 0.12);
            color: var(--primary);
            border: 1px solid rgba(0, 240, 255, 0.3);
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          h1 {
            margin: 1rem 0 0.5rem;
            font-size: 1.85rem;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.5px;
          }
          h2 {
            margin-top: 0;
            margin-bottom: 1.25rem;
            font-size: 1.35rem;
            font-weight: 700;
            color: #ffffff;
            border-bottom: 1px solid var(--border);
            padding-bottom: 0.75rem;
          }
          p { margin: 0 0 1rem; }
          a {
            color: var(--primary);
            text-decoration: none;
            transition: color 0.15s ease;
          }
          a:hover {
            color: #38bdf8;
            text-decoration: underline;
          }
          .feed-box-wrapper {
            display: flex;
            align-items: stretch;
            gap: 0.5rem;
            margin: 1.25rem 0;
            flex-wrap: wrap;
          }
          .feed-url-box {
            flex: 1;
            min-width: 260px;
            background: #060911;
            padding: 0.75rem 1rem;
            border-radius: 8px;
            border: 1px solid var(--border);
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.9rem;
            color: var(--primary);
            word-break: break-all;
            display: flex;
            align-items: center;
          }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.25rem;
            font-size: 0.875rem;
            font-weight: 700;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.15s ease;
            text-decoration: none;
            border: none;
          }
          .btn-primary {
            background: var(--primary);
            color: #090d16;
          }
          .btn-primary:hover {
            background: #38bdf8;
            text-decoration: none;
            transform: translateY(-1px);
          }
          .post-item {
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .post-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }
          .post-date {
            font-size: 0.8rem;
            color: var(--muted);
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          }
          .post-title {
            margin: 0.4rem 0 0.5rem;
            font-size: 1.2rem;
            font-weight: 700;
          }
          .post-desc {
            color: #cbd5e1;
            font-size: 0.95rem;
            margin: 0;
            line-height: 1.6;
            max-height: 5.2em;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          .tag-pill {
            display: inline-block;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: var(--muted);
            padding: 0.15rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            margin-right: 0.4rem;
            margin-top: 0.5rem;
          }
          .return-link {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            font-weight: 600;
            font-size: 0.9rem;
          }
          ]]>
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <span class="badge">📡 RSS / ATOM WEB FEED PREVIEW</span>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p style="color: var(--muted); font-size: 1.05rem;"><xsl:value-of select="/rss/channel/description"/></p>
            <p style="color: #cbd5e1; font-size: 0.925rem;">
              You are viewing the styled preview of this website's RSS news feed. To subscribe, copy the URL below into your RSS reader (e.g. NetNewsWire, Feedly, Thunderbird, Inoreader, or Reeder):
            </p>
            <div class="feed-box-wrapper">
              <div class="feed-url-box">
                <span id="feed-url">
                  <xsl:choose>
                    <xsl:when test="/rss/channel/atom:link[@rel='self']/@href">
                      <xsl:value-of select="/rss/channel/atom:link[@rel='self']/@href"/>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="/rss/channel/link"/>index.xml
                    </xsl:otherwise>
                  </xsl:choose>
                </span>
              </div>
              <button id="copy-btn" class="btn btn-primary" onclick="copyFeedUrl()">Copy Feed URL</button>
            </div>
            <div>
              <a href="{/rss/channel/link}" class="return-link">&#x2190; Return to Homepage</a>
            </div>
          </div>

          <div class="card">
            <h2>Recent Articles in Feed</h2>
            <xsl:for-each select="/rss/channel/item">
              <div class="post-item">
                <div class="post-date"><xsl:value-of select="pubDate"/></div>
                <div class="post-title">
                  <a href="{link}"><xsl:value-of select="title"/></a>
                </div>
                <div class="post-desc">
                  <xsl:value-of select="description" disable-output-escaping="yes"/>
                </div>
                <div style="margin-top: 0.35rem;">
                  <a href="{link}" style="font-size: 0.85rem; font-weight: 600; color: #38bdf8;">Read full post &#x2192;</a>
                </div>
                <xsl:if test="category">
                  <div style="margin-top: 0.5rem;">
                    <xsl:for-each select="category">
                      <span class="tag-pill"><xsl:value-of select="."/></span>
                    </xsl:for-each>
                  </div>
                </xsl:if>
              </div>
            </xsl:for-each>
          </div>
        </div>

        <script>
          <![CDATA[
          function copyFeedUrl() {
            var el = document.getElementById('feed-url');
            var btn = document.getElementById('copy-btn');
            if (!el || !btn) return;
            var text = el.textContent.trim();
            navigator.clipboard.writeText(text).then(function() {
              var old = btn.textContent;
              btn.textContent = '✓ Copied!';
              btn.style.background = '#10b981';
              btn.style.color = '#ffffff';
              setTimeout(function() {
                btn.textContent = old;
                btn.style.background = '';
                btn.style.color = '';
              }, 2000);
            }).catch(function() {
              prompt('Copy feed URL:', text);
            });
          }
          ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
