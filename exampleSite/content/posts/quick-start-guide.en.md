---
title: "Quick Start Guide: Writing & Publishing with Smidr"
date: 2026-03-25T12:00:00Z
draft: false
description: "A complete walkthrough and interactive cheatsheet showcasing all core capabilities, shortcodes, and technical features of the Smidr Hugo theme."
tags: ["guide", "markdown", "quickstart", "hugo", "features"]
categories: ["Tutorials"]
math: true
gardenGraph: true
showBacklinks: true
---

Welcome to **Smidr**—a fast, responsive, and feature-complete Hugo theme designed for researchers, roboticists, engineers, and technical writers. This guide serves as both an interactive tour and a copy-paste reference for all built-in capabilities.

---

## 1. Creating Content & Page Bundles

Create a new article bundle directly using the Hugo CLI:

```bash
hugo new posts/autonomous-navigation/index.en.md
```

Using leaf bundles (`folder/index.en.md` and `folder/index.de.md`) keeps your images, local scripts, and companion `.bib` bibliography files neatly organized in the same folder.

---

## 2. Dynamic Multilingual Hero & Branding

Smidr supports full internationalization across English and German. You can customize the landing page header badge, subtitle, and description per language in your `hugo.yaml`:

```yaml
languages:
  en:
    title: "Jokobus"
    params:
      hero_badge: "ROBOTICS &bull; EMBEDDED SYSTEMS &bull; APPLIED AI"
      subtitle: "Exploring Robotics, Embedded Systems & Applied Machine Learning"
      description: "Field notes, interactive code, and technical deep-dives into modern engineering."
  de:
    title: "Jokobus"
    params:
      hero_badge: "ROBOTIK &bull; EMBEDDED SYSTEMS &bull; ANGEWANDTE KI"
      subtitle: "Praxisnotizen zu Robotik, Embedded Systems & angewandter KI"
      description: "Praxiserprobte Einblicke, interaktiver Code und technische Notizen."
```

If omitted, Smidr provides localized default fallbacks automatically.

---

## 3. LaTeX Mathematics (KaTeX)

Smidr includes client-side KaTeX for instant, zero-latency mathematical typesetting:

- **Inline formulas:** Enclose in single dollar signs `$f(x) = \sigma(W x + b)$` to render $f(x) = \sigma(W x + b)$.
- **Display equations:** Enclose in double dollar signs `$$...$$`:

$$\mathcal{L}_{PID}(t) = K_p e(t) + K_i \int_0^t e(\tau) d\tau + K_d \frac{de(t)}{dt}$$

---

## 4. Code Blocks with One-Click Copy

Standard Markdown code blocks automatically display syntax-highlighted code, language indicators, horizontal scroll containment, and an animated copy button:

```rust
// Rust kinematics controller loop
pub fn step_controller(target: f64, current: f64) -> f64 {
    let error = target - current;
    let gain = 1.45;
    gain * error
}
```

---

## 5. Callouts & Admonition Alerts

Highlight critical warnings, pro tips, hardware advice, or theoretical notes using the `alert` shortcode (or shortcuts `tip`, `note`, `warning`, `caution`, `info`, `robotics`):

{{< alert type="tip" title="Pro Tip" >}}
You can pick between 6 distinct alert styling presets: `info`, `note`, `tip`, `warning`, `caution`, and `robotics`.
{{< /alert >}}

{{< alert type="robotics" title="Robotics Hardware Safety" >}}
Always engage hardware emergency-stop interlocks before enabling high-voltage motor drivers or closed-loop torque control.
{{< /alert >}}

---

## 6. Client-Side WebAssembly Code Execution

Enable readers to experiment with algorithms directly inside the browser using Pyodide-powered WebAssembly:

{{< code-runner lang="python" title="Interactive Python Playground" >}}
import math

angles_deg = [0, 30, 45, 60, 90]
radians = [math.radians(deg) for deg in angles_deg]
sines = [round(math.sin(rad), 4) for rad in radians]

print("Angles (deg):", angles_deg)
print("Sine values :", sines)
{{< /code-runner >}}

---

## 7. Interactive Parameter Widgets & Sliders

Embed interactive HTML5 Canvas visualizers with live parameter sliders to demonstrate dynamic systems and control responses in real time:

{{< interactive-widget title="Dynamic System Response Tuner" desc="Adjust damping and natural frequency sliders in real time to observe the step response." >}}

---

## 8. Interactive 3D Flashcards

Engage learners with full-width memory flashcards that flip with a smooth 3D CSS rotation on click or tap:

{{< flashcard front="What is the Nyquist-Shannon Sampling Theorem?" hint="Click or tap to flip" >}}
**Answer:**  
A continuous-time bandlimited signal can be perfectly reconstructed from its discrete samples if and only if the sampling frequency exceeds twice the maximum frequency component:  
$$f_s > 2 B$$
{{< /flashcard >}}

---

## 9. Collapsible Sections & Expandable Bars

Keep long derivations, proofs, or optional exercises clean and organized using collapsible bars (aliases: `collapse`, `details`, `accordion`, `spoiler`):

{{< collapse title="Click to expand the Euler-Lagrange derivation" open="false" >}}
Starting from Hamilton's principle of least action $\delta S = 0$, where the Lagrangian $\mathcal{L} = T - V$:

$$\frac{d}{dt}\left(\frac{\partial \mathcal{L}}{\partial \dot{q}_i}\right) - \frac{\partial \mathcal{L}}{\partial q_i} = Q_i$$

