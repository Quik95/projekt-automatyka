import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import styles from "./Fields.css";

export default function Fields(props) {
  let marks = [];
  for (let i = 0; i < 150; i++) {
    marks.push({
      value: i,
      label: `${i}`,
    });
  }

  const handleValueChange = (event, newValue) => {
    switch (event.target.name) {
      case "startTemp":
        props.setStartingTemperature(newValue);
        break;
      case "targetTemp":
        props.setDesiredTemperature(newValue);
        break;
      case "Kp":
        props.setKp(newValue);
        break;
      case "Kd":
        props.setKd(newValue);
        break;
      case "Ki":
        props.setKi(newValue);
        break;
      default:
        console.log("error", event);
    }
  };

  return (
    <div className="slidersWrapper">
      Temperatura początkowa
      <Slider
        name="startTemp"
        aria-label="Custom marks"
        defaultValue={0}
        step={1}
        valueLabelDisplay="auto"
        onChange={handleValueChange}
      />
      Temperatura docelowa
      <Slider
        name="targetTemp"
        aria-label="Custom marks"
        defaultValue={0}
        step={1}
        valueLabelDisplay="auto"
        onChange={handleValueChange}
      />
      Ki
      <Slider
        name="Ki"
        aria-label="Custom marks"
        defaultValue={0}
        step={0.1}
        valueLabelDisplay="auto"
        onChange={handleValueChange}
      />
      Kp
      <Slider
        name="Kp"
        aria-label="Custom marks"
        defaultValue={0}
        step={0.1}
        valueLabelDisplay="auto"
        onChange={handleValueChange}
      />
      Kd
      <Slider
        name="Kd"
        aria-label="Custom marks"
        defaultValue={0}
        step={0.1}
        valueLabelDisplay="auto"
        onChange={handleValueChange}
      />
    </div>
  );
}
