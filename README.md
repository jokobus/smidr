# Smidr ⚡

A modern, tech-savvy, and futuristic Hugo theme engineered for **Robotics, Machine Learning, and Engineering** blogs and digital gardens.

Designed to look sleek and cyberpunk while adhering to strict privacy, high accessibility standards (a11y), and zero server-side vulnerabilities.

---

## ✨ Features

- **🎨 Futuristic Cyber Aesthetics & Color Gradients:**
  - Modern neon gradients (`#00f0ff`, `#7000ff`, `#ff007a`, `#00f5a0`), subtle circuit dot grids, and glassmorphism.
  - Hover glow effects and dynamic border highlights.
  - Custom `::selection` styling with vibrant neon accents.
  - **Secret Text Shortcode**: Hidden text colored identical to the background that reveals itself when selected or hovered!

- **🌓 Instant Dark / Light Mode:**
  - Smooth theme toggling (Dark by default, crisp Light mode).
  - Automatically respects user OS `prefers-color-scheme` and remembers user choice via `localStorage`.

- **🌍 Bilingual & i18n Ready (English & German):**
  - Full native Hugo i18n support (`en` and `de`).
  - Seamless one-click language switcher in the header and Command Palette.
  - Localized dates, reading times (`~4 min read` / `~4 Min. Lesezeit`), word counts, and search strings.

- **⌨️ Command Palette (Cmd + K / Ctrl + K):**
  - Instant fuzzy search modal powered by client-side indexing (`index.json`).
  - Search articles, tags, and topics without Google or third-party trackers.
  - Quick action shortcuts: toggle theme, copy current page link, switch languages, or jump to sections.

- **🔬 Interactive Code Runners & Playgrounds (WASM):**
  - Run Python directly in the browser via **Pyodide WebAssembly** (`{{< code-runner lang="python" >}}`).
  - Run sandboxed JavaScript vector/kinematics snippets (`{{< code-runner lang="js" >}}`).
  - **100% Client-Side Guarantee**: No code is ever transmitted to or executed on your server (Raspberry Pi / GitHub Pages). Your server only serves static files, making it completely immune to code injection, overload, or memory exhaustion.

- **📊 Dynamic Control & Physics Widgets:**
  - Embed interactive parameter sliders ($K_p$, damping $\zeta$, natural frequency $\omega_n$) with real-time HTML5 Canvas step response graphs (`{{< interactive-widget >}}`).

- **🕸️ Contextual Backlinks & Digital Garden Knowledge Graph:**
  - Bidirectional link detection discovers and displays incoming references at the bottom of articles (Roam/Obsidian style).
  - Interactive force-directed canvas graph mapping relationships between articles and tags.

- **📐 LaTeX Math Mode (KaTeX):**
  - Blazing fast, client-side rendering for inline (`$...$`) and display (`$$...$$`) mathematical equations.

- **💻 Enhanced Code Blocks:**
  - Language badges (e.g. `PYTHON`, `RUST`, `BASH`).
  - Copy to clipboard with animated "Copied! ✓" feedback.
  - Horizontal scrolling without line breaking or layout disruption.

- **💬 Modern Inline Footnote Popovers:**
  - Reveals footnote content in an elegant popover on hover or tap without jumping readers down to the footer.

- **📦 Rich Admonitions & Callout Boxes:**
  - Supported types: `info`, `warning`, `caution`, `tip`, `robotics` via `{{< alert type="..." title="..." >}}`.

- **🎮 Retro-Cyberpunk 404 Jump & Run Game:**
  - Interactive HTML5 canvas mini-game on the 404 page featuring a Cyber Rover jumping over obstacles, double-jumping, collecting energy cores, and tracking High Scores in `localStorage`.

- **👁️ Dynamic Tab Title & Favicon:**
  - Changes the browser tab title and favicon to an alert state when the visitor navigates away, switching back on return.

