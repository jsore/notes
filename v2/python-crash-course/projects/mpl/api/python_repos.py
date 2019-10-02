# automatically issue API calls to grab most starred Python
# projects on GitHub and process responses

import requests
import json


url = 'https://api.github.com/search/repositories?q=language:python&sort=stars'

# GitHub is on the 3rd version of its API, explicity ask for it
headers = {'Accept': 'application/vnd.github.v3+json'}

# the call
r = requests.get(url, headers=headers)

# storing the response as a dictionary
response_dict = r.json()

print(f"\nStatus code: {r.status_code}")
print(response_dict.keys())
# Status code: 200
# dict_keys(['total_count', 'incomplete_results', 'items'])


print('- ' * 10)

# all the Python repos on GH
print(f"Total repos: {response_dict['total_count']}")

# this is a list of dictionaries, each a Python repo
repo_dicts = response_dict['items']
# print(json.dump(repo_dicts))
print(f"Repos returned: {len(repo_dicts)}")

print('- ' * 10)

# info available in each repo's dict
repo_dict = repo_dicts[0]
print(f"\nKeys in each repo dict: {len(repo_dict)}\nExample from one repo:\n")
keys = [key for key in sorted(repo_dict.keys())]  # list comprehension
print(keys)
# for key in sorted(repo_dict.keys()):
    # print(key)

print(f"\nArbitrary selections from each repo:\n")
for repo_dict in repo_dicts:
    print(f"\n  Name: {repo_dict['name']}  |"
          + f"  Owner: {repo_dict['owner']['login']}  |"
          + f"  Stars: {repo_dict['stargazers_count']}")
    print(f"  Repo: {repo_dict['html_url']}")
    # print(f"  Created: {repo_dict['created_at']}")
    # print(f"  Updated: {repo_dict['updated_at']}")
    print(f"  {repo_dict['description']}")

    # fail
    # print((lambda: "  No description provided.", lambda: f"  {repo_dict['description']}") [repo_dict['description'] == 'None'])
    #
    # print( (f"  No description provided.", f"  {repo_dict['description']}") [repo_dict['description'] == 'None'] )
