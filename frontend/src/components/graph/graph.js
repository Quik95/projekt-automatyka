import React, {useEffect, useState, useMemo} from "react";
import Plot from "react-plotly.js";
import Fields from "../fields/Fields.js";
import debounce from "lodash.debounce"
import styles from "./graph.css";

async function getData(setData, parameters) {
            const headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
            };
            const {simulationTime, maxHVACOutput, startingTemperature, desiredTemperature, Kp, Ki, Kd} = parameters;
            const data = await fetch(
                "http://localhost:8000/controller?" +
                new URLSearchParams({
                    simulationTime: simulationTime,
                    startingTemperature: startingTemperature,
                    desiredTemperature: desiredTemperature,
                    Kp: parseFloat(Kp),
                    Ki: parseFloat(Ki),
                    Kd: parseFloat(Kd),
                    maxHvacOutput: maxHVACOutput,
                }),
                {headers: headers, method: "OPTIONS"}
            ).then((response) => {
                return response.json();
            });
            setData(data);
            console.count("Number of times getData was called");
        }

export default function Graph() {
    const [data, setData] = useState({graphData: []});
    const [parameters, setParameters] = useState({
        simulationTime: 0,
        maxHVACOutput: 0,
        startingTemperature: 0,
        desiredTemperature: 0,
        Kp: 0,
        Ki: 0,
        Kd: 0
    });
    const debounceQuery = useMemo(() => debounce(() => getData(setData, parameters), 50), [parameters])

    useEffect(() => {
        debounceQuery()
    }, [debounceQuery]);
    if (data.times)
        return (
            <>
                <Plot
                    data={[
                        {
                            x: [...data.times.map(t => t / 60)],
                            y: [...data.temps],
                            type: "scatter",
                            mode: "lines",
                        },
                    ]}
                ></Plot>
                <Fields
                    parameters={parameters}
                    handleChangeParameters={setParameters}
                ></Fields>
            </>
        );
}