Here, generalized coordinates $q_i$ and non-conservative forces $Q_i$ define the full equation of motion for robotic manipulators.
{{< /collapse >}}

---

## 10. Academic Citations & BibTeX Bibliography Engine

Smidr includes a native bibliography engine supporting standard `.bib` files and inline BibTeX:

1. **Automatic `.bib` Loading:** Place a `references.bib` file inside your post directory. Smidr automatically detects, parses, and formats it.
2. **In-Text Citation:** Reference keys anywhere in your text using `{{</* cite "key" */>}}` or `{{</* cite "key1,key2" */>}}`.
3. **Citation Popovers:** Hovering over any citation badge reveals an instant bibliographic card with author, title, journal, and year.
4. **Citation Styles:** Switch styles globally in `params.yaml` or per post in frontmatter:
   - `numeric`: `[1]`
   - `author-year`: `(Kalman, 1960)`
   - `alphanumeric`: `[Kal60]`
5. **Direct BibTeX Export:** Every bibliographic entry features a one-click **Copy BibTeX** button and direct DOI/URL links.

### Example Citation & Bibliography:

As shown in Kalman's seminal paper {{< cite "kalman1960" >}} and foundational feedback theory {{< cite "astrom2010" >}}, optimal estimation requires minimal variance guarantees.

{{< bibliography title="References & Citations" >}}
@article{kalman1960,
  title = {A New Approach to Linear Filtering and Prediction Problems},
  author = {Kalman, Rudolph Emil},
  journal = {Journal of Basic Engineering},
  volume = {82},
  number = {1},
  pages = {35--45},
  year = {1960},
  doi = {10.1115/1.3662552}
}

@book{astrom2010,
  title = {Feedback Systems: An Introduction for Scientists and Engineers},
  author = {Astrom, Karl Johan and Murray, Richard M.},
  publisher = {Princeton University Press},
  year = {2010},
  url = {https://www.cds.caltech.edu/~murray/amwiki}
}
{{< /bibliography >}}

---

## 11. Interactive Knowledge Graph (Digital Garden)

Connect your thoughts visually! Set `gardenGraph: true` in your frontmatter or `params.yaml` to render an interactive physics-simulated network graph at the bottom of the page or on the homepage. Readers can zoom, pan, hover to highlight clusters, and click nodes to navigate directly between interconnected ideas.

---

## 12. Contextual Backlinks

When `showBacklinks: true` is configured, Smidr automatically discovers and displays all incoming references from other articles in your knowledge base, turning your blog into a self-organizing digital garden.

---

## 13. Popover Footnotes

Standard Markdown footnotes in Smidr don't disrupt the reader's flow[^1].

[^1]: Hovering or tapping this number opens a sleek popover right in place. Clicking the anchor smoothly jumps with dedicated viewport clearance.

---

## 14. Command Palette & Instant Fuzzy Search

Press **`Ctrl` + `K`** (or **`Cmd` + `K`** on macOS), or click the search button in the navigation bar or hero section. A modern cyberpunk modal appears instantly, allowing real-time fuzzy querying across article titles, headings, tags, and content snippets.

---

## 15. OpenPGP Cryptographic Identity Verification

Display your public cryptographic key, fingerprint, and verification instructions with `pgp-card`:

{{< pgp-card name="Smidr Core Engineer" email="engineer@example.org" keyId="A1B2C3D4E5F67890" fingerprint="ABCD 1234 EF56 7890 ABCD  1234 EF56 7890 ABCD 1234" algo="RSA 4096 / Ed25519" keyUrl="/openpgp/key.asc" >}}
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.1.0

mQGNBGXx... [Your ASCII Armored Key Here] ...
-----END PGP PUBLIC KEY BLOCK-----
{{< /pgp-card >}}

---

## 16. Vector TikZ Diagrams

Render publication-grade TikZ and PGF vector schematics directly in your browser:

```markdown
{{</* tikz caption="Closed-loop feedback control diagram." */>}}
\begin{tikzpicture}[auto, node distance=2cm, >=latex]
  \node [input, name=input] {};
  \node [sum, right of=input] (sum) {};
  \node [block, right of=sum] (controller) {Controller};
  \draw [->] (input) -- node {$r(t)$} (sum);
  \draw [->] (sum) -- node {$e(t)$} (controller);
\end{tikzpicture}
{{</* /tikz */>}}
```

---

## 17. Asciinema Terminal Replay & File Inclusion

- **Terminal Recordings:** Embed interactive, lightweight terminal sessions without bulky video files:
  ```markdown
  {{</* asciinema id="123456" title="Deploying Smidr with Hugo" */>}}
  ```
- **External Code Files:** Reference source code files directly from your repository instead of copy-pasting:
  ```markdown
  {{</* code-file source="scripts/controller.py" lang="python" title="Controller Implementation" */>}}
  ```

---

## 18. Secret & Spoiler Reveals

Conceal sensitive solutions or puzzle answers with the `secret` shortcode:

Verification token: {{< secret >}}CYBER-SMIDR-2026{{< /secret >}} *(Hover or tap to reveal)*

---

## 19. AI Transparency & Provenance Badges

Smidr champions transparent scientific communication. Add provenance metadata to your frontmatter:

```yaml
used_ai: true
original_language: "de"
original_post_path: "/de/posts/mein-original/"
ai_model: "Claude 3.7 / Ollama"
```

Smidr automatically renders an unobtrusive provenance notice informing readers whether a post was human-authored, translated, or refined with AI assistance.
