"""A set of classes that can be used to represent gas and electric cars."""

class Car:
    """A simple attempt to represent a car."""

    def __init__(self, make, model, year):
        """Initialize attributes to describe a car."""

        # assign values to class
        self.make = make
        self.model = model
        self.year = year
        # defaults mileage to 0
        self.odometer_reading = 0

    def get_descriptive_name(self):
        """Return a neatly formatted descriptive name."""

        long_name = f"{self.year} {self.make} {self.model}"
        return long_name.title()

    def read_odometer(self):
        """Print a statement showing the car's mileage."""

        print(f"This car has {self.odometer_reading} miles on it.")

    def update_odometer(self, mileage):
        """
        Set the odometer reading to the given value.
        Reject the chnge if it attempts to roll the odometer backwards.
        """
        if mileage >= self.odometer_reading:
            # increase mileage, allow
            self.odometer_reading = mileage
        else:
            # decrease mileage, do not allow
            print("You can't roll back an odometer.")

    def increment_odometer(self, miles):
        """Add the given amount to the odometer reading"""

        self.odometer_reading += miles


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
