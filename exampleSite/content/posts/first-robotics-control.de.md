---
title: "Autonome Quadrotor-Trajektorienoptimierung mit LQR"
date: 2026-03-15T10:00:00Z
draft: false
description: "Optimale Regelungsstrategien für Flugroboter mittels Linear-Quadratischer Regler und vollständiger Zustandsrückführung."
tags: ["robotics", "control-theory", "lqr", "cybernetics"]
categories: ["Ingenieurwesen"]
math: true
tikz: true
gardenGraph: true
showBacklinks: true
---

Der Entwurf von Trajektorienreglern für autonome Flugroboter erfordert eine exakte Balance zwischen Agilität und dynamischer Stabilität. Aufbauend auf den Grundlagen der Zustandsschätzung von Kalman {{< cite "kalman1960" >}} und der klassischen Regelungstheorie {{< cite "astrom2010" >}} formulieren wir einen Linear-Quadratischen Regler (LQR)[^1].

[^1]: Die moderne Flugrobotik stützt sich auf linearisierte Trägheitsdynamiken um den Schwebepunkt herum.

## Mathematische Formulierung

Die linearisierte kontinuierliche Fehlerdynamik um den Schwebepunkt wird im Zustandsraum beschrieben:

$$\dot{x}(t) = A x(t) + B u(t)$$

wobei der Zustandsvektor $x \in \mathbb{R}^{12}$ Position, Geschwindigkeiten und Euler-Winkel abbildet:

$$x = \begin{bmatrix} p_x & p_y & p_z & \dot{p}_x & \dot{p}_y & \dot{p}_z & \phi & \theta & \psi & p & q & r \end{bmatrix}^T$$

Das quadratische Gütekriterium lautet:

$$J = \int_{0}^{\infty} \left( x^T Q x + u^T R u \right) dt$$

Die algebraische Riccati-Gleichung (CARE) liefert die Rückführmatrix $K$:

$$A^T P + P A - P B R^{-1} B^T P + Q = 0 \implies u(t) = -K x(t)$$

{{< alert type="robotics" title="Aktor-Sättigungswarnung" >}}
Die Drehzahlen der Antriebe sind durch die maximale ESC-Spannung physikalisch begrenzt. Anti-Windup-Schutz ist unerlässlich.
{{< /alert >}}

## Regelungsarchitektur (Vektorielles TikZ-Diagramm)

Hier ist das Blockschaltbild des Regelkreises, direkt im Browser mittels **TikZ WebAssembly** kompiliert:

{{< tikz caption="Zustandsrückführung des Quadrotors als TikZ-Blockschaltbild." >}}
\begin{tikzpicture}[auto, node distance=2cm, >=latex]
  \draw[rounded corners, fill=cyan!10, draw=cyan!80, line width=1pt] (0,0) rectangle (2.5,1.2) node[pos=.5] {\textbf{Regler} $K$};
  \draw[rounded corners, fill=purple!10, draw=purple!80, line width=1pt] (4.5,0) rectangle (7.0,1.2) node[pos=.5] {\textbf{Quadrotor} $G(s)$};
  \draw[->, line width=1pt] (-1.5,0.6) -- node[above] {$r(t)$} (0,0.6);
  \draw[->, line width=1pt] (2.5,0.6) -- node[above] {$u(t)$} (4.5,0.6);
  \draw[->, line width=1pt] (7.0,0.6) -- node[above] {$x(t)$} (9.0,0.6);
  \draw[->, line width=1pt] (8.0,0.6) -- (8.0,-0.8) -- (-0.8,-0.8) -- (-0.8,0.3) -- (0,0.3);
\end{tikzpicture}
{{< /tikz >}}

## Interaktiver Regler-Simulator

Passe die Dämpfung $\zeta$ und die Kreisverstärkung $K_p$ direkt im untenstehenden Systemsimulator an:

{{< interactive-widget title="Sprungantwort eines Systems zweiter Ordnung" desc="Bewege die Schieberegler, um das Einschwingverhalten und Dämpfung in Echtzeit zu beobachten." >}}

## Geheimer Telemetrie-Marker

Hier befindet sich eine verschlüsselte Nachricht:
{{< secret >}}SCHLUESSEL-90812-AUTONOMER-ROVER-STARTBEREIT{{< /secret >}}
*(Dieser Text wird erst sichtbar, wenn du ihn markierst oder mit der Maus darüberfährst!)*

In unserem weiteren Beitrag untersuchen wir [WASM Client-seitige Code-Ausführung](/de/posts/deep-learning-wasm-runners/) für neuronale Netze direkt im Webbrowser!

{{< bibliography title="Literaturverzeichnis & Referenzen" >}}
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
