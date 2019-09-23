"""A set of classes that can be used to represent electric cars."""

from car import Car

class Battery:
    """A simple attempt to model a battery for an electric car."""

    # set the class with a defaulted battery size
    def __init__(self, battery_size=75):
        """Initialize the battery's attributes."""

        self.battery_size = battery_size

    def describe_battery(self):
        """Prints a statement describing the battery's size."""

        print(f"This car has a {self.battery_size}-kWh battery.")

    def get_range(self):
        """Prints a statement about the range this battery provides."""

        if self.battery_size == 75:
            range = 260
        elif self.battery_size == 100:
            range = 315

        print(f"This car can go about {range} miles on a full charge.")


# subclass of Car
class ElectricCar(Car):
    """Models aspects of a car, specific to electric vehicles."""

    def __init__(self, make, model, year):
        """
        Initialize attributes of the parent class.
        Then initialize attributes specific to an electric car.
        """

        # the parent's attributes
        super().__init__(make, model, year)

        # the child's, an instance of Battery()
        self.battery = Battery()
