# roll a D6, print the results and sanity check the results

from plotly.graph_objs import Bar, Layout
from plotly import offline

from die import Die


# create a D6, make some rolls and store them
die = Die()
results = []
for roll_num in range(1000):
    result = die.roll()
    results.append(result)


# analyze results
frequencies = []
for value in range(1, die.num_sides+1):
    frequency = results.count(value)
    # frequencies.append(f"{value}'s: {frequency}")
    frequencies.append(frequency)


# visualize the results
# Plotly doesn't accept range results directly, explicitly
# convert it to a list first
x_values = list(range(1, die.num_sides+1))
data = [Bar(x=x_values, y=frequencies)]
x_axis_config = {'title': 'Result'}
y_axis_config = {'title': 'Frequency of Result'}
my_layout = Layout(title='Results of rolling one D6 1,000 times',
                   xaxis=x_axis_config, yaxis=y_axis_config)
offline.plot({'data': data, 'layout': my_layout}, filename='d6.html')


# print(frequencies)
