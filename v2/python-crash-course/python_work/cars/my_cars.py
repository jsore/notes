"""An example of importing multiple class modules"""

# import specific classes from a module
# from car import Car, ElectricCar
# my_beetle = Car('volkswagen', 'beetle', 2019)

# import all classes from a module
# from module_name import *
# not recommended, classes aren't explicity clear to someone
# who reads the code and makes namespace clashes harder to
# diagnose when debugging

# import an entire module, access classes with dot notation
# module_name.ClassName
# import car
# my_beetle = car.Car(args)

from car import Car
from electric_car import ElectricCar

my_beetle = Car('volkswagen', 'beetle', 2019)
print(my_beetle.get_descriptive_name())

my_tesla_roadster = ElectricCar('tesla', 'roadster', 2019)
print(my_tesla_roadster.get_descriptive_name())
