---
title: "Interaktive Arm-Kinematik & WebAssembly-Simulation"
date: 2026-04-10T14:30:00Z
draft: false
description: "Herleitung der Vorwärtskinematik für planare 2-DOF-Roboterarme mit KaTeX, TikZ-Vektordiagrammen, WebAssembly-Codeausführung und Echtzeit-Parameteranpassung."
tags: ["robotics", "kinematik", "python", "wasm", "simulation"]
categories: ["Robotik"]
toc: true
math: true
tikz: true
gardenGraph: true
showBacklinks: true
comments: true
used_ai: false
---

Roboter-Manipulatoren transformieren Gelenkwinkel in räumliche Werkzeugkoordinaten. In dieser interaktiven Anleitung analysieren wir die Vorwärtskinematik eines zweigliedrigen planaren Roboterarms anhand mathematischer Herleitungen, Vektordiagrammen und **Echtzeit-Codeausführung im Browser**.

## 1. Mathematische Formulierung

Betrachten wir einen planaren Roboterarm mit den Gelenkwinkeln $\theta_1, \theta_2$ und den Armlängen $l_1, l_2$. Die kartesischen Koordinaten $(x_1, y_1)$ des Ellbogengelenks und $(x_{ee}, y_{ee})$ des Endeffektors ergeben sich trigonometrisch:

$$\begin{aligned}
x_1 &= l_1 \cos(\theta_1) \\
y_1 &= l_1 \sin(\theta_1) \\
x_{ee} &= l_1 \cos(\theta_1) + l_2 \cos(\theta_1 + \theta_2) \\
y_{ee} &= l_1 \sin(\theta_1) + l_2 \sin(\theta_1 + \theta_2)
\end{aligned}$$

Wie von John J. Craig in seinem Standardwerk {{< cite "craig2005" >}} beschrieben, bildet die Darstellung über homogene Transformationsmatrizen das Fundament für Manipulatoren mit höheren Freiheitsgraden.

## 2. Kinematische Skizze (TikZ)

Das folgende Schema wird vollständig clientseitig im Browser mittels WebAssembly-TeX (TikzJax) gerendert:

{{< tikz caption="2-DOF Planarer Roboterarm Kinematik-Schema" >}}
\begin{tikzpicture}[scale=1.5, >=stealth, line width=1.2pt]
  % Basis
  \fill[cyan] (0,0) circle (3pt) node[below left, text=cyan] {$O (0,0)$};
  \draw[thick, dashed, gray] (0,0) -- (2.5,0) node[right, text=gray] {$X$};
  \draw[thick, dashed, gray] (0,0) -- (0,2.5) node[above, text=gray] {$Y$};

  % Glied 1
  \draw[line width=3pt, cyan] (0,0) -- (1.5,1.5);
  \fill[magenta] (1.5,1.5) circle (3pt) node[above left, text=magenta] {$J_1 (x_1, y_1)$};
  \draw[->, cyan, line width=1pt] (0.6,0) arc (0:45:0.6) node[midway, right=2pt, text=cyan] {$\theta_1$};
  \node[above left, text=cyan] at (0.75,0.75) {$l_1$};

  % Glied 2
  \draw[thick, dashed, gray] (1.5,1.5) -- (2.7,2.7);
  \draw[line width=3pt, magenta] (1.5,1.5) -- (2.7,1.8);
  \fill[yellow] (2.7,1.8) circle (4pt) node[right, text=yellow] {$EE (x_{ee}, y_{ee})$};
  \draw[->, magenta, line width=1pt] (2.0,2.0) arc (45:14:0.7) node[midway, right=2pt, text=magenta] {$\theta_2$};
  \node[above, text=magenta] at (2.1,1.75) {$l_2$};
\end{tikzpicture}
{{< /tikz >}}

## 3. Interaktive WebAssembly-Python-Umgebung

Du kannst die Winkel und Längen im folgenden Sandkasten direkt verändern. Klicke auf **Run (WASM)**, um die Position live im Browser zu berechnen:

{{< code-runner lang="python" title="Planarer Kinematik-Rechner (Pyodide WASM)" >}}
import math

def vorwaertskinematik(theta1_deg, theta2_deg, l1=1.0, l2=0.8):
    t1 = math.radians(theta1_deg)
    t2 = math.radians(theta2_deg)
    
    x1 = l1 * math.cos(t1)
    y1 = l1 * math.sin(t1)
    
    x_ee = x1 + l2 * math.cos(t1 + t2)
    y_ee = y1 + l2 * math.sin(t1 + t2)
    
    return (x1, y1), (x_ee, y_ee)

# Probiere andere Winkel aus!
gelenk, ee = vorwaertskinematik(theta1_deg=45.0, theta2_deg=30.0)

print("=== Kinematik-Telemetrie ===")
print(f"Ellbogengelenk: x = {gelenk[0]:.4f} m, y = {gelenk[1]:.4f} m")
print(f"Endeffektor:    x = {ee[0]:.4f} m, y = {ee[1]:.4f} m")
print(f"Reichweite:     R = {math.sqrt(ee[0]**2 + ee[1]**2):.4f} m")
{{< /code-runner >}}

## 4. Direkte Einbindung von Quellcodedateien

Mit `code-file` kannst du Quelldateien direkt aus deinem Repository einbinden:

{{< code-file source="static/scripts/kinematics.py" lang="python" title="kinematics.py" >}}

## 5. Echtzeit-Parameterregler

{{< interactive-widget title="Robotik-Trajektorien-Regler" desc="Passe Geschwindigkeitsverstärkung und Dämpfung an, um das Einschwingverhalten zu testen." >}}

## 6. Forschung & Open-Source unterstützen

{{< sponsor title="Das autonome Forschungslabor unterstützen" text="Unsere Open-Source-Robotik-Tutorials und Simulationen werden frei unter MIT veröffentlicht. Unterstütze die kontinuierliche Weiterentwicklung auf GitHub Sponsors." link="https://github.com/sponsors" button="Auf GitHub unterstützen 💜" >}}

---

## 7. Literaturverzeichnis

{{< bibliography >}}
@book{craig2005,
  title = {Introduction to Robotics: Mechanics and Control},
  author = {Craig, John J.},
  edition = {3rd},
  year = {2005},
  publisher = {Pearson Prentice Hall}
}
@article{siciliano2009,
  title = {Robotics: Modelling, Planning and Control},
  author = {Siciliano, Bruno and Sciavicco, Lorenzo and Villani, Luigi and Oriolo, Giuseppe},
  year = {2009},
  publisher = {Springer}
}
{{< /bibliography >}}
