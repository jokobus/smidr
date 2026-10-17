---
title: "Schnellstartanleitung: Verfassen und Veröffentlichen mit Smidr"
date: 2026-03-25T12:00:00Z
draft: false
description: "Vollständige Übersicht und interaktiver Leitfaden über alle Kernfunktionen, Shortcodes und technischen Features des Smidr-Hugo-Themes."
tags: ["guide", "markdown", "quickstart", "hugo", "features"]
categories: ["Tutorials"]
math: true
gardenGraph: true
showBacklinks: true
---

Willkommen bei **Smidr** – einem blitzschnellen, responsiven und modularen Hugo-Theme für Forschende, Robotiker, Softwareentwickler und technische Autoren. Dieser Leitfaden bietet einen interaktiven Rundgang sowie praxiserprobte Code-Vorlagen für alle integrierten Funktionen.

---

## 1. Beiträge & Page Bundles erstellen

Neue Beiträge werden bequem über das Hugo-CLI angelegt:

```bash
hugo new posts/autonome-navigation/index.de.md
```

Durch die Verwendung von Seitenbündeln (Page Bundles wie `ordner/index.de.md` und `ordner/index.en.md`) bleiben Bilder, Skripte und zugehörige `.bib`-Bibliografiedateien sauber im selben Verzeichnis organisiert.

---

## 2. Dynamischer, mehrsprachiger Hero-Bereich

Smidr unterstützt vollständige Internationalisierung für Deutsch und Englisch. Header-Badge, Untertitel und Beschreibung auf der Startseite lassen sich pro Sprache in der `hugo.yaml` flexibel anpassen:

```yaml
languages:
  de:
    title: "Jokobus"
    params:
      hero_badge: "ROBOTIK &bull; EMBEDDED SYSTEMS &bull; ANGEWANDTE KI"
      subtitle: "Praxisnotizen zu Robotik, Embedded Systems & angewandter KI"
      description: "Praxiserprobte Einblicke, interaktiver Code und technische Notizen."
  en:
    title: "Jokobus"
    params:
      hero_badge: "ROBOTICS &bull; EMBEDDED SYSTEMS &bull; APPLIED AI"
      subtitle: "Exploring Robotics, Embedded Systems & Applied Machine Learning"
      description: "Field notes, interactive code, and technical deep-dives into modern engineering."
```

Werden keine Parameter angegeben, greift Smidr automatisch auf lokalisierte Standardwerte zurück.

---

## 3. LaTeX-Mathematik (KaTeX)

Smidr integriert clientseitiges KaTeX für verzögerungsfreies Setzen mathematischer Formeln:

- **Im Fließtext:** Einfache Dollarzeichen `$f(x) = \sigma(W x + b)$` ergeben $f(x) = \sigma(W x + b)$.
- **Abgesetzte Gleichungen:** Doppelte Dollarzeichen `$$...$$`:

$$\mathcal{L}_{PID}(t) = K_p e(t) + K_i \int_0^t e(\tau) d\tau + K_d \frac{de(t)}{dt}$$

---

## 4. Code-Blöcke mit Kopierfunktion

Markdown-Codeblöcke werden automatisch mit Syntax-Highlighting, Sprach-Badge, horizontalem Scrolling und einem animierten **Kopieren**-Button versehen:

```rust
// Kinematik-Regler
pub fn step_controller(target: f64, current: f64) -> f64 {
    let error = target - current;
    let gain = 1.45;
    gain * error
}
```

---

## 5. Hinweisboxen (Admonitions & Alerts)

Hebe wichtige Erkenntnisse, Hardware-Hinweise oder Sicherheitshinweise mit dem `alert`-Shortcode (oder den Kürzeln `tip`, `note`, `warning`, `caution`, `info`, `robotics`) hervor:

{{< alert type="tip" title="Praxis-Tipp" >}}
Es stehen 6 Design-Varianten zur Verfügung: `info`, `note`, `tip`, `warning`, `caution` und `robotics`.
{{< /alert >}}

