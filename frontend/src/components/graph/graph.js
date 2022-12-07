import React from "react";

export default function graph() {
  //controller
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
  };
  fetch(
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
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });

  return <h1>dupa</h1>;
}
