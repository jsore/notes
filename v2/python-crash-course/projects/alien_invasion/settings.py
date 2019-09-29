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
        self.ship_limit = 3

        # bullet settings
        # self.bullet_speed = 1.0
        self.bullet_width = 3
        self.bullet_height = 15
        self.bullet_color = (60, 60, 60)
        # accuracy > quantity
        self.bullets_allowed = 3

        # alien settings
        self.fleet_drop_speed = 10

        # how fast the difficulty increases
        self.speedup_scale = 1.1
        # group the changing settings together
        self.initialize_dynamic_settings()


    def initialize_dynamic_settings(self):
        """Initialize settings that can change in game."""

        self.ship_speed = 8.5
        self.bullet_speed = 10.0
        self.alien_speed = 3.0

        # 1 for right, -1 for left
        self.fleet_direction = 1

        # scoring per alien hit
        self.alien_points = 50


    def increase_speed(self):
        """Increase speed settings."""

        self.ship_speed *= self.speedup_scale
        self.bullet_speed *= self.speedup_scale
        self.alien_speed *= self.speedup_scale