- **🛡️ Privacy & Semantic SEO:**
  - Zero Google trackers or ad networks.
  - Privacy-first analytics via **Umami**.
  - Semantic HTML5, ARIA labels, skip-to-content accessibility link.
  - Full OpenGraph & Twitter Cards metadata for Discord, Mastodon, X, and Slack link unfurls.
  - Legal notices: Configurable copyright range (`© 2024-2026`), Imprint (Impressum), and Privacy Policy.

---

## 🚀 Quick Start

### 1. Installation

You can add Smidr as a git submodule to your Hugo site:

```bash
git submodule add https://github.com/jokobus/smidr.git themes/smidr
```

### 2. Configure `hugo.yaml`

Set the theme in your site's `hugo.yaml`:

```yaml
baseURL: "https://yourdomain.com/"
title: "Your Robotics & ML Logbook"
theme: "smidr"
defaultContentLanguage: "en"

outputs:
  home:
    - HTML
    - RSS
    - JSON # Required for Command Palette search!
  page:
    - HTML
  section:
    - HTML
    - RSS

# Multi-language configuration (English & German)
languages:
  en:
    label: "English"
    locale: "en-US"
    weight: 1
    menus:
      main:
        - name: "Home"
          url: "/"
          weight: 10
        - name: "Blog"
          url: "/posts/"
          weight: 20
        - name: "Projects"
          url: "/projects/"
          weight: 30
        - name: "Publications"
          url: "/publications/"
          weight: 40
        - name: "About"
          url: "/about/"
          weight: 50
  de:
    label: "Deutsch"
    locale: "de-DE"
    weight: 2
    menus:
      main:
        - name: "Start"
          url: "/de/"
          weight: 10
        - name: "Blog"
          url: "/de/posts/"
          weight: 20
        - name: "Projekte"
          url: "/de/projects/"
          weight: 30

params:
  since: 2024
  author:
    name: "Your Name or Alias"
    email: "contact@example.org"
  math: true

  # Privacy-friendly Analytics (No Google Tracking)
  umami:
    websiteId: "your-umami-website-id"
    hostUrl: "https://cloud.umami.is"

markup:
  goldmark:
    renderer:
      unsafe: true # Required for interactive widgets and HTML shortcodes
```

---

## 📝 Shortcodes Guide

### 1. Admonitions / Callouts (`alert`)

```markdown
{{</* alert type="robotics" title="Actuator Limit" */>}}
Rotational motor velocities are physically bounded by maximum ESC voltage.
{{</* /alert */>}}
```
Supported types: `info`, `warning`, `caution`, `tip`, `robotics`.

### 2. Interactive WASM Code Runner (`code-runner`)

```markdown
{{</* code-runner lang="python" title="Pyodide Forward Pass" */>}}
import math

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

print("Activation:", sigmoid(2.5))
{{</* /code-runner */>}}
```

### 3. Interactive Parameter Slider Widget (`interactive-widget`)

```markdown
{{</* interactive-widget title="PID Step Response Tuner" */>}}
```

### 4. Secret Text (`secret`)

Text colored identically to the background, revealed on cursor hover or text selection:

```markdown
{{</* secret hint="Select to decrypt" */>}}
CLASSIFIED-PAYLOAD-VECTOR
{{</* /secret */>}}
```

---

## 🛠️ Extensibility: Adding Future Pages (About, CV, Publications)

The navigation menu reads directly from your `hugo.yaml` `menus.main`. To add future sections when you're ready:

1. Create the markdown content file (e.g. `content/about.en.md` and `content/about.de.md` or `content/publications.en.md`).
2. Add the corresponding menu item in `hugo.yaml` under `menus.main`:
   ```yaml
   - name: "Publications"
     url: "/publications/"
     weight: 40
   ```

---

## 🔒 Security on Static Servers (Raspberry Pi & GitHub Pages)

When hosting with Caddy / Nginx on a Raspberry Pi or deploying via GitHub Actions:
- Hugo outputs purely static HTML, CSS, JavaScript, and SVG files.
- Pyodide WebAssembly runs **100% inside the client's browser engine**.
- No Node.js backend, no Python backend, and no database runs on the server.
- The server only serves static files, preventing remote code execution (RCE) and computational overload.

---

## 📄 License

Smidr is released under the [MIT License](LICENSE).
