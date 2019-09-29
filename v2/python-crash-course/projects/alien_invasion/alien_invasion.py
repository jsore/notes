# Galaga clone

import sys  # for exiting game when user quits
from time import sleep  # pause when a ship gets hit

import pygame  # game functionality

from settings import Settings  # game settings class
from game_stats import GameStats
from ship import Ship  # user's spaceship
from bullet import Bullet
from alien import Alien



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

        # create instance for tracking game stats
        self.stats = GameStats(self)

        # pass current instance of class ( self ) for reference
        self.ship = Ship(self)
        self.bullets = pygame.sprite.Group()
        self.aliens = pygame.sprite.Group()

        self._create_fleet()


    # where game is controlled
    def run_game(self):
        """Start the main loop for the game."""

        # main loop
        while True:

            # look for user input events
            self._check_events()

            # these should only run when the game is active
            if self.stats.game_active:
                # after checking for events update positions
                self.ship.update()
                self._update_bullets()
                self._update_aliens()

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

        self._check_bullet_alien_collisions()


    def _check_bullet_alien_collisions(self):
        """Respond to bullet-alien collisions."""

        # check for bullets that've hit aliens
        #
        # groupcollide() returns a dictionary of bullets and
        # the alien the bullet collides with, identified by
        # comparing overlapping rects
        #
        # the True arguments dictate whether or not collided
        # items should be deleted
        collisions = pygame.sprite.groupcollide(
                self.bullets, self.aliens, True, True)

        # repopulate the fleet when empty
        if not self.aliens:
            self.bullets.empty()
            self._create_fleet()


    def _create_alien(self, alien_number, row_number):
        """Create an alien and place it in a row."""

        alien = Alien(self)
        alien_width, alien_height = alien.rect.size
        alien.x = alien_width + 2 * alien_width * alien_number
        alien.rect.x = alien.x
        alien.rect.y = alien.rect.height + 2 * alien.rect.height * row_number
        self.aliens.add(alien)


    def _create_fleet(self):
        """Create a fleet of aliens."""

        # create alien sprite with a reference to current state
        # alien = Alien(self)     # the alien
        # self.aliens.add(alien)  # adding to the Group()

        # create alien, find how many aliens can fit in a row
        # spacing between each alien == 1 alien width
        # account for margins 1 alien wide on screen borders
        # available space == screen width minus two alien widths
        alien = Alien(self)
        # just a reference to an alien, not part of the Group()
        alien_width, alien_height = alien.rect.size  # tuple
        available_space_x = self.settings.screen_width - (2 * alien_width)
        number_aliens_x = available_space_x // (2 * alien_width)  # floor div

        # determine possible row count
        ship_height = self.ship.rect.height
        # height minus alien height on top, two bottom, on
        # top of the ship
        available_space_y = (self.settings.screen_height -
            (3 * alien_height) - ship_height)
        number_rows = available_space_y // (2 * alien_height)

        # create the fleet
        for row_number in range(number_rows):
            for alien_number in range(number_aliens_x):
                self._create_alien(alien_number, row_number)


    def _check_fleet_edges(self):
        """Respond appropriately if aliens have reached an edge."""

        # if the alien.check_edges method reports True, the
        # fleet needs to drop and change direction
        for alien in self.aliens.sprites():
            if alien.check_edges():
                self._change_fleet_direction()
                break


    def _change_fleet_direction(self):
        """Drop the fleet and change the fleet's direction."""

        for alien in self.aliens.sprites():
            alien.rect.y += self.settings.fleet_drop_speed
        self.settings.fleet_direction *= -1


    def _ship_hit(self):
        """Respond to the ship being hit by an alien."""

        if self.stats.ships_left > 0:
            # dcrement ship count, get rid of remaining bullets
            # and aliens, create new fleet and center the ship
            self.stats.ships_left -= 1
            self.aliens.empty()
            self.bullets.empty()
            self._create_fleet()
            self.ship.center_ship()

            # pause to let user notice the collision and regroup
            sleep(0.5)
        else:
            self.stats.game_active = False


    def _check_aliens_bottom(self):
        """Check if aliens reach bottom of the screen."""

        screen_rect = self.screen.get_rect()
        for alien in self.aliens.sprites():
            if alien.rect.bottom >= screen_rect.bottom:
                # treat same as if ship got hit
                self._ship_hit()
                break


    def _update_aliens(self):
        """Update the positions of all aliens in the fleet."""

        # if aliens are at an edge, drop them down and
        # change its direction
        self._check_fleet_edges()
        self.aliens.update()

        # alien-ship collisions are bad
        # returns 1st alien that collided with ship
        if pygame.sprite.spritecollideany(self.ship, self.aliens):
            # print("Ship is hit")
            self._ship_hit()

        # aliens shouldn't be allowed to reach the bottom
        self._check_aliens_bottom()


    def _update_screen(self):
        """Redraw the screen on each pass through main while loop."""

        self.screen.fill(self.settings.bg_color)
        self.ship.blitme()

        for bullet in self.bullets.sprites():
            bullet.draw_bullet()
        self.aliens.draw(self.screen)

        # then make the most recently drawn screen visible
        # draw empty screen on each pass through while loop
        pygame.display.flip()


# only run when file is called directly
if __name__ == '__main__':
    # make a game instance then run it
    ai = AlienInvasion()
    ai.run_game()
