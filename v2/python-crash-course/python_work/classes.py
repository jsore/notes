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



##
#
##



##
#
##



##
#
##
