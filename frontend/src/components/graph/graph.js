import React, {useEffect, useState} from "react";
import Plot from "react-plotly.js";
import Fields from "../fields/Fields.js";
import {Grid} from "@mui/material";


export default function Graph() {
    const [data, setData] = useState({graphData: []});
    const [parameters, setParameters] = useState({
        simulationTime: 60,
        maxHVACOutput: 1000,
        startingTemperature: 18,
        desiredTemperature: 21,
        Kp: 23,
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
            <Grid container paddingX={"10px"} spacing={6} justifyContent="center" alignItems="center">
                <Grid item xs={10}>
                    <Grid container spacing={6} justiftContent="center">
                        <Grid item>
                            <Plot
                                layout={{title: "Wykres temperatury w zależności od czasu"}}
                                data={[
                                    {
                                        x: [...data.times.map(t => t / 60)],
                                        y: data.temps,
                                        type: "scatter",
                                        mode: "lines",
                                        name: "Current temperature"
                                    },
                                    {
                                        x: data.times.map(t => t / 60),
                                        y: data.times.map(_ => parameters.desiredTemperature),
                                        type: "scatter",
                                        mode: "lines",
                                        name: "Desired temperature",
                                    }
                                ]}
                            ></Plot>
                        </Grid>
                        <Grid item>
                            <Plot
                                layout={{title: "Wykres mocy systemu klimatyzacji w zależności od czasu"}}
                                data={[
                                    {
                                        x: data.times.map(t => t / 60),
                                        y: data.hvac,
                                        type: "scatter",
                                        mode: "lines",
                                        name: "HVAC output"
                                    },
                                ]}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={2}>
                    <Fields
                        parameters={parameters}
                        handleChangeParameters={setParameters}
                    ></Fields>
                </Grid>
            </Grid>
        );
}
