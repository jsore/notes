import csv
from datetime import datetime

import matplotlib.pyplot as plt

from quit import Quit


filename = 'data/death_valley_2018_simple.csv'
with open(filename) as f:
    reader = csv.reader(f)
    header_row = next(reader)

    for index, column_header in enumerate(header_row):
        print(index, column_header)

    dates, highs, lows = [], [], []

    for row in reader:
        # the date string and how it's currently formatted
        current_date = datetime.strptime(row[2], '%Y-%m-%d')
        # watch for errors
        try:
            high = int(row[4])
            low = int(row[5])
        except ValueError:
            print(f"Missing data for {current_date}")
        else:
            dates.append(current_date)
            highs.append(high)
            lows.append(low)


# plot the temps
plt.style.use('seaborn')
fig, ax = plt.subplots()
ax.plot(dates, highs, c='red', alpha=0.5)
ax.plot(dates, lows, c='blue', alpha=0.5)
plt.fill_between(dates, highs, lows, facecolor='blue', alpha=0.1)

title = "Daily high & low tempatures - 2018\nDeath Valley CA"
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
