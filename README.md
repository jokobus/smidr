# Smidr 🔨

A modern, tech-savvy, and futuristic Hugo theme engineered for **Robotics, Machine Learning, and Engineering** blogs and digital gardens.

Named after the Old Norse smith / craftsman (*Smiðr*), it features a cyberpunk forged aesthetic with clean typography, high accessibility (a11y), responsive mobile layouts, and zero server-side vulnerabilities.

---

## ✨ Features

- **🎨 Futuristic Cyber Aesthetics & Color Gradients:**
  - Iconic **Smith's Hammer** (🔨) brand logo and custom favicon.
  - Modern neon gradients (`#00f0ff`, `#7000ff`, `#ff007a`, `#00f5a0`), subtle circuit dot grids, and glassmorphism.
  - Custom `::selection` styling with vibrant neon accents.
  - **Secret Text Shortcode**: Hidden text colored identical to the background that reveals itself when selected or hovered!

- **📱 Full Mobile & Small-Screen Responsiveness:**
  - Fully optimized for smartphones and tablets.
  - Collapsible slide-down mobile navigation drawer with touch-friendly menu targets.
  - Auto-resizing interactive canvas widgets and touch controls for games, graphs, and code playgrounds.

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
  - Bidirectional link detection discovers and displays incoming references at the bottom of articles in Obsidian/Roam-style cards.
  - Interactive force-directed canvas graph mapping relationships between articles, tags, and categories.

- **📚 Academic Publications & CV Sections:**
  - Dedicated **Publications** page with conference/journal cards, PDF/DOI/Code links, and expandable BibTeX & Abstract (`{{< publication >}}`).
  - Dedicated **About & CV** page with a clean career timeline (`{{< cv-item >}}`) and technical skillsets.

- **🏷️ Taxonomy & Categories Overview:**
  - Complete `/categories/` and `/tags/` overview grids with post count badges and keyword exploration.

- **📐 LaTeX Math Mode (KaTeX):**
  - Blazing fast, client-side rendering for inline (`$...$`) and display (`$$...$$`) mathematical equations.

- **💻 High-Contrast Code Highlighting:**
  - Bundled Dracula syntax highlighting for both dark and light modes.
  - Immediate visibility with no unstyled text lag.
  - Language badges (e.g. `PYTHON`, `RUST`, `BASH`), animated "Copied! ✓" feedback, and horizontal scrolling.

- **💬 Modern Inline Footnote Popovers:**
  - Reveals footnote content in an elegant popover on hover or tap without jumping readers down to the footer.

- **📦 Rich Admonitions & Callout Boxes:**
  - Supported types: `info`, `warning`, `caution`, `tip`, `robotics` via `{{< alert type="..." title="..." >}}`.

- **🎮 Retro-Cyberpunk 404 Jump & Run Game:**
  - Interactive HTML5 canvas mini-game on the 404 page featuring a Cyber Rover jumping over obstacles, double-jumping, collecting energy cores, and tracking High Scores in `localStorage`.

- **📡 RSS / Atom Feed with Human-Readable XSLT:**
  - Standard RSS 2.0 XML feed (`index.xml`) compliant with all feed readers.
  - Styled with an **XSLT stylesheet (`rss-style.xsl`)**, so when a human visitor opens the `.xml` link in Chrome or Firefox, it renders as a sleek, user-friendly webpage instead of raw XML!

---

## ✍️ Quick Start: Writing a New Post (Zero AI Needed)

Writing a new article is as simple as running:

```bash
hugo new posts/my-first-post.md
```

This uses Smidr's built-in archetype, pre-filling a complete cheatsheet with:
- Frontmatter tags, categories, math mode toggle
- Ready-to-use LaTeX math example
- Formatted code block with copy button
- Callout alert box
- Interactive Pyodide WASM runner
- Parameter slider widget
- Popover footnote

You can also look at `exampleSite/content/posts/quick-start-guide.en.md` for a complete live reference.

---

## 🚀 Installation & Setup

### 1. Add Submodule

```bash
git submodule add https://github.com/jokobus/smidr.git themes/smidr
```

### 2. Configure `hugo.yaml`

