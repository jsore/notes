class GameStats:
    """Track statistics for Alien Invasion."""

    # one GameStats instance per game
    def __init__(self, ai_game):
        """Initialize statistics."""

        self.settings = ai_game.settings
        self.reset_stats()

        # flag for ending or starting a game
        # start the game in inactive status to let user
        # choose to hit the Play button if desired
        self.game_active = False


    def reset_stats(self):
        """Initialize statistics that can change during the game."""

        self.ships_left = self.settings.ship_limit
        self.score = 0
