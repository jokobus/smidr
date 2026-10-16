---
title: "Interactive Planar Arm Kinematics & WebAssembly Simulation"
date: 2026-04-10T14:30:00Z
draft: false
description: "Derive 2-DOF planar robot manipulator kinematics with KaTeX equations, TikZ diagrams, in-browser WebAssembly Python execution, and live parameter tuning."
tags: ["robotics", "kinematics", "python", "wasm", "simulation"]
categories: ["Robotics"]
toc: true
math: true
tikz: true
gardenGraph: true
showBacklinks: true
comments: true
used_ai: false
---

Robotic manipulators transform actuator joint angles into spatial tool coordinates. In this interactive guide, we analyze the forward kinematics of a two-link planar robotic manipulator using mathematical derivations, vector diagrams, and **real-time in-browser code execution**.

## 1. Mathematical Formulation

Consider a two-link planar arm with joint angles $\theta_1, \theta_2$ and link lengths $l_1, l_2$. The Cartesian coordinates $(x_1, y_1)$ of the elbow joint and $(x_{ee}, y_{ee})$ of the end-effector are governed by trigonometric projection:

$$\begin{aligned}
x_1 &= l_1 \cos(\theta_1) \\
y_1 &= l_1 \sin(\theta_1) \\
x_{ee} &= l_1 \cos(\theta_1) + l_2 \cos(\theta_1 + \theta_2) \\
y_{ee} &= l_1 \sin(\theta_1) + l_2 \sin(\theta_1 + \theta_2)
\end{aligned}$$

As established by John J. Craig in his foundational robotics treatise {{< cite "craig2005" >}}, representing these geometric transforms as homogeneous matrices provides computational uniformity for higher degrees of freedom.

## 2. Kinematic Linkage Diagram (TikZ)

The following schematic is rendered entirely client-side using WebAssembly TeX (TikzJax):

{{< tikz caption="2-DOF Planar Robot Kinematics Schematic" >}}
\begin{tikzpicture}[scale=1.5, >=stealth, line width=1.2pt]
  % Origin & Base
  \fill[cyan] (0,0) circle (3pt) node[below left, text=cyan] {$O (0,0)$};
  \draw[thick, dashed, gray] (0,0) -- (2.5,0) node[right, text=gray] {$X$};
  \draw[thick, dashed, gray] (0,0) -- (0,2.5) node[above, text=gray] {$Y$};

  % Link 1
  \draw[line width=3pt, cyan] (0,0) -- (1.5,1.5);
  \fill[magenta] (1.5,1.5) circle (3pt) node[above left, text=magenta] {$J_1 (x_1, y_1)$};
  \draw[->, cyan, line width=1pt] (0.6,0) arc (0:45:0.6) node[midway, right=2pt, text=cyan] {$\theta_1$};
  \node[above left, text=cyan] at (0.75,0.75) {$l_1$};

  % Link 2
  \draw[thick, dashed, gray] (1.5,1.5) -- (2.7,2.7);
  \draw[line width=3pt, magenta] (1.5,1.5) -- (2.7,1.8);
  \fill[yellow] (2.7,1.8) circle (4pt) node[right, text=yellow] {$EE (x_{ee}, y_{ee})$};
  \draw[->, magenta, line width=1pt] (2.0,2.0) arc (45:14:0.7) node[midway, right=2pt, text=magenta] {$\theta_2$};
  \node[above, text=magenta] at (2.1,1.75) {$l_2$};
\end{tikzpicture}
{{< /tikz >}}

## 3. Interactive WebAssembly Python Playground

You can modify the joint angles and link lengths in the sandbox below. Click **Run (WASM)** to compute the end-effector position inside your browser—no backend server computation or cloud latency required!

{{< code-runner lang="python" title="Planar Kinematics Solver (Pyodide WASM)" >}}
import math

def forward_kinematics(theta1_deg, theta2_deg, l1=1.0, l2=0.8):
    t1 = math.radians(theta1_deg)
    t2 = math.radians(theta2_deg)
    
    x1 = l1 * math.cos(t1)
    y1 = l1 * math.sin(t1)
    
    x_ee = x1 + l2 * math.cos(t1 + t2)
    y_ee = y1 + l2 * math.sin(t1 + t2)
    
    return (x1, y1), (x_ee, y_ee)

# Try tweaking these angles!
elbow, ee = forward_kinematics(theta1_deg=45.0, theta2_deg=30.0)

print("=== Forward Kinematics Telemetry ===")
print(f"Elbow Joint:  x = {elbow[0]:.4f} m, y = {elbow[1]:.4f} m")
print(f"End-Effector: x = {ee[0]:.4f} m, y = {ee[1]:.4f} m")
print(f"Reach Radius: R = {math.sqrt(ee[0]**2 + ee[1]**2):.4f} m")
{{< /code-runner >}}

## 4. Including Standalone Source Files

Rather than copy-pasting code into Markdown, Smidr allows referencing clean production scripts directly from your repository using `code-file`:

{{< code-file source="static/scripts/kinematics.py" lang="python" title="kinematics.py" >}}

{{< alert type="tip" title="Clean Code Maintenance" >}}
By storing algorithms in standalone scripts, your CI test runners can validate your Python code on every commit while your blog renders the exact same file automatically!
{{< /alert >}}

## 5. Real-Time Parameter Response Tuner

Test closed-loop trajectory tracking response under variable damping ratios and natural frequencies:

{{< interactive-widget title="Robotic Trajectory Response Tuner" desc="Adjust velocity gain and damping to observe step response oscillations." >}}

## 6. Support Open Science & Robotics Research

{{< sponsor title="Support the Autonomous Systems Lab" text="Our open-source robotics research, simulators, and tutorials are freely published under MIT. Support our ongoing hardware benchmarks and educational tools." link="https://github.com/sponsors" button="Sponsor on GitHub 💜" >}}

---

## 7. References & Bibliography

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
