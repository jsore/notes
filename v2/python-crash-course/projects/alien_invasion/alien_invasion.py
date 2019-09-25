# Galaga clone

import sys  # for exiting game when user quits

import pygame  # game functionality

from settings import Settings  # game settings class
from ship import Ship  # user's spaceship
from bullet import Bullet


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
        # fullscreen
        # self.screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
        # self.settings.screen_width = self.screen.get_rect().width
        # self.settings.screen_height = self.screen.get_rect().height
        pygame.display.set_caption("Alien Invasion")

        # pass current instance of class ( self ) for reference
        self.ship = Ship(self)
        self.bullets = pygame.sprite.Group()


    # where game is controlled
    def run_game(self):
        """Start the main loop for the game."""

        # main loop
        while True:

            # keep these isolated for simplicity
            self._check_events()

            # after checking for events update ship position
            self.ship.update()

            self._update_bullets()

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

        elif event.key == pygame.K_SPACE:
            self._fire_bullet()


    def _check_keyup_events(self, event):
        """Respond to key releases."""

        if event.key == pygame.K_RIGHT:
            self.ship.moving_right = False
        elif event.key == pygame.K_LEFT:
            self.ship.moving_left = False


    def _fire_bullet(self):
        """Create a new bullet and add to bullets group."""

        # accuracy > quantity
        if len(self.bullets) < self.settings.bullets_allowed:
            new_bullet = Bullet(self)
            self.bullets.add(new_bullet)


    def _update_bullets(self):
        """Update bullet position and trash old bullets."""

        # applies to all live bullets in bullet group
        self.bullets.update()

        # get rid of disappeared bullets
        #
        # python lists need to stay the same length while
        # being looped over, make a copy of it to modify
        # bullets within the loop
        for bullet in self.bullets.copy():
            if bullet.rect.bottom <= 0:
                self.bullets.remove(bullet)
        # sanity check to confirm bullets are removed
        # print(len(self.bullets))


    def _update_screen(self):
        """Redraw the screen on each pass through main while loop."""

        self.screen.fill(self.settings.bg_color)
        self.ship.blitme()

        for bullet in self.bullets.sprites():
            bullet.draw_bullet()

        # then make the most recently drawn screen visible
        # draw empty screen on each pass through while loop
        pygame.display.flip()


# only run when file is called directly
if __name__ == '__main__':
    # make a game instance then run it
    ai = AlienInvasion()
    ai.run_game()
