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
            # keep these isolated for simplicity
            self._check_events()
            # after checking for events update ship position
            self.ship.update()
            # then update the screen
            self._update_screen()


    def _check_events(self):
        """Respond to keypresses and mouse events."""

        # .get() returns list of events fired since last call
        # any key/mouse event fires this for loop
        for event in pygame.event.get():

            # window's close button clicked
            if event.type == pygame.QUIT:
                sys.exit()

            # ship movement: flag on/off
            elif event.type == pygame.KEYDOWN:
                self._check_keydown_events(event)
            elif event.type == pygame.KEYUP:
                self._check_keyup_events(event)


    def _check_keydown_events(self, event):
        """Respond to keypresses."""

        if event.key == pygame.K_RIGHT:
            self.ship.moving_right = True
        elif event.key == pygame.K_LEFT:
            self.ship.moving_left = True

        elif event.key == pygame.K_q:
            sys.exit()


    def _check_keyup_events(self, event):
        """Respond to key releases."""

        if event.key == pygame.K_RIGHT:
            self.ship.moving_right = False
        elif event.key == pygame.K_LEFT:
            self.ship.moving_left = False


    def _update_screen(self):
        """Redraw the screen on each pass through main while loop."""

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
