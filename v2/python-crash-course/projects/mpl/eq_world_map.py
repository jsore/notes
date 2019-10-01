import json

from plotly.graph_objs import Scattergeo, Layout
from plotly import offline


# exploring basic JSON structure
# filename = 'data/eq_data_1_day_m1.json'
filename = 'data/eq_data_30_day_m1.json'
with open(filename) as f:
    # store all our dataset
    all_eq_data = json.load(f)


# grab JSON as dictionaries
all_eq_dicts = all_eq_data['features']

# grab the data we want
mags, lons, lats, hover_texts = [], [], [], []
for eq_dict in all_eq_dicts:
    mag = eq_dict['properties']['mag']
    lon = eq_dict['geometry']['coordinates'][0]
    lat = eq_dict['geometry']['coordinates'][1]
    title = eq_dict['properties']['title']
    mags.append(mag)
    lons.append(lon)
    lats.append(lat)
    hover_texts.append(title)

# print(len(all_eq_dicts))
print(mags[:10])  # 1st 10
print(lons[:5])
print(lats[:5])


# readable_file = 'data/readable_eq_data.json'
# # take json data and write it to a file
# with open(readable_file, 'w') as f:
#     json.dump(all_eq_data, f, indent=4)


# map the earthquakes
# data = [Scattergeo(lon=lons, lat=lats)]
# more readable:
data = [{
    'type': 'scattergeo',
    'lon': lons,
    'lat': lats,
    'text': hover_texts,
    # want the size of the markers to grow based on severity
    'marker': {
        'size': [5*mag for mag in mags],  # list comprehension
        'color': mags,
        'colorscale': 'Magma',
        # 'colorscale': [[0,'rgb(0, 0, 0)'], [1,'rgb(33,113,181)']],
        'reversescale': False,
        'colorbar': {'title': 'Magnitude'},
    },
    # 'layout': {
    #     'landcolor': "rgb(229, 229, 229)",
    #     'countrycolor': "rgb(255, 255, 255)",
    #     'coastlinecolor': "rgb(255, 255, 255)",
    # },
}]
# data = [Scattergeo(lon=lons, lat=lats)]
my_layout = Layout(title='Global Earthquakes')
fig = {'data': data, 'layout': my_layout}

# render it
offline.plot(fig, filename='global_earthquakes.html')
