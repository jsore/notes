# trending articles from Hacker News

from operator import itemgetter

import requests


url = 'https://hacker-news.firebaseio.com/v0/topstories.json'
r = requests.get(url)
print(f"Status code: {r.status_code}")


# process infor about submissions
# store response object of article IDs as Python list
submission_ids = r.json()
# placeholder for articles as dictionaries
submission_dicts = []

for submission_id in submission_ids[:30]:

    try:
        # each submission gets it's own API call
        url = f"https://hacker-news.firebaseio.com/v0/item/{submission_id}.json"
        r = requests.get(url)
        print(f"id: {submission_id}\tstatus: {r.status_code}")
        response_dict = r.json()

        # each submission gets it's own dictionary
        submission_dict = {
            'title': response_dict['title'],
            'hn_link': f"http://news.ycombinator.com/item?id={submission_id}",
            'comments': response_dict['descendants'],
        }

    except KeyError:
        print(f"Failure: Article {submission_id} is missing data.")
    else:
        submission_dicts.append(submission_dict)

# itemgetter pulls value of what it gets passed from every
# dictionary in the sorted() list
submission_dicts = sorted(submission_dicts, key=itemgetter('comments'),
                          reverse=True)


for submission_dict in submission_dicts:
    print(f"\nTitle: {submission_dict['title']}")
    print(f"Discussion link: {submission_dict['hn_link']}")
    print(f"Comments: {submission_dict['comments']}")