{{< alert type="robotics" title="Sicherheitshinweis Robotik" >}}
Vor Aktivierung von Motor-Endstufen oder Drehmomentregelung stets Hardware-Not-Aus-Schalter auf Funktion prüfen.
{{< /alert >}}

---

## 6. Clientseitige WebAssembly-Codeausführung

Ermögliche deinen Lesern, Algorithmen direkt im Browser ohne Backend-Server interaktiv auszuführen (basiert auf Pyodide WebAssembly):

{{< code-runner lang="python" title="Interaktiver Python-Spielplatz" >}}
import math

winkel_grad = [0, 30, 45, 60, 90]
rad = [math.radians(deg) for deg in winkel_grad]
sinus = [round(math.sin(r), 4) for r in rad]

print("Winkel (Grad):", winkel_grad)
print("Sinuswerte   :", sinus)
{{< /code-runner >}}

---

## 7. Interaktive Schieberegler & Visualisierungen

Binde interaktive HTML5-Canvas-Komponenten mit Echtzeit-Schiebereglern ein, um dynamische Systeme und Reglerparameter erfahrbar zu machen:

{{< interactive-widget title="Interaktiver Systemregler" desc="Verändere Dämpfung und Eigenfrequenz über die Schieberegler, um die Sprungantwort in Echtzeit zu beobachten." >}}

---

## 8. Interaktive 3D-Lernkarten (Flashcards)

Fessle Leser mit responsiven Karteikarten in voller Textbreite, die sich bei Klick oder Antippen mit einer flüssigen 3D-Drehung wenden:

{{< flashcard front="Was besagt das Abtasttheorem von Shannon-Nyquist?" hint="Klicken zum Wenden" >}}
**Antwort:**  
Ein kontinuierliches, bandbegrenztes Signal kann aus seinen diskreten Abtastwerten exakt rekonstruiert werden, wenn die Abtastfrequenz mehr als doppelt so hoch ist wie die Maximalfrequenz:  
$$f_s > 2 B$$
{{< /flashcard >}}

---

## 9. Einklappbare Balken (Accordions & Details)

Halte mathematische Herleitungen, Beweise oder zusätzliche Vertiefungen übersichtlich unter horizontalen Klickbalken verborgen (Aliase: `collapse`, `details`, `accordion`, `spoiler`):

{{< collapse title="Klicken für die Euler-Lagrange-Herleitung" open="false" >}}
Ausgehend vom Hamiltonschen Prinzip der kleinsten Wirkung $\delta S = 0$ mit der Lagrange-Funktion $\mathcal{L} = T - V$:

$$\frac{d}{dt}\left(\frac{\partial \mathcal{L}}{\partial \dot{q}_i}\right) - \frac{\partial \mathcal{L}}{\partial q_i} = Q_i$$

Hierbei beschreiben verallgemeinerte Koordinaten $q_i$ und generalisierte Kräfte $Q_i$ die Dynamik mehrgliedriger Roboterkinematiken.
{{< /collapse >}}

---

## 10. Akademische Zitationen & BibTeX-Engine

Smidr besitzt eine integrierte Literatur-Engine für `.bib`-Dateien und Inline-BibTeX:

1. **Automatisches Laden:** Lege eine `references.bib` neben deine Beitragsdatei. Smidr liest und verarbeitet sie automatisch.
2. **Im Text zitieren:** Setze Zitate mit `{{</* cite "key" */>}}` oder `{{</* cite "key1,key2" */>}}`.
3. **Vorschau-Popovers:** Beim Bewegen der Maus über ein Zitat erscheint eine Karte mit Autoren, Titel, Zeitschrift und Jahr.
4. **Zitierstile:** Konfigurierbar in `params.yaml` oder Frontmatter:
   - `numeric`: `[1]`
   - `author-year`: `(Kalman, 1960)`
   - `alphanumeric`: `[Kal60]`
5. **BibTeX-Export:** Jeder Eintrag enthält einen **BibTeX kopieren**-Button und direkte DOI-/Weblinks.

### Zitat- und Literatur-Beispiel:

