# looping
user_0 = {
    'username': 'jsorensen',
    'first': 'justin',
    'last': 'sorensen',
}
favorite_languages = {
    'jen': 'python',
    'sarah': 'c',
    'edward': 'ruby',
    'phil': 'python',
}


# items() returns list of key/values
for key, value in user_0.items():
    # 'key' and 'value' can be any arbitrary name
    print(f"\nKey: {key}")
    print(f"Value: {value}")


# looping keys only
for data in user_0.keys():
    do something


# loop with keys() with conditionals
friends = ['phil', 'sarah']
for name in favorite_languages.keys():
    print(f"Hi {name.title()}.")
    if name in friends:
        language = favorite_languages[name].title()
        print(f"\t{name.title()}, your favorite language is {language}")
    if 'erin' not in favorite_languages.keys():
        print("Please finish survey")
    # Hi Jen.
    # Hi Sarah.
    #     Sarah, your favorite language is C
    # Hi Edward.
    # Hi Phil.
    #     Phil, your favorite language is Python
