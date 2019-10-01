import json


# exploring basic JSON structure
filename = 'data/eq_data_1_day_m1.json'
with open(filename) as f:
    # store all our dataset
    all_eq_data = json.load(f)
    # {
    #     "type": ... ,
    #     "metadata": { ... },
    #     "features": [
    #         {                             <-- individual earthquak
    #             "type": ... ,
    #             "properties": {
    #                 "mag": ...,           <--
    #                 ...
    #             },
    #             "geometry": {
    #                 "type": ...,
    #                 "coordinates": [      <--


# grab JSON as dictionaries
all_eq_dicts = all_eq_data['features']

# grab the data we want
mags, lons, lats = [], [], []
for eq_dict in all_eq_dicts:
    mag = eq_dict['properties']['mag']
    lon = eq_dict['geometry']['coordinates'][0]
    lat = eq_dict['geometry']['coordinates'][1]
    mags.append(mag)
    lons.append(lon)
    lats.append(lat)

# print(len(all_eq_dicts))
print(mags[:10])  # 1st 10
print(lons[:5])
print(lats[:5])


readable_file = 'data/readable_eq_data.json'
# take json data and write it to a file
with open(readable_file, 'w') as f:
    json.dump(all_eq_data, f, indent=4)
