import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function Graph() {
  const [data, setData] = useState({ graphData: [] });

  useEffect(() => {
    async function getData() {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
      };
      const data = await fetch(
        "http://localhost:8000/controller?" +
          new URLSearchParams({
            simulationTime: 10,
            startingTemperature: 0,
            desiredTemperature: 25,
            Kp: 2.0,
            Ki: 0.6,
            Kd: 0.05,
            maxHvacOutput: 10000,
          }),
        { headers: headers, method: "OPTIONS" }
      ).then((response) => {
        return response.json();
      });
      setData(data);
      console.log(data);
    }
    getData();
  }, []);

  return (
    <Plot
      data={[
        {
          x: [...data.times],
          y: [...data.temps],
          type: "scatter",
          mode: "lines",
        },
      ]}
    ></Plot>
  );
}
