import React, {useEffect, useState} from "react";
import Plot from "react-plotly.js";
import Fields from "../fields/Fields.js";


export default function Graph() {
    const [data, setData] = useState({graphData: []});
    const [parameters, setParameters] = useState({
        simulationTime: 60,
        maxHVACOutput: 1000,
        startingTemperature: 18,
        desiredTemperature: 21,
        Kp: 60,
        Ki: 0,
        Kd: 0.05
    });

    useEffect(() => {
        let didCancel = false;

        async function getData(setData, parameters) {
            const headers = {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
            };
            const {simulationTime, maxHVACOutput, startingTemperature, desiredTemperature, Kp, Ki, Kd} = parameters;
            try {
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
                    {headers: headers}
                )
                if (didCancel)
                    console.count("Cancelled request")
                if (data.status === 200 && didCancel === false) {
                    setData(await data.json());
                    console.count("Number of times getData was called");
                }
            } catch (e) {
                console.error(e)
            }
        }

        getData(setData, parameters)

        return () => {
            didCancel = true;
        }
    }, [setData, parameters]);

    if (data.times)
        return (
            <>
                <Plot
                    data={[
                        {
                            x: [...data.times.map(t => t / 60)],
                            y: data.temps,
                            type: "scatter",
                            mode: "lines",
                        },
                        {
                            x: data.times.map(t => t / 60),
                            y: data.hvac,
                            type: "scatte",
                            mode: "lines"
                        }
                    ]}
                ></Plot>
                <Fields
                    parameters={parameters}
                    handleChangeParameters={setParameters}
                ></Fields>
            </>
        );
}
