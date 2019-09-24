import pygame

class Ship:
    """A class to manage the user's ship"""

    # init with reference to current instance of AlienInvasion
    # class for access to all game resources
    def __init__(self, ai_game):
        """Initialize the ship and set its starting point"""

        # make it easier to access screen in all class methods
        self.screen = ai_game.screen
        # let us place the ship in the correct location
        self.screen_rect = ai_game.screen.get_rect()
        # load image and get its rect
        self.image = pygame.image.load('images/ship.bmp')
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


    def blitme(self):
        """Draw the ship at its current location."""

        # self.rect is the current location
        self.screen.blit(self.image, self.rect)
