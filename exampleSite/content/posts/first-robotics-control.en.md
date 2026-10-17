---
title: "Autonomous Quadrotor Trajectory Optimization with LQR"
date: 2026-03-15T10:00:00Z
draft: false
description: "Formulating optimal control policies for multi-rotor aerial robotics using linear quadratic regulators and full state feedback."
tags: ["robotics", "control-theory", "lqr", "cybernetics"]
categories: ["Engineering"]
math: true
tikz: true
gardenGraph: true
showBacklinks: true
---

Designing trajectory controllers for autonomous aerial robotics requires balancing agile maneuverability with dynamic stability. As established in foundational optimal estimation theory by Kalman {{< cite "kalman1960" >}} and classical feedback principles {{< cite "astrom2010" >}}, we formulate a linear quadratic regulator (LQR) for a 6-DOF multi-rotor system[^1].

[^1]: Modern aerial robotics relies heavily on linearized inertial dynamics around hover states before scaling to non-linear MPC.

## Mathematical Formulation

The linearized continuous-time error dynamics around the hover equilibrium point are expressed via state-space representation:

$$\dot{x}(t) = A x(t) + B u(t)$$

where the state vector $x \in \mathbb{R}^{12}$ represents position, velocities, Euler angles, and body angular rates:

$$x = \begin{bmatrix} p_x & p_y & p_z & \dot{p}_x & \dot{p}_y & \dot{p}_z & \phi & \theta & \psi & p & q & r \end{bmatrix}^T$$

The optimal control law minimizes the infinite-horizon quadratic performance index:

$$J = \int_{0}^{\infty} \left( x^T Q x + u^T R u \right) dt$$

The continuous algebraic Riccati equation (CARE) is solved to compute the feedback gain matrix $K$:

$$A^T P + P A - P B R^{-1} B^T P + Q = 0 \implies u(t) = -K x(t) = -R^{-1} B^T P x(t)$$

{{< alert type="robotics" title="Actuator Saturation Warning" >}}
Rotational motor velocities are physically bounded by maximum ESC voltage. Saturation $u_{max}$ must be handled with anti-windup clamping to prevent destabilizing non-linear limit cycles.
{{< /alert >}}

## Control Architecture (Vector TikZ Diagram)

Below is the closed-loop feedback architecture rendered in vectorized SVG directly in your browser using **TikZ WebAssembly**:

{{< tikz caption="Closed-loop quadrotor state feedback control block diagram." >}}
\begin{tikzpicture}[auto, node distance=2cm, >=latex]
  \draw[rounded corners, fill=cyan!10, draw=cyan!80, line width=1pt] (0,0) rectangle (2.5,1.2) node[pos=.5] {\textbf{Controller} $K$};
  \draw[rounded corners, fill=purple!10, draw=purple!80, line width=1pt] (4.5,0) rectangle (7.0,1.2) node[pos=.5] {\textbf{Quadrotor} $G(s)$};
  \draw[->, line width=1pt] (-1.5,0.6) -- node[above] {$r(t)$} (0,0.6);
  \draw[->, line width=1pt] (2.5,0.6) -- node[above] {$u(t)$} (4.5,0.6);
  \draw[->, line width=1pt] (7.0,0.6) -- node[above] {$x(t)$} (9.0,0.6);
  \draw[->, line width=1pt] (8.0,0.6) -- (8.0,-0.8) -- (-0.8,-0.8) -- (-0.8,0.3) -- (0,0.3);
\end{tikzpicture}
{{< /tikz >}}

## Interactive Control Tuner

You can adjust the damping ratio $\zeta$ and proportional gain $K_p$ in the live system simulator below to observe the pole placement and step response settling time:

{{< interactive-widget title="Second-Order Closed-Loop Step Response" desc="Drag the sliders below to witness closed-loop damping and transient oscillations in real time." >}}

## Secret Telemetry Flag

Here is an encrypted debug marker embedded in this dispatch:
{{< secret >}}KEY-90812-AUTONOMOUS-ROVER-DEPLOYED{{< /secret >}}
*(Notice how the text above is invisible until you highlight or hover it with your mouse cursor!)*

## Code Implementation (Python / NumPy)

Below is the state-space feedback loop computation with syntax highlighting, horizontal scrolling, and a copy button:

```python
import numpy as np
import scipy.linalg

def compute_lqr_gain(A: np.ndarray, B: np.ndarray, Q: np.ndarray, R: np.ndarray):
    """Solve Continuous Algebraic Riccati Equation (CARE) and return gain K."""
    P = scipy.linalg.solve_continuous_are(A, B, Q, R)
    K = np.linalg.inv(R) @ (B.T @ P)
    return K, P

# Hover linearized system matrices
A = np.zeros((12, 12))
A[0:3, 3:6] = np.eye(3)
B = np.zeros((12, 4))
B[5, :] = 1.0 / 1.25 # Mass normalized thrust

Q = np.diag([10, 10, 20, 1, 1, 2, 5, 5, 5, 0.1, 0.1, 0.1])
R = np.eye(4) * 0.1

K, P = compute_lqr_gain(A, B, Q, R)
print("Optimal LQR Gain Shape:", K.shape)
```

In our companion article, we expand on [WASM Client-side Execution](/posts/deep-learning-wasm-runners/) to evaluate neural network controllers directly in the browser!

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
