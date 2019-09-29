class GameStats:
    """Track statistics for Alien Invasion."""

    # one GameStats instance per game
    def __init__(self, ai_game):
        """Initialize statistics."""

        self.settings = ai_game.settings
        self.reset_stats()

        # flag for ending the game when user runs out of ships
        self.game_active = True


    def reset_stats(self):
        """Initialize statistics that can change during the game."""

        self.ships_left = self.settings.ship_limit
