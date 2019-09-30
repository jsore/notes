import pygame
from pygame.sprite import Sprite


# inherit sprite class to use its grouping functionality
class Ship(Sprite):
    """A class to manage the user's ship"""

    # init with reference to current instance of AlienInvasion
    # class for access to all game resources
    def __init__(self, ai_game):
        """Initialize the ship and set its starting point"""

        super().__init__()

        # make it easier to access screen in all class methods
        self.screen = ai_game.screen
        # create settings attribute to let us use it in update()
        self.settings = ai_game.settings
        # let us place the ship in the correct location
        self.screen_rect = ai_game.screen.get_rect()
        # load image and get its rect
        self.image = pygame.image.load('images/ship.bmp').convert()
        # get access to the ship's surface after image loads
        self.rect = self.image.get_rect()

        # start point, matched to screen's midbottom
        self.rect.midbottom = self.screen_rect.midbottom

        # available coordinate attributes other than just x/y
        # centering elements: center, centerx, centery
        # screen edges: top, bottom, left, right
        #   midbottom, midtop, midleft, midright
        # x/y cordinates refer to top-left corner of object
        # origin is top left corner (0, 0)

        # rect attributes like x can only be ints
        # we need sommething that can store decimals
        self.x = float(self.rect.x)

        # movement flags, only move on keypress
        self.moving_right = False
        self.moving_left = False


    def update(self):
        """Update the ship's position based on the movement flag."""

        # update the ship's x value, not the rect, and set
        # limits on x/y bounds to keep it on screen
        if self.moving_right and self.rect.right < self.screen_rect.right:
            self.x += self.settings.ship_speed
        if self.moving_left and self.rect.left > 0:
            self.x -= self.settings.ship_speed

        # now update the rect, keeping only the int portion
        # of the decimal is fine for displaying the ship
        self.rect.x = self.x


    def blitme(self):
        """Draw the ship at its current location."""

        # self.rect is the current location
        self.screen.blit(self.image, self.rect)


    def center_ship(self):
        """Center the ship on the screen."""

        self.rect.midbottom = self.screen_rect.midbottom
        # reset x to track ship's exact pos
        self.x = float(self.rect.x)