```yaml
baseURL: "https://yourdomain.com/"
title: "Smidr"
theme: "smidr"
defaultContentLanguage: "en"

outputs:
  home:
    - HTML
    - RSS
    - JSON # Required for Command Palette fuzzy search!
  page:
    - HTML
  section:
    - HTML
    - RSS
  taxonomy:
    - HTML
  term:
    - HTML

languages:
  en:
    label: "English"
    locale: "en-US"
    weight: 1
    title: "Smidr"
    menus:
      main:
        - name: "Home"
          url: "/"
          weight: 10
        - name: "Blog"
          url: "/posts/"
          weight: 20
        - name: "Publications"
          url: "/publications/"
          weight: 30
        - name: "About & CV"
          url: "/about/"
          weight: 40

  de:
    label: "Deutsch"
    locale: "de-DE"
    weight: 2
    title: "Smidr"
    menus:
      main:
        - name: "Start"
          url: "/de/"
          weight: 10
        - name: "Blog"
          url: "/de/posts/"
          weight: 20
        - name: "Publikationen"
          url: "/de/publications/"
          weight: 30
        - name: "Über mich & CV"
          url: "/de/about/"
          weight: 40

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

### 1. Academic Publication (`publication`)
```markdown
{{</* publication
  title="Real-Time Neural MPC for Agile Flight"
  authors="J. Smidr, A. Turing"
  venue="ICRA 2026"
  year="2026"
  pdf="https://arxiv.org/abs/..."
  doi="https://doi.org/..."
  code="https://github.com/..."
*/>}}
**Abstract:** Paper summary here...
```bibtex
@inproceedings{...}
```
{{</* /publication */>}}
```

### 2. CV / Career Timeline (`cv-item`)
```markdown
{{</* cv-item period="2024 — Present" title="Senior Systems Engineer" org="Robotics Lab" location="Munich" */>}}
Key achievements and responsibilities.
{{</* /cv-item */>}}
```

### 3. Admonitions (`alert`)
```markdown
{{</* alert type="robotics" title="Actuator Saturation" */>}}
Rotational velocities are physically bounded by maximum ESC voltage.
{{</* /alert */>}}
```
Supported types: `info`, `warning`, `caution`, `tip`, `robotics`.

### 4. Interactive WASM Code Runner (`code-runner`)
```markdown
{{</* code-runner lang="python" title="Pyodide Forward Pass" */>}}
import math
print("Result:", math.sqrt(64))
{{</* /code-runner */>}}
```

### 5. Interactive Parameter Slider Widget (`interactive-widget`)
```markdown
{{</* interactive-widget title="PID Step Response Tuner" */>}}
```

### 6. TikZ Vector Diagrams (`tikz`)
Compile LaTeX TikZ code directly in the browser via WebAssembly (set `tikz: true` in your post frontmatter):
```markdown
{{</* tikz caption="Closed-loop quadrotor feedback architecture." */>}}
\begin{tikzpicture}[auto, node distance=2cm, >=latex]
  \draw[rounded corners, fill=cyan!10, draw=cyan!80, line width=1pt] (0,0) rectangle (2.5,1.2) node[pos=.5] {\textbf{Controller} $K$};
  \draw[rounded corners, fill=purple!10, draw=purple!80, line width=1pt] (4.5,0) rectangle (7.0,1.2) node[pos=.5] {\textbf{Quadrotor} $G(s)$};
  \draw[->, line width=1pt] (-1.5,0.6) -- node[above] {$r(t)$} (0,0.6);
  \draw[->, line width=1pt] (2.5,0.6) -- node[above] {$u(t)$} (4.5,0.6);
  \draw[->, line width=1pt] (7.0,0.6) -- node[above] {$x(t)$} (9.0,0.6);
\end{tikzpicture}
{{</* /tikz */>}}
```

### 7. BibTeX In-Text Citations & Bibliography (`cite` and `bibliography`)
Cite references in your markdown text:
```markdown
As established by Kalman {{</* cite "kalman1960" */>}} in state-space theory...
```
At the end of your post, provide your BibTeX block (or link a `.bib` file):
```markdown
{{</* bibliography title="References & Citations" */>}}
@article{kalman1960,
  title = {A New Approach to Linear Filtering and Prediction Problems},
  author = {Kalman, Rudolph Emil},
  journal = {Journal of Basic Engineering},
  volume = {82},
  year = {1960},
  doi = {10.1115/1.3662552}
}
{{</* /bibliography */>}}
```
Smidr automatically:
- Assigns sequential citation numbers (`[1]`, `[2]`, ...) based on appearance in the text.
- Generates hover tooltips on citation links.
- Formats references in IEEE/ACM academic style with clickable DOI links.
- Attaches an expandable BibTeX code drawer with a one-click **"📋 Copy BibTeX"** button!

### 8. Secret Text (`secret`)
```markdown
{{</* secret hint="Select to decrypt" */>}}
CLASSIFIED-PAYLOAD-VECTOR
{{</* /secret */>}}
```

---

## 🔒 Security on Static Servers (Raspberry Pi & GitHub Pages)

When hosting with Caddy on a Raspberry Pi or deploying via GitHub Actions:
- Hugo outputs purely static HTML, CSS, JavaScript, and SVG files.
- Pyodide WebAssembly runs **100% inside the client's browser engine**.
- No code is sent to or executed on the server.
- The server only serves static files, preventing remote code execution (RCE) and computational overload.

---

## ❓ Frequently Asked Questions

### Is it correct that the RSS feed is only an `.xml` file?
**Yes!** By internet specification (RSS 2.0 / Atom), RSS feeds are structured XML documents intended for automated consumption by feed readers (such as Feedly, NetNewsWire, Thunderbird, or Inoreader). 

However, in Smidr we bundle a custom **XSLT stylesheet (`rss-style.xsl`)**. When a human visitor clicks the `/index.xml` link directly in their browser, the browser applies the stylesheet to render a beautiful, responsive preview page with feed details and recent articles!

---

## 📄 License

Smidr is released under the [MIT License](LICENSE).
