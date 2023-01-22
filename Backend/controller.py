class RoomModel:
    temperature: float  # Current temperature in F
    thermal_resistance: float = 0.5
    air_density: float = 0.075  # pounds per cubic foot
    heat_capacity: float = 0.24  # BTU per pound per degree F
    # volume of the room
    volume: int
    # mass of the air in the room
    mass: float
    dt: float
    outside_temperature = 41
    U_value: float = 0.53

    def __init__(self, starting_temperature: float, dt: float, room_dimensions: tuple[int, int, int]):
        (length, width, height) = room_dimensions

        self.dt = dt
        self.temperature = starting_temperature
        self.volume = length * width * height
        self.surface_area = height*width*2 + height*length*2
        self.mass = self.volume * self.air_density

    def update(self, control_signal: float):
        heat_loss = (self.U_value * self.surface_area * (self.temperature - self.outside_temperature))/3600
        dT = ((control_signal / (self.mass * self.heat_capacity)) - heat_loss) * self.dt
        self.temperature += dT


class PIDController:
    desired_temperature: float
    Kp: float
    Ki: float
    Kd: float
    simulation_time: float
    wiggle_room: float
    room_model: RoomModel
    # Define the HVAC output in BTUs per hour
    max_hvac_output: float = 5000 / 3600  # BTUs per second

    # time interval for updates in seconds
    dt: int = 60

    # constructor for this class
    def __init__(self, simulation_time: int, starting_temperature: float, desired_temperature: float, Kp: float,
                 Ki: float, Kd: float, max_hvac_output: float):
        self.Kp = Kp
        self.Ki = Ki
        self.Kd = Kd
        self.simulation_time = 60 * simulation_time  # half an hour
        self.room_model = RoomModel(self.celcius_to_fahrenheit(starting_temperature), self.dt / 3600, (25, 15, 8))
        self.max_hvac_output = max_hvac_output  # BTUs per hour

        self.desired_temperature = self.celcius_to_fahrenheit(desired_temperature)
        self.wiggle_room = 1.11

    @staticmethod
    def fahrenheit_to_celsius(fahrenheit: float) -> float:
        return (fahrenheit - 32) * 5 / 9

    @staticmethod
    def celcius_to_fahrenheit(celcius: float) -> float:
        return celcius * 9 / 5 + 32

    def run(self) -> tuple[list[int], list[float], list[float]]:
        elapsed_time = 0
        integral = 0

        measurement_times = []
        temperatures = []
        hvac_outputs = []

        previous_error = 0
        integral = 0
        cooling = 0

        while elapsed_time <= self.simulation_time:
            # calculate error
            error = self.desired_temperature - self.room_model.temperature

            proportional = error

            # Update the integral term
            integral = integral + error * self.dt

            derivative = (error - previous_error) / self.dt

            # Calculate the output of PI controller
            output = self.Kp * proportional + self.Ki * integral + self.Kd * derivative
            # output = output // 200 * 200
            output = min(max(output, 0), self.max_hvac_output)
            # if output == 0:
            #     cooling = 10
            #
            # if cooling > 0:
            #     output = 0
            #     cooling -= 1

            self.room_model.update(output)
            elapsed_time += self.dt

            previous_error = error

            measurement_times.append(elapsed_time)
            temperatures.append(self.fahrenheit_to_celsius(self.room_model.temperature))
            hvac_outputs.append(output)

        return measurement_times, temperatures, hvac_outputs


if __name__ == '__main__':
    import plotly.express as px
    import pandas as pd

    desired_temperature = 22
    controller = PIDController(simulation_time=60, starting_temperature=16, desired_temperature=22, Ki=0.6, Kp=2.0, Kd=0.01)
    times, temps, hvacs = controller.run()
    data = {
        "Time": times,
        "Temperature": temps,
        "HVAC Output": hvacs,
        "Desired temperature": 22
    }

    df = pd.DataFrame(data)
    fig = px.line(df, x="Time", y=["Temperature", "HVAC Output", "Desired temperature"], title="Temperature vs Time")
    fig.write_html("/tmp/figure.html", auto_open=False)

