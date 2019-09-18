# use plurals for names
bicycles = ['trek', 'cannondale', 'redline', 'specialized']

print(bicycles)  # ['trek', 'cannondale', 'redline', 'specialized']

print(bicycles[1].title())  # Cannondale

print(bicycles[-1])  # specialized
print(bicycles[-3])  # cannondale


# also works like JS string literals for Python 3.6+
message = f"My first bike was a {bicycles[3].title()}"
print(message)  # My first bike was a Specialized


# adding to lists
bicycles.append('huffy')  # ['trek', 'cannondale', 'redline', 'specialized', 'huffy']

bikes = []
bikes.append('honda')   # ['honda']
bikes.append('yamaha')  # ['honda', 'yamaha']
bikes.append('suzuki')  # ['honda', 'yamaha', 'suzuki']

bikes.insert(1, 'ducati')  # ['honda', 'ducati', 'yamaha', 'suzuki']


# removing from lists
del bikes[0]  # ['ducati', 'yamaha', 'suzuki']


# popping off the stack ( last item is top of stack )
print(bikes)              # ['ducati', 'yamaha', 'suzuki']
less_bikes = bikes.pop()
print(bikes)              # ['ducati', 'yamaha']
print(less_bikes)         # suzuki
my_first = bikes.pop(1)
print(bikes)              # ['ducati']
print(my_first)           # yamaha


# removing by value
print(bikes)                      # ['ducati', 'yamaha', 'suzuki']
removed = bikes.remove('yamaha')  # deletes only 1st ocurrence of value
print(bikes)                      # ['ducati', 'suzuki']
print(removed)                    # yamaha


# sorting
print(bikes)                      # ['ducati', 'yamaha', 'suzuki']

bikes.sort()              # a-zA-Z, immutable
bikes.sort(reverse=True)  # z-aZ-A, immutable

print(bikes.sorted)  # original stays the same

bikes.reverse()  # reverses the order, call again to revert


# return length
len(bikes)  # 3
