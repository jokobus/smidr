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

## 9. KI-Transparenz & Übersetzungshinweise

Smidr enthält integrierte Hinweise zur Kennzeichnung von KI-Unterstützung und Übersetzung:

```yaml
used_ai: true
original_language: "de"
original_post_path: "/de/posts/meine-notizen/"
ai_model: "Ollama / Llama 3"
```

## 10. OpenPGP Kryptografische Identitätsüberprüfung

Zeige deinen öffentlichen PGP-Schlüssel, Fingerabdruck und Download-Button mit `pgp-card`:

{{< pgp-card name="Smidr Engineer" email="engineer@example.org" keyId="A1B2C3D4E5F67890" fingerprint="ABCD 1234 EF56 7890 ABCD  1234 EF56 7890 ABCD 1234" algo="RSA 4096 / Ed25519" keyUrl="/openpgp/key.asc" >}}
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.1.0

mQGNBGXx... [ASCII Armored Key hier einfügen] ...
-----END PGP PUBLIC KEY BLOCK-----
{{< /pgp-card >}}

## 11. Asciinema Terminal-Wiedergabe

Interaktive Terminalaufzeichnungen ohne Videoballast einbetten:

```markdown
{{</* asciinema id="123456" title="Installation von PyTorch mit CUDA" */>}}
```

## 12. Direkte Code-Dateieinbindung

Statt Code per Copy-Paste einzufügen, binde Quelldateien direkt ein:

```markdown
{{</* code-file source="scripts/train.py" lang="python" title="Trainingsschleife" */>}}
```

## 13. Interaktive 3D-Lernkarten (Flashcards)

Fessle Leser mit responsiven Lernkarten in voller Textbreite, die bei Klick oder Berührung mit einer 3D-Drehanimation die Rückseite enthüllen:

{{< flashcard front="Was besagt das Abtasttheorem von Shannon-Nyquist?" hint="Klicken zum Wenden" >}}
Ein kontinuierliches Signal kann vollständig rekonstruiert werden, wenn die Abtastfrequenz mehr als doppelt so hoch wie die höchste Signalfrequenz ist: $f_s > 2 B$.
{{< /flashcard >}}

## 14. Aufklappbare Balken (Accordions / Details)

Halte Beiträge übersichtlich und verstecke lange Ableitungen, technische Details oder Lösungen unter horizontalen, einklappbaren Leisten:

{{< collapse title="Klicken für mathematische Herleitung" open="false" >}}
Ausgehend von den Euler-Lagrange-Bewegungsgleichungen:
$$\frac{d}{dt}\left(\frac{\partial \mathcal{L}}{\partial \dot{q}_i}\right) - \frac{\partial \mathcal{L}}{\partial q_i} = Q_i$$
kann das erforderliche Gelenkmoment direkt berechnet werden.
{{< /collapse >}}

