from random import randint


class Die:
    """A class representing a single dice."""

    def __init__(self, num_sides=6):
        """Assume a six-sided die ( D6 ) by default."""

        self.num_sides = num_sides


    def roll(self):
        """Return a random value between 1 and number of sides."""

        return randint(1, self.num_sides)


