"use client";

import React, { useEffect } from "react";
import * as Plotly from "plotly.js/lib/core";
import { CardinalSpline } from "@/libs/cardinal-spline";

const linspace = (start: number, end: number, n: number): number[] => {
  const arr = new Array(n);
  const step = (end - start) / (n - 1);
  for (let i = 0; i < n; i++) {
    arr[i] = start + step * i;
  }
  return arr;
};

const SplinePlot = () => {
  useEffect(() => {
    // Generate data points
    const t = linspace(0, 3, 100);
    const spline = new CardinalSpline([1, 2, 5, 6], [1, 2, 3]);
    const y = spline.compute_many(t);

    const trace = {
      x: t,
      y: y,
      // type: "scatter",
    };

    const data = [trace];

    Plotly.newPlot("myDiv", data);
  }, []);

  return <div id="myDiv" />;
};

export default SplinePlot;
