# Galaga clone

import sys  # for exiting game when user quits

import pygame  # game functionality

from settings import Settings  # game settings class
from ship import Ship  # user's spaceship


class AlienInvasion:
    """Overall class to manage game assets and behavior."""

    def __init__(self):
        """Initialize the game and create game resources."""

        # init Pygame's background settings
        pygame.init()
        self.settings = Settings()

        # make the surface available to all other methods (self)
        self.screen = pygame.display.set_mode(
            (self.settings.screen_width, self.settings.screen_height))
        pygame.display.set_caption("Alien Invasion")

        # pass current instance of class ( self ) for reference
        self.ship = Ship(self)


    # where game is controlled
    def run_game(self):
        """Start the main loop for the game."""

        while True:

            # watch for keyboard/mouse events
            # .get() returns list of events fired since last call
            # any key/mouse event fires this for loop
            for event in pygame.event.get():

                # window's close button clicked
                if event.type == pygame.QUIT:
                    sys.exit()

            # redraw screen on each pass through loop
            self.screen.fill(self.settings.bg_color)
            self.ship.blitme()

            # then make the most recently drawn screen visible
            # draw empty screen on each pass through while loop
            pygame.display.flip()


# only run when file is called directly
if __name__ == '__main__':
    # make a game instance then run it
    ai = AlienInvasion()
    ai.run_game()
