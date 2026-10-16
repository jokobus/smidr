---
title: "Interaktive browserbasierte Code-Ausführung mit WebAssembly"
date: 2026-03-20T14:30:00Z
draft: false
description: "Ausführung von sandboxed Python- und JavaScript-Berechnungen direkt im Browser der Leser dank WebAssembly – null Serverlast auf dem Raspberry Pi."
tags: ["machine-learning", "wasm", "python", "pyodide", "cybernetics"]
categories: ["Machine Learning"]
math: true
gardenGraph: true
showBacklinks: true
---

Eine der spannendsten Neuerungen für technische Blogs ist die Möglichkeit für Leser, Parameter direkt im Artikel zu verändern und Algorithmen im Browser zu starten.

In diesem Beitrag zeigen wir, wie Smidr **WebAssembly (Pyodide)** nutzt, um Code ausschließlich im lokalen Browser des Lesers auszuführen.

{{< alert type="tip" title="Server-Sicherheits- und Stabilitätsgarantie" >}}
Da diese statische Website auf einem Raspberry Pi (oder GitHub Pages) gehostet wird, wird **zu keinem Zeitpunkt Code an den Server gesendet oder dort ausgeführt**.
Alle Skripte laufen in einer isolierten WebAssembly-Sandbox im Browser. Endlosschleifen belasten nur den lokalen Browser-Tab und können niemals den Server überlasten.
{{< /alert >}}

## Live-Python-Sandbox (Pyodide WASM)

Probiere den Vorwärtslauf des künstlichen Neurons unten aus. Ein Klick auf **Run (WASM)** lädt Pyodide und führt den Code direkt auf deinem Gerät aus:

{{< code-runner lang="python" title="Pyodide Forward Pass Sandbox" >}}
import math

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

weights = [0.75, -0.42, 1.15]
inputs  = [1.2, 0.5, -0.8]
bias    = 0.15

z = sum(w * i for w, i in zip(weights, inputs)) + bias
activation = sigmoid(z)

print(f"Logit (z): {z:.4f}")
print(f"Aktivierung: {activation:.4f}")
{{< /code-runner >}}

## Digital-Garden-Verknüpfung

Dieser Beitrag verweist direkt auf unseren Artikel [Autonome Quadrotor-Trajektorienoptimierung mit LQR](/de/posts/first-robotics-control/). Der Wissensgraph unten spiegelt dies wider!
