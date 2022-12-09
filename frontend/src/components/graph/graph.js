import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Fields from "../fields/Fields.js";
import styles from "./graph.css";
export default function Graph() {
  const [data, setData] = useState({ graphData: [] });
  const [startingTemperature, setStartingTemperature] = useState(0);
  const [desiredTemperature, setDesiredTemperature] = useState(0);
  const [Kp, setKp] = useState(1.0);
  const [Ki, setKi] = useState(1.5);
  const [Kd, setKd] = useState(2.0);

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
            simulationTime: 5000,
            startingTemperature: startingTemperature,
            desiredTemperature: desiredTemperature,
            Kp: parseFloat(Kp),
            Ki: parseFloat(Ki),
            Kd: parseFloat(Kd),
            maxHvacOutput: 150,
          }),
        { headers: headers, method: "OPTIONS" }
      ).then((response) => {
        return response.json();
      });
      setData(data);
      console.log(data);
    }
    getData();
  }, [startingTemperature, desiredTemperature, Kp, Ki, Kd]);
  if (data.times)
    return (
      <>
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
        <Fields
          setStartingTemperature={setStartingTemperature}
          setDesiredTemperature={setDesiredTemperature}
          setKp={setKp}
          setKi={setKi}
          setKd={setKd}
        ></Fields>
      </>
    );
}
