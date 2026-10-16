---
title: "Interactive Client-Side Code Runners with WebAssembly"
date: 2026-03-20T14:30:00Z
draft: false
description: "Running sandboxed Python and JavaScript computations directly in the reader's browser with WebAssembly—zero server load on Raspberry Pi or static hosting."
tags: ["machine-learning", "wasm", "python", "pyodide", "cybernetics"]
categories: ["Machine Learning"]
math: true
gardenGraph: true
showBacklinks: true
---

One of the defining innovations of modern technical blogging is allowing readers to tweak parameters, verify equations, and run algorithms directly on the page.

In this dispatch, we demonstrate how Smidr utilizes **WebAssembly (Pyodide)** to execute code exclusively in the reader's local web browser.

{{< alert type="tip" title="Server Security & Resilience Guarantee" >}}
Because this static site is hosted on a Raspberry Pi (or GitHub Pages), **zero code is ever transmitted to or executed on the server**.
All Python scripts run in an isolated client-side WebAssembly sandbox. Infinite loops or intensive computations only impact the reader's local thread and cannot crash or breach the host server.
{{< /alert >}}

## Live Python Sandbox (Pyodide WASM)

Try running or editing the neural forward-pass below. When you click **Run (WASM)**, the browser lazily loads Pyodide WebAssembly and calculates the activation values on your device:

{{< code-runner lang="python" title="Pyodide Forward Pass Sandbox" >}}
import math

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

# Simulated neuron weights and inputs
weights = [0.75, -0.42, 1.15]
inputs  = [1.2, 0.5, -0.8]
bias    = 0.15

z = sum(w * i for w, i in zip(weights, inputs)) + bias
activation = sigmoid(z)

print(f"Logit (z): {z:.4f}")
print(f"Neuron Output: {activation:.4f}")
{{< /code-runner >}}

## Live JavaScript Evaluation Playground

For fast vector computations, readers can also use the lightweight in-browser JS evaluation sandbox:

{{< code-runner lang="js" title="Real-Time Kinematics Vector Calculation" >}}
const x = 3.5, y = 4.2, z = 1.8;
const magnitude = Math.hypot(x, y, z);
console.log("Cartesian Vector: [", x, ",", y, ",", z, "]");
console.log("Euclidean Norm:", magnitude.toFixed(3));
{{< /code-runner >}}

## Digital Garden Connection

Notice how this post links directly with our previous work on [Autonomous Quadrotor Trajectory Optimization with LQR](/posts/first-robotics-control/). The bidirectional link detector below discovers and displays this relationship automatically!
