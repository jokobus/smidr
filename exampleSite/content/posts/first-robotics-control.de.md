---
title: "Autonome Quadrotor-Trajektorienoptimierung mit LQR"
date: 2026-03-15T10:00:00Z
draft: false
description: "Optimale Regelungsstrategien für Flugroboter mittels Linear-Quadratischer Regler und vollständiger Zustandsrückführung."
tags: ["robotics", "control-theory", "lqr", "cybernetics"]
categories: ["Ingenieurwesen"]
math: true
gardenGraph: true
showBacklinks: true
---

Der Entwurf von Trajektorienreglern für autonome Flugroboter erfordert eine exakte Balance zwischen Agilität und dynamischer Stabilität. In diesem Beitrag analysieren wir den Linear-Quadratischen Regler (LQR) für ein vereinfachtes Quadrotor-Modell[^1].

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

## Interaktiver Regler-Simulator

Passe die Dämpfung $\zeta$ und die Kreisverstärkung $K_p$ direkt im untenstehenden Systemsimulator an:

{{< interactive-widget title="Sprungantwort eines Systems zweiter Ordnung" desc="Bewege die Schieberegler, um das Einschwingverhalten und Dämpfung in Echtzeit zu beobachten." >}}

## Geheimer Telemetrie-Marker

Hier befindet sich eine verschlüsselte Nachricht:
{{< secret >}}SCHLUESSEL-90812-AUTONOMER-ROVER-STARTBEREIT{{< /secret >}}
*(Dieser Text wird erst sichtbar, wenn du ihn markierst oder mit der Maus darüberfährst!)*

In unserem weiteren Beitrag untersuchen wir [WASM Client-seitige Code-Ausführung](/de/posts/deep-learning-wasm-runners/) für neuronale Netze direkt im Webbrowser!
