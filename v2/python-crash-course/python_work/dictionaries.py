# game where aliens can have different colors and point vals

# dictionary
alien_0 = {'color': 'green', 'points': 5}
# set
alien_2 = {'green', 'orange', 10}
print(alien_0['color'])   # green
print(alien_0['points'])  # 5


# get a value after a dictionary is defined
new_points = alien_0['points']
print(f"You got {new_points}")


# add new values
alien_0['x_position'] = 0
alien_0['y_position'] = 25
print(alien_0)


# modify values
alien_1 = {'x_pos': 0, 'y_pos': 25, 'speed': 'medium'}
print(f"Start pos: {alien_1['x_pos']}")
if alien_1['speed'] == 'slow':  # move the alien right
    x_increment = 1
elif alien_1['speed'] == 'medium':
    x_increment = 2
else:
    x_increment = 3
alien_1['x_pos'] = alien_1['x_pos'] + x_increment  # old+new
print(f"New pos: {alien_1['x_pos']}")


# delete values
del alien_1['x_pos']


# get values
print(alien_1)            # {'x_pos': 0, 'y_pos': 25, 'speed': 'medium'}
print(alien_1['points'])  # Traceback: KeyError 'points'

point_value = alien_1.get('points', 'Some default value')
print(point_value)        # Some default value

point_value = alien_1.get('points')  # no default argument
print(point_value)  # "None" ( "no value exists" )
