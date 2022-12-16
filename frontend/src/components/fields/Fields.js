import React from "react";
import Slider from "@mui/material/Slider";
import {Box, Grid, Input, InputAdornment, Typography} from "@mui/material";

function Selector(props) {
    const {value, handleValueChange, title, name, minValue, maxValue, valueStep, unit} = props;

    return (
        <Box sx={{width: 250}}>
            <Typography id="input-slider" gutterBottom>
                {title}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={7}>
                    <Slider
                        name={name}
                        value={value}
                        onChange={handleValueChange}
                        aria-labelledby="input-slider"
                        min={minValue}
                        max={maxValue}
                        //  What are you doing step value???
                        step={valueStep}
                    />
                </Grid>
                <Grid item xs={5}>
                    <Input
                        value={value}
                        name={name}
                        endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default function Fields(props) {
    const {
        parameters: {simulationTime, maxHVACOutput, startingTemperature, desiredTemperature, Kp, Ki, Kd},
        handleChangeParameters
    } = props;

    const handleValueChange = e => {
        const {target: {name, value}} = e;
        switch (name) {
            case "hvac":
                handleChangeParameters({...props.parameters, maxHVACOutput: value});
                break;
            case "simulationTime":
                handleChangeParameters({...props.parameters, simulationTime: value});
                break;
            case "startTemp":
                handleChangeParameters({...props.parameters, startingTemperature: value});
                break;
            case "targetTemp":
                handleChangeParameters({...props.parameters, desiredTemperature: value});
                break;
            case "Kp":
                handleChangeParameters({...props.parameters, Kp: value});
                break;
            case "Ki":
                handleChangeParameters({...props.parameters, Ki: value});
                break;
            case "Kd":
                handleChangeParameters({...props.parameters, Kd: value});
                break;
            default:
                console.log("error", e);
        }
    };

    return (
        <div className="slidersWrapper">
            <Selector
                title="Czas symulacji"
                value={simulationTime}
                handleValueChange={handleValueChange}
                name="simulationTime"
                minValue={0}
                maxValue={180}
                valueStep={1}
                unit="min"
            />
            <Selector
                title="Maksymalna moc grzewcza"
                value={maxHVACOutput}
                handleValueChange={handleValueChange}
                name="hvac"
                minValue={500}
                maxValue={10_000}
                valueStep={250}
                unit="BTU"
            />
            <Selector
                title="Temperatura początkowa"
                value={startingTemperature}
                handleValueChange={handleValueChange}
                name="startTemp"
                minValue={0}
                maxValue={38}
                valueStep={1}
                unit="°C"
            />
            <Selector
                title="Temperatura docelowa"
                value={desiredTemperature}
                handleValueChange={handleValueChange}
                name="targetTemp"
                minValue={0}
                maxValue={38}
                valueStep={1}
                unit="°C"
            />
            <Selector
                title="Kp"
                value={Kp}
                handleValueChange={handleValueChange}
                name="Kp"
                minValue={0}
                maxValue={100}
                valueStep={0.1}
            />
            <Selector
                title="Ki"
                value={Ki}
                handleValueChange={handleValueChange}
                name="Ki"
                minValue={0}
                maxValue={10}
                valueStep={0.1}
            />
            <Selector
                title="Kd"
                value={Kd}
                handleValueChange={handleValueChange}
                name="Kd"
                minValue={0}
                maxValue={10}
                valueStep={0.01}
            />
        </div>
    );
}
