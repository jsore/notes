import pygame.font
from pygame.sprite import Group

# add ability to create a group of ships to represent lives left
from ship import Ship


class Scoreboard:
    """A class to report scoring infomration."""

    def __init__(self, ai_game):
        """Initialize scorekeeping attributes."""

        # need this accessible to create a group of ships
        self.ai_game = ai_game

        self.screen = ai_game.screen
        self.screen_rect = self.screen.get_rect()
        self.settings = ai_game.settings
        self.stats = ai_game.stats

        self.text_color = (30, 30, 30)
        self.font = pygame.font.SysFont(None, 48)

        # prep initial score font image
        self.prep_score()
        self.prep_high_score()
        self.prep_level()

        # group of ships to show lives left
        self.prep_ships()


    def prep_score(self):
        """Turn the score into a rendered image."""

        # round to the nearest 10'th value
        rounded_score = round(self.stats.score, -1)
        # use commas in large numbers when converting them
        # from str to an int
        score_str = "{:,}".format(rounded_score)

        self.score_image = self.font.render(score_str, True,
                self.text_color, self.settings.bg_color)

        # expands to left as score increases
        self.score_rect = self.score_image.get_rect()
        self.score_rect.right = self.screen_rect.right - 20
        self.score_rect.top = 20


    def prep_high_score(self):
        """Turn the high score into a rendered image."""

        high_score = round(self.stats.high_score, -1)
        high_score_str = "{:,}".format(high_score)
        self.high_score_image = self.font.render(high_score_str, True,
                self.text_color, self.settings.bg_color)

        # center the high score
        self.high_score_rect = self.high_score_image.get_rect()
        self.high_score_rect.centerx = self.screen_rect.centerx
        self.high_score_rect.top = self.score_rect.top


    def prep_level(self):
        """Turn the current level number into an image."""

        level_str = str(self.stats.level)
        self.level_image = self.font.render(level_str, True,
                self.text_color, self.settings.bg_color)
        self.level_rect = self.level_image.get_rect()
        self.level_rect.right = self.score_rect.right
        self.level_rect.top = self.score_rect.bottom + 10


    def prep_ships(self):
        """Show how many ships (lives) are left."""

        self.ships = Group()
        for ship_number in range(self.stats.ships_left):
            ship = Ship(self.ai_game)
            ship.rect.x = 10 + ship_number * ship.rect.width
            ship.rect.y = 10
            self.ships.add(ship)


    def check_high_score(self):
        """Check if there's a new high score."""

        # matches current score against current high score
        # and updates high score if necessary
        if self.stats.score > self.stats.high_score:
            self.stats.high_score = self.stats.score
            self.prep_high_score()


    def show_score(self):
        """Draw scores and current level to the screen."""

        # what to draw & where
        self.screen.blit(self.score_image, self.score_rect)
        self.screen.blit(self.high_score_image, self.high_score_rect)
        self.screen.blit(self.level_image, self.level_rect)

        # lives left
        self.ships.draw(self.screen)
