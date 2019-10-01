# simple line graph
import matplotlib.pyplot as plt

input_values = [1, 2, 3, 4, 5]
squares = [1, 4, 9, 16, 25]  # 1 -> 5 squared

plt.style.use('seaborn')

# fig represents entire figure or collection of plots
# ax represents a single plot in the figure
fig, ax = plt.subplots()

# start the ticks on x-axis at 1 isntead of 0
ax.plot(input_values, squares, linewidth=3)

# chart title and label ax'es
ax.set_title("Square Numbers", fontsize=24)
ax.set_xlabel("Value", fontsize=14)
ax.set_ylabel("Square of Value", fontsize=14)
ax.tick_params(axis='both', labelsize=14)

# open Matplotlib's viewer
plt.show()
