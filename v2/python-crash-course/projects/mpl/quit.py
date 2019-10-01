import sys

class Quit:
    """Easily quit a process."""

    def __init__(self):
        """Initialize a place to store the current event."""

        # idk if this is doing anything
        # self.event = event

    def process(self, event):
        """The workhorse of the Quit class."""

        self.event = event
        if event.key == 'q':
            print("Closed by user.")
            sys.exit()
