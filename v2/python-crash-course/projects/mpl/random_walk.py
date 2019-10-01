from random import choice


class RandomWalk:
    """A class to generate random walks (choices in a path)."""

    # large enough for interesting patterns, small enough to
    # be generated quickly
    def __init__(self, num_points=5000):
        """Initialize attributes of a walk."""

        self.num_points = num_points

        # all walks start at (0, 0)
        self.x_values = [0]
        self.y_values = [0]

        # self.canvas = self.ax.figu


    def fill_walk(self):
        """Calculate all the points in the walk."""

        # step until walk reaches desired length
        while len(self.x_values) < self.num_points:

            # where and how far to go in that direction
            # left or right?
            x_direction = choice([1, -1])
            x_distance = choice([0, 1, 2, 3, 4])
            x_step = x_direction * x_distance
            # up or down?
            y_direction = choice([1, -1])
            y_distance = choice([0, 1, 2, 3, 4])
            y_step = y_direction * y_distance

            # reject moves that don't go up down right or left
            if x_step == 0 and y_step == 0:
                # go straight to jail do not collect $200
                continue

            # calculate new pos
            x = self.x_values[-1] + x_step
            y = self.y_values[-1] + y_step

            self.x_values.append(x)
            self.y_values.append(y)
