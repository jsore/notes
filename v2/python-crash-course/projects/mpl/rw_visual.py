# plot points in a random walk

import sys

import matplotlib.pyplot as plt

from random_walk import RandomWalk


def quit(event):
    if event.key == 'q':
        print("Graph closed by user.")
        plt.close('all')
        print("Press 'y' to close the program completely.")
        flag = False

    if event.key == 'y':
        print("Closing program.")
        sys.exit()


flag = True

# make the random walks as long as the program is active
while flag:

    # increase data points
    rw = RandomWalk(50_000)
    rw.fill_walk()

    # fill the points in the walk
    plt.style.use('classic')
    fig, ax = plt.subplots()

    # ax.scatter(rw.x_values, rw.y_values, s=15)
    # with styles, emphasize walk positions
    point_numbers = range(rw.num_points)
    ax.scatter(rw.x_values, rw.y_values, c=point_numbers, cmap=plt.cm.Blues,
               edgecolors='none', s=1)

    # emphasize start and end points
    ax.scatter(0, 0, c='green', edgecolors='none', s=100)
    ax.scatter(rw.x_values[-1], rw.y_values[-1], c='red', edgecolors='none',
               s=100)

    # remove axes
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)

    # connect to the event manager and hit a callback on keypress
    fig.canvas.mpl_connect('key_press_event', quit)
    plt.show()
    fig.canvas.mpl_connect('key_press_event', quit)


