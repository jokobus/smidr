---
title: "Schnellstartanleitung: Verfassen und Veröffentlichen mit Smidr"
date: 2026-03-25T12:00:00Z
draft: false
description: "Vollständige Schritt-für-Schritt-Anleitung und Spickzettel für das Verfassen von Beiträgen mit dem Smidr-Hugo-Theme – ganz ohne KI."
tags: ["guide", "markdown", "quickstart", "hugo"]
categories: ["Tutorials"]
math: true
gardenGraph: true
showBacklinks: true
---

Willkommen bei **Smidr**! Diese Anleitung zeigt, wie einfach es ist, ansprechende technische Artikel mit nativem Markdown und den integrierten Shortcodes von Smidr zu verfassen.

## 1. Neuen Beitrag anlegen

Um einen neuen Beitrag mit vorkonfiguriertem Frontmatter zu erstellen, genügt ein einfacher Befehl im Terminal:

```bash
hugo new posts/mein-neuer-beitrag.md
```

## 2. LaTeX-Mathematik

Smidr bindet clientseitiges KaTeX für blitzschnelles Rendern mathematischer Formeln ein:

- **Im Fließtext**: `$f(x) = \sigma(W x + b)$` wird zu $f(x) = \sigma(W x + b)$.
- **Freigestellt**:

$$\mathcal{L}_{PID}(t) = K_p e(t) + K_i \int_0^t e(\tau) d\tau + K_d \frac{de(t)}{dt}$$

## 3. Code-Blöcke mit Kopierfunktion

Verwende einfache Markdown-Codeblöcke. Smidr erkennt die Sprache automatisch, fügt ein Badge hinzu und bietet einen **Kopieren**-Button:

```rust
// Kinematik-Regler
pub fn step_controller(target: f64, current: f64) -> f64 {
    let error = target - current;
    let gain = 1.45;
    gain * error
}
```

## 4. Hinweisboxen (Admonitions)

{{< alert type="tip" title="Tipp für Autoren" >}}
Es stehen 5 Stile zur Verfügung: `info`, `warning`, `caution`, `tip` und `robotics`.
{{< /alert >}}

## 5. Clientseitige WebAssembly-Codeausführung

{{< code-runner lang="python" title="Interaktive Python-Umgebung" >}}
zahlen = [1, 2, 3, 4, 5, 6, 7, 8]
quadrate = [x**2 for x in zahlen]
print("Berechnete Quadrate:", quadrate)
{{< /code-runner >}}

## 6. Interaktive Schieberegler

{{< interactive-widget title="Interaktiver Systemregler" desc="Bewege die Schieberegler, um das Regelverhalten in Echtzeit zu prüfen." >}}

## 7. Geheimer Text

Geheimer Schlüssel: {{< secret >}}CYBER-FORGE-2026{{< /secret >}}  
*(Mit der Maus markieren oder berühren, um den Inhalt anzuzeigen!)*

## 8. Popover-Fußnoten

Fußnoten springen nicht an das Seitenende[^1].

[^1]: Beim Berühren mit der Maus oder Antippen öffnet sich direkt ein Popover!
