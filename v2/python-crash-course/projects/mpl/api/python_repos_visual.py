# automatically issue API calls to grab most starred Python
# projects on GitHub and process responses, then graph it all

import requests

from plotly.graph_objs import Bar
from plotly import offline


url = 'https://api.github.com/search/repositories?q=language:python&sort=stars'

# GitHub is on the 3rd version of its API, explicity ask for it
headers = {'Accept': 'application/vnd.github.v3+json'}

# the call & storing the response as a dictionary
r = requests.get(url, headers=headers)
response_dict = r.json()


repo_dicts = response_dict['items']  # list of dictionaries of Python repos
print(f"\nStatus code: {r.status_code}")
print(f"Total repos: {response_dict['total_count']}")  # all Python repos
print(f"Repos returned: {len(repo_dicts)}")

# info available in each repo's dict
repo_links, stars, labels = [], [], []
# repo_dict = repo_dicts[0]
# print(f"\nKeys in each repo dict: {len(repo_dict)}\nExample from one repo:\n")
# keys = [key for key in sorted(repo_dict.keys())]  # list comprehension
# print(keys)


# visualize the repos instead of printing ala python_repos.py
for repo_dict in repo_dicts:

    repo_name = repo_dict['name']

    repo_url = repo_dict['html_url']
    repo_link = f"<a href='{repo_url}'>{repo_name}</a>"
    repo_links.append(repo_link)

    stars.append(repo_dict['stargazers_count'])
    owner = repo_dict['owner']['login']
    description = repo_dict['description']

    label = f"{owner}<br />{description}"
    labels.append(label)

# define the bars
data = [{
    'type': 'bar',
    'x': repo_links,
    'y': stars,
    'hovertext': labels,
    'marker': {
        'color': 'rgb(60, 100, 150)',
        'line': {'width': 1.5, 'color': 'rgb(25, 25, 25)'}
    },
    'opacity': 0.6,
}]

x_title = f"<span style='margin-top: 100px;'>Repository</span>"

# define overall layout
my_layout = {
    'title': 'Most-Starred Python Projects on GitHub',
    'titlefont': {'size': 28},
    'xaxis': {
        'title': x_title,
        'titlefont': {'size': 24},
        'tickfont': {'size': 14},
        'tickangle': 45,
    },
    'yaxis': {
        'title': 'Stars',
        'titlefont': {'size': 24},
        'tickfont': {'size': 14},
    },
}

fig = {'data': data, 'layout': my_layout}
offline.plot(fig, filename='python_repos.html')
