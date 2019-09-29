class Settings:
    """A class to store all settings for Alien Invasion."""

    def __init__(self):
        """Initialize the game's settings."""

        # screen settings
        self.screen_width = 1200
        self.screen_height = 800
        self.bg_color = (230, 230, 230)

        # ship settings
        # increase speed on each pass through for loop
        self.ship_speed = 6.5
        self.ship_limit = 3

        # bullet settings
        # self.bullet_speed = 1.0
        self.bullet_speed = 10.0
        self.bullet_width = 3
        self.bullet_height = 15
        self.bullet_color = (60, 60, 60)
        # accuracy > quantity
        self.bullets_allowed = 3

        # alien settings
        self.alien_speed = 3.0
        self.fleet_drop_speed = 10
        # 1 for right, -1 for left
        self.fleet_direction = 1

        #
