
# ['charles', 'martina', 'michael', 'florence', 'eli']

some_list[0:3]  # returns items 0, 1, 2
some_list[1:4]  # returns items 1, 2, 3

# left-right, start slicing from index X
some_list[:4]   # returns items 0, 1, 2, 3

# right-left, start slicing from index X
some_list[2:]   # returns all from 3rd item from right to start of list
some_list[-3:]  # returns last 3


# associations
new_list = some_list[:]       # copies entire list
new_list.append('some item')  # lists stay different
some_list.append('other item')

new_list = some_list  # reference to same some_list val, they're 'linked'


# looping slices
for player in players[:3]:
    print(player.title())  # first three players only
