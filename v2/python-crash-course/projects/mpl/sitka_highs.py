import csv
from datetime import datetime

import matplotlib.pyplot as plt

from quit import Quit


# filename = 'data/sitka_weather_07-2018_simple.csv'
filename = 'data/sitka_weather_2018_simple.csv'
with open(filename) as f:

    # assign reader object/method to reader
    reader = csv.reader(f)

    # at 1st run through this call next() will return the
    # next line to be read by reader, which is technically
    # the first line of the file
    header_row = next(reader)
    # print(header_row)
    # ['STATION', 'NAME', 'DATE', 'PRCP', 'TAVG', 'TMAX', 'TMIN']

    # print each header and its pos in the list
    # enumerate() returns index and value of each looped item
    # for index, column_header in enumerate(header_row):
    #     print(index, column_header)
        # 0 STATION
        # 1 NAME
        # 2 DATE  <-- we want this
        # 3 PRCP
        # 4 TAVG
        # 5 TMAX  <-- we want this too
        # 6 TMIN


    # reader() object will continue from where it last was
    # which means we're starting back up from the 2nd row
    # after the call to next()


    # high & low temps and dates
    dates, highs, lows = [], [], []

    for row in reader:
        # the date string and how it's currently formatted
        current_date = datetime.strptime(row[2], '%Y-%m-%d')

        try:
            high = int(row[5])
            low = int(row[6])
        except ValueError:
            print(f"Missing data for {current_date}")
        else:
            dates.append(current_date)
            highs.append(high)
            lows.append(low)


# print(highs)


# plot the temps
plt.style.use('seaborn')
fig, ax = plt.subplots()
ax.plot(dates, highs, c='red', alpha=0.5)
ax.plot(dates, lows, c='blue', alpha=0.5)
plt.fill_between(dates, highs, lows, facecolor='blue', alpha=0.1)

# plt.title("Daily high & low tempatures - 2018", fontsize=24)
title = "Daily high & low tempatures - 2018\nSitka AK"
plt.title(title, fontsize=20)
plt.xlabel('', fontsize=16)
# fix how date text is drawn on chart
fig.autofmt_xdate()
plt.ylabel("Temperature (F)", fontsize=16)
plt.tick_params(axis='both', which='major', labelsize=16)

quit = Quit()
fig.canvas.mpl_connect('key_press_event', quit.process)
print("Press 'q' to exit")

plt.show()