Wie in Kalmans grundlegender Arbeit {{< cite "kalman1960" >}} und der modernen Regelungstheorie {{< cite "astrom2010" >}} gezeigt, minimiert der Zustandsschätzer die Fehlervarianz optimal.

{{< bibliography title="Literaturverzeichnis & Zitate" >}}
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

## 11. Interaktiver Wissensgraph (Digital Garden)

Mache Querverbindungen sichtbar! Mit `gardenGraph: true` rendert Smidr einen physikbasierten 2D-Netzwerkgraphen. Leser können zoomen, Knoten verschieben und durch Anklicken direkt zu verwandten Artikeln und Themen navigieren.

---

## 12. Kontextuelle Rückverweise (Backlinks)

Mit `showBacklinks: true` erkennt Smidr automatisch eingehende Links aus anderen Beiträgen deines Blogs und zeigt sie übersichtlich an.

---

## 13. Popover-Fußnoten

Klassische Markdown-Fußnoten reißen Leser nicht aus dem Lesefluss[^1].

[^1]: Das Berühren oder Antippen öffnet eine Vorschau an Ort und Stelle. Das Anklicken der Sprungmarke scrollt sanft mit Sichtabstand zur Zeile.

---

## 14. Befehlspalette & Sofortsuche (Fuzzy Search)

Drücke **`Strg` + `K`** (oder **`Cmd` + `K`** auf macOS) oder klicke auf die Suchschaltfläche. Das Suchfenster durchsucht Titel, Absätze, Tags und Kategorien blitzschnell in Echtzeit.

---

## 15. OpenPGP Kryptografische Identitätsprüfung

Präsentiere deinen öffentlichen PGP-Schlüssel, Fingerabdruck und Download-Button mit `pgp-card`:

{{< pgp-card name="Smidr Core Engineer" email="engineer@example.org" keyId="A1B2C3D4E5F67890" fingerprint="ABCD 1234 EF56 7890 ABCD  1234 EF56 7890 ABCD 1234" algo="RSA 4096 / Ed25519" keyUrl="/openpgp/key.asc" >}}
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.1.0

mQGNBGXx... [ASCII Armored Key hier einfügen] ...
-----END PGP PUBLIC KEY BLOCK-----
{{< /pgp-card >}}

---

## 16. Vektorbasierte TikZ-Schaltpläne

Rendere wissenschaftliche TikZ-Vektordiagramme direkt im Webbrowser:

```markdown
{{</* tikz caption="Regelkreis-Blockdiagramm." */>}}
\begin{tikzpicture}[auto, node distance=2cm, >=latex]
  \node [input, name=input] {};
  \node [sum, right of=input] (sum) {};
  \node [block, right of=sum] (controller) {Regler};
  \draw [->] (input) -- node {$w(t)$} (sum);
  \draw [->] (sum) -- node {$e(t)$} (controller);
\end{tikzpicture}
{{</* /tikz */>}}
```

---

## 17. Asciinema Terminal-Wiedergabe & Datei-Einbindung

- **Terminalaufzeichnungen:** Binde interaktive CLI-Sessions ohne Videodateien ein:
  ```markdown
  {{</* asciinema id="123456" title="Smidr Deployment mit Hugo" */>}}
  ```
- **Externe Quellcode-Dateien:** Verweise direkt auf Projektdateien im Repository:
  ```markdown
  {{</* code-file source="scripts/controller.py" lang="python" title="Regler-Implementierung" */>}}
  ```

---

## 18. Geheimer Text & Spoiler

Verberge Lösungen oder Passwörter mit dem `secret`-Shortcode:

Verifikationstoken: {{< secret >}}CYBER-SMIDR-2026{{< /secret >}} *(Markieren oder Berühren zum Anzeigen)*

---

## 19. KI-Transparenz & Provenienz-Hinweise

Kennzeichne KI-Unterstützung transparent im Frontmatter:

```yaml
used_ai: true
original_language: "de"
original_post_path: "/de/posts/mein-original/"
ai_model: "Claude 3.7 / Ollama"
```

Smidr blendet daraufhin automatisch ein informatives Banner ein.
