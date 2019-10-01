# roll a D6, print the results and sanity check the results

from plotly.graph_objs import Bar, Layout
from plotly import offline

from die import Die


# create two D6 dice, make some rolls and store them
die_1 = Die()
# die_2 = Die()
# a 10 sided die
die_2 = Die(10)
results = []
# for roll_num in range(1000):
for roll_num in range(50_000):
    result = die_1.roll() + die_2.roll()
    results.append(result)


# analyze results
frequencies = []
max_result = die_1.num_sides + die_2.num_sides
# for value in range(2, max_result+1):
#     frequency = results.count(value)
#     frequencies.append(frequency)
#
# or, using a list comprehension of my design:
frequencies = [results.count(value) for value in range(2, max_result+1)]
# print(frequencies)

# visualize the results
# Plotly doesn't accept range results directly, explicitly
# convert it to a list first
x_values = list(range(2, max_result+1))
data = [Bar(x=x_values, y=frequencies)]
x_axis_config = {'title': 'Result', 'dtick': 1}
y_axis_config = {'title': 'Frequency of Result'}
# my_layout = Layout(title='Results of rolling two D6 dice 1,000 times',
my_layout = Layout(title='Results of rolling a D6 and D10 50,000 times',
                   xaxis=x_axis_config, yaxis=y_axis_config)
offline.plot({'data': data, 'layout': my_layout}, filename='d6_d10.html')


# print(frequencies)
