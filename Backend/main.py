from fastapi import FastAPI

from controller import PIDController
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}


@app.get("/controller")
async def controller(simulationTime: int, startingTemperature: float, desiredTemperature: float, Kp: float, Ki: float, Kd: float,
                     maxHvacOutput: float):
    cnt = PIDController(
        simulation_time=simulationTime,
        starting_temperature=startingTemperature,
        desired_temperature=desiredTemperature,
        Kp=Kp,
        Ki=Ki,
        Kd=Kd,
        max_hvac_output=maxHvacOutput
    )
    (times, temps, hvac) = cnt.run()
    return {"times": times, "temps": temps, "hvac": hvac}
