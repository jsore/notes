import pygame.font  # lets Pygame render text to the screen


class Button:
    """Create a filled in and labaled rectangle for user interaction."""

    def __init__(self, ai_game, msg):
        """Initialize button attributes."""

        self.screen = ai_game.screen
        self.screen_rect = self.screen.get_rect()

        # button dimensions and props
        self.width, self.height = 200, 50
        self.button_color = (0, 255, 0)
        self.text_color = (255, 255, 255)
        self.font = pygame.font.SysFont(None, 48)  # just use default font

        # build button's rect and center it
        self.rect = pygame.Rect(0, 0, self.width, self.height)
        self.rect.center = self.screen_rect.center
        self._prep_msg(msg)


    def _prep_msg(self, msg):
        """Turn msg into a rendered image and center button text."""

        self.msg_image = self.font.render(msg, True, self.text_color,
                self.button_color)
        self.msg_image_rect = self.msg_image.get_rect()
        # center attribute of text should be the same as button's
        self.msg_image_rect.center = self.rect.center


    def draw_button(self):
        """Draw blank button then the button's message."""

        self.screen.fill(self.button_color, self.rect)
        self.screen.blit(self.msg_image, self.msg_image_rect)
