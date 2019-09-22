##
# a dog class containing age and name, sit() and roll_over()
##
class Dog:
    """
    A simple model of a dog.
    """

    def __init__(self, name, age):
        """
        Initialize name and age attributes.
        """
        self.name = name
        self.age = age

    def sit(self):
        """
        Simulate a dog sitting in response to a command.
        """
        print(f"{self.name} is now sitting. Arf.")

    def roll_over(self):
        """
        Simulate a dog rolling over in response to a command.
        """
        print(f"{self.name} rolled over! Bark.")

...

from dog import Dog

# create instances
# __init__() will set these args as attributes
my_dog = Dog('Willie', 6)
your_dog = Dog('Stella', 5)

# access some attributes
print(f"My dog's name is {my_dog.name}")
print(f"My dog is {my_dog.age} years old")

# access some methods on the class
my_dog.sit()        # Willie is now sitting. Arf.
my_dog.roll_over()  # Willie rolled over! Bark.

# access some attributes
print(f"\nYour dog's name is {your_dog.name}")
print(f"Your dog is {your_dog.age} years old")

# access some methods on the class
your_dog.sit()        # Stella is now sitting. Arf.
your_dog.roll_over()  # Stella rolled over! Bark.



##
# modifying attribute values
#
# - change value directly through an instance...
# - set the value with a method...
# - ...or increment the value through a method instead of changing entirely
##
class Car:
    """
    A simple attempt to represent a car.
    """
    def __init__(self, make, model, year):
        """
        Initialize attributes to describe a car.
        """
        self.make = make
        self.model = model
        self.year = year
        # an example default attribute:
        self.odometer_reading = 0

    def get_descriptive_name(self):
        """
        Return a neatly formatted descriptive name.
        """
        # long_name = f"{self.year} {self.manufacturer} {self.model}"
        long_name = f"{self.year} {self.make} {self.model}"
        return long_name.title()

    def read_odometer(self):
        """
        Print a statement showing the car's mileage.
        """
        print(f"This car has {self.odometer_reading} miles on it")

    # ...change attribute value with a method
    def update_odometer(self, mileage):
        """
        Set the odometer reading to the given value.
        Reject the change if it attempts to roll the odometer back.
        """
        if mileage >= self.odometer_reading:
            self.odometer_reading = mileage
        else:
            print("You can't roll back an odometer")

    # ...increment the value through a method instead of changing entirely
    def increment_odometer(self, miles):
        """
        Add the given amount to the odometer reading
        """
        self.odometer_reading += miles


my_new_car = Car('audi', 'a4', 2019)
print(my_new_car.get_descriptive_name())

# modify attribute directly through this instance...
my_new_car.odometer_reading = 23

# ...change attribute value with a method
my_new_car.update_odometer(23)

my_new_car.read_odometer()


my_used_car = Car('subaru', 'outback', 2015)
print(my_used_car.get_descriptive_name())

my_used_car.update_odometer(23_500)
my_used_car.read_odometer()

# ...increment the value through a method instead of changing entirely
my_used_car.increment_odometer(100)
my_used_car.read_odometer()



##
# Inheritance
##
class Car:
    # the parent
    ...

# the child ( must be placed in same file as parent )
class ElectricCar(Car):
    """
    Represents aspects of a car, specific to electric vehicles.
    """
    def __init__(self, make, model, year):
        """
        Initialize attributes of the parent class.
        Then initialize attributes specific to an electric car.
        """

        # use super() to call methods from parent
        super().__init__(make, model, year)
        self.battery_size = 75

    def describe_battery(self):
        """
        Print a statement describing the battery size
        """
        print(f"This car has a {self.battery_size}-kwh battery")

    # example of overriding a parent class's method
    def fill_gas_tank(self):
        """
        Electric cars don't have gas tanks.
        """
        print("This car doesn't need a gas tank")


# testing inheritance of superclass -> subclass
my_tesla = ElectricCar('tesla', 'model s', 2019)
print(my_tesla.get_descriptive_name())

# unique instance methods
my_tesla.describe_battery()



##
# instances as attributes
##
class Car:
    ...

class Battery:
    """
    Let's say the ElectricCar class was getting overfilled and long.
    Break up methods and parts of classes into their own class.
    """
    def __init__(self, battery_size=75):
        """
        Initialize the battery's attributes.
        """
        self.battery_size = battery_size

    def describe_battery(self):
        """
        Print a statement describing the battery's size.
        """
        print(f"This car has a {self.battery_size}-kwh battery")

    def get_range(self):
        """
        Print a statement about the range this battery provides.
        """
        if self.battery_size == 75:
            range = 260
        elif self.batter_size == 100:
            range = 315

        print(f"This car can go about {range} miles on a full charge")

class ElectricCar:
    def __init__(self, make, model, year):
        super().__init__(make, model, year)

        # use the Battery instance as an attribute
        # everytime ElectricCar is __init__()'ed, it'll have
        # a Vattery instance created as well
        self.battery = Battery()

    ...

my_tesla.battery.describe_battery()
my_tesla.battery.get_range()


##
#
##



##
#
##



##
#
##



##
#
##



##
#
##



##
#
##



##
#
##



##
#
##
