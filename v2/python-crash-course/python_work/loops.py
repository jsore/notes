items = ['val1', 'val2', 'val3']

# basic syntax
for item in items:
    print(item)  # don't forget Python loves whitespace

print('this is outside the loop')


# ranges
for value in range(1, 5):
    print(value)
# 1
# 2
# 3
# 4


# list from ranges
numbers = list(range(1, 6))  # [1, 2, 3, 4, 5]


# set step size for skipping numbers in range
even_numbers = list(range(2, 11))     # 2, 3, ... 10
even_numbers = list(range(2, 11, 2))  # adds 2: [2, 4, 6, 8, 10]


# squaring integers in a range
squares = []
for value in range(1, 11):    # square ints 1-10
    # square = value ** 2     # two asterisks represent exponents
    # squares.append(square)

    # or...
    squares.append(value**2)

# ...or, just:
squares = [value**2 for value in range(1, 11)]

print(squares)  # [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]


