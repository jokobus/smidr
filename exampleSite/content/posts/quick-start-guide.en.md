---
title: "Quick Start Guide: Writing & Publishing with Smidr"
date: 2026-03-25T12:00:00Z
draft: false
description: "A complete step-by-step walkthrough and live cheatsheet for authoring content with the Smidr Hugo theme—no AI required."
tags: ["guide", "markdown", "quickstart", "hugo"]
categories: ["Tutorials"]
math: true
gardenGraph: true
showBacklinks: true
---

Welcome to **Smidr**! This guide demonstrates how simple it is to compose and publish rich technical articles using native Markdown and Smidr's built-in shortcodes.

## 1. Creating a New Article

To generate a new article with all archetypes and frontmatter preconfigured, simply run:

```bash
hugo new posts/my-first-simulation.md
```

This creates a clean Markdown file in `content/posts/` with tags, categories, math mode, and backlink detection already enabled.

## 2. LaTeX Mathematics

Smidr includes client-side KaTeX for instantaneous rendering of mathematical formulations:

- **Inline equations**: Type `$f(x) = \sigma(W x + b)$` to render $f(x) = \sigma(W x + b)$.
- **Display equations**: Wrap your formula in double dollar signs:

$$\mathcal{L}_{PID}(t) = K_p e(t) + K_i \int_0^t e(\tau) d\tau + K_d \frac{de(t)}{dt}$$

## 3. Formatted Code Blocks

Simply write standard markdown code fences. Smidr automatically detects the language, attaches a glowing tag, and provides an animated **Copy to Clipboard** button:

```rust
// Rust kinematics controller loop
pub fn step_controller(target: f64, current: f64) -> f64 {
    let error = target - current;
    let gain = 1.45;
    gain * error
}
```

Notice that code never line-breaks awkwardly; long lines scroll horizontally without breaking your page layout!

## 4. Callout Boxes & Admonitions

Highlight crucial observations using the `alert` shortcode:

{{< alert type="tip" title="Author Tip" >}}
You can pick between 5 alert styles: `info`, `warning`, `caution`, `tip`, and `robotics`.
{{< /alert >}}

{{< alert type="robotics" title="Robotics Hardware Note" >}}
Ensure motor current sensors are calibrated before closing the loop on real physical hardware.
{{< /alert >}}

## 5. Client-Side WASM Code Runners

Want your readers to experiment with code right on the page? Embed a Pyodide WebAssembly runner:

{{< code-runner lang="python" title="Interactive Python Playground" >}}
# You can edit this code right now and click "Run (WASM)"!
numbers = [1, 2, 3, 4, 5, 6, 7, 8]
squares = [x**2 for x in numbers]
print("Computed squares:", squares)
{{< /code-runner >}}

## 6. Embedded Parameter Sliders

Allow readers to interact with real-time dynamic visualizations:

{{< interactive-widget title="Interactive System Response Tuner" desc="Drag sliders to modify system parameters in real time." >}}

## 7. Secret Text

Hide spoilers, puzzle solutions, or Easter eggs with the `secret` shortcode:

Here is the secret passcode: {{< secret >}}CYBER-FORGE-2026{{< /secret >}}  
*(Hover or select the space above to reveal the payload!)*

## 8. Popover Footnotes

Footnotes in Smidr don't yank readers away to the bottom of the page[^1].

[^1]: Hovering or tapping this note opens a popover right here! No losing your reading position.

## 9. AI Transparency & Translation Badges

Smidr includes built-in metadata badges for disclosing AI involvement and translation origin. Configure your front matter:

```yaml
used_ai: true
original_language: "de"
original_post_path: "/de/posts/meine-notizen/"
ai_model: "Ollama / Llama 3"
```

This renders an automatic provenance banner at the top of the article.

## 10. OpenPGP Cryptographic Identity Verification

Display your public key, fingerprint, and verification instructions with `pgp-card`:

{{< pgp-card name="Jakob / Jokobus" email="jokobus@example.com" keyId="A1B2C3D4E5F67890" fingerprint="ABCD 1234 EF56 7890 ABCD  1234 EF56 7890 ABCD 1234" algo="RSA 4096 / Ed25519" keyUrl="/openpgp/key.asc" >}}
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.1.0

mQGNBGXx... [Your ASCII Armored Key Here] ...
-----END PGP PUBLIC KEY BLOCK-----
{{< /pgp-card >}}

## 11. Asciinema Terminal Replay

Embed interactive CLI recordings without external video overhead:

```markdown
{{</* asciinema id="123456" title="Installing PyTorch with CUDA in Conda" */>}}
```

## 12. Direct File-Based Code Inclusion

Instead of copy-pasting code, reference source files directly from your repository:

```markdown
{{</* code-file source="scripts/train.py" lang="python" title="Training Loop" */>}}
```

