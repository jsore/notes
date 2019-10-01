import matplotlib.pyplot as plt

# manual list
# x_values = [1, 2, 3, 4, 5]
# y_values = [1, 4, 9, 16, 25]

# automatically generated list
x_values = range(1, 1001)
y_values = [x**2 for x in x_values]  # 'list comprehension'

plt.style.use('seaborn')
fig, ax = plt.subplots()

# x, y coordinates of point
# ax.scatter(x_values, y_values, s=10)

# or with a colormap, based on y value
ax.scatter(x_values, y_values, c=y_values, cmap=plt.cm.Blues, s=10)

ax.set_title("Square Numbers", fontsize=24)
ax.set_xlabel("Value", fontsize=14)
ax.set_ylabel("Square of Value", fontsize=14)
ax.tick_params(axis='both', which='major', labelsize=14)

# range for each axis using the list comprehension
ax.axis([0, 1100, 0, 1100000])

# plt.show()

plt.savefig('squares_plot.png', bbox_inches='tight')
