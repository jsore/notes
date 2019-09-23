"""A class that can be used to represent cars."""

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
