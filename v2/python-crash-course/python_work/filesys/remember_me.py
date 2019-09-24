# basic json manipulation

# load a username if one has been stored previously or
# prompt for one and store it
import json


def get_stored_username():
    """Get stored username if available."""
    filename = 'username.json'

    try:
        with open(filename) as f:
            username = json.load(f)
    except FileNotFoundError:
        return None
    else:
        return username


def get_new_username():
    """Prompt for a new username."""
    username = input("Feed me a name: ")
    filename = 'username.json'

    with open(filename, 'w') as f:
        json.dump(username, f)

    return username


def verify_user(username):
    while True:
        """Confirm the user's identity."""
        confirmed = input(f"Is your username {username.title()}? (y or n) ")

        if confirmed == 'y':
            return confirmed
        elif confirmed == 'n':
            username = None
            greet_user(username)
            break
        else:
            print("Invalid input")
            continue


def greet_user(username):
    """Greet the user by name."""
    if username:
        validated = verify_user(username)
        if validated:
            print(f"Welcome back {username.title()}")
    else:
        username = get_new_username()
        print(f"Stored, thanks {username.title()}")


username = get_stored_username()
greet_user(username)

