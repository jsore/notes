"""An example of importing and using an alias."""

from electric_car import ElectricCar as EC

# my_tesla = ElectricCar('tesla', 'model s', 2019)
my_tesla = EC('tesla', 'model s', 2019)

print(my_tesla.get_descriptive_name())
my_tesla.battery.describe_battery()
my_tesla.battery.get_range()
