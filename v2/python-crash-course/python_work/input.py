# basic syntax
message = input('This is a prompt the user sees, awaiting input: ')
print(f"\nYou entered: {message}")  # the input gets stored in message var



##
# build a prompt over several lines
##
prompt = "Part of a message"
prompt += "\nAnother part, feed me input: "
name = input(prompt)
print(f"\nYour input: '{name}'")



##
# string -> int conversion for working with inputted numbers
##
age = input("How old are you? ")  # 28
age >= 18  # > Traceback: TypeError: unorderable types
age = int(age)
age >= 18  # True



##
# modulo for seeing if number even or odd
##
number = input("Enter a number, I'll check if it's odd: ")
number = int(number)

if number % 2 == 0:
    print(f"\nNumber {number} is even")
else:
    print(f"\nNumber {number} is odd")



##
# basic while loop syntax
##
current_number = 1
while current_number <= 5:  # counts 1 -> 5
    print(current_number)
    current_number += 1



##
# keep program running until quit value received
##
prompt = "\nWhat do you want me to repeat? "
prompt += "Input 'quit' to end program "

# keep track of what user enters
message = ""
while message != 'quit':
    message = input(prompt)
    # don't display the exit value
    if message != 'quit':
        print(message)



##
# using flags for program state
##
prompt = "\nWhat do you want me to repeat? "
prompt += "Input 'quit' to end program "

active = True  # the flag
while active:
    message = input(prompt)
    if message == 'quit':
        active = False
    else:
        print(message)



##
# break statements for flow control
##
prompt = "\nEnter a city name "
prompt += "Input 'quit' to end program: "

while True:
    city = input(prompt)
    if city == 'quit':
        break
    else:
        print(f"You entered '{city.title()}'")



##
# continue to return to beginning of loop
##
current_number = 0
while current_number < 10:
    current_number += 1
    # is it divisible by 2?
    if current_number % 2 == 0:
        # yes, so restart loop
        continue
    # else print the number
    print(current_number)



##
# move items from one list to another
##
confirmed_users = []
# users that need to be verified
unconfirmed_users = ['alice', 'brian', 'candace']
# verify each until no more and move them
while unconfirmed_users:
    current_user = unconfirmed_users.pop()
    print(f"Verifying user '{current_user.title()}'")
    confirmed_users.append(current_user)

# display the confirmed users
print("\nUsers that have been confirmed:")
for confirmed_user in confirmed_users:
    print(confirmed_user.title())



##
# remove all instances of something from a list
##
pets = ['dog', 'cat', 'dog', 'goldfish', 'cat', 'rabbit', 'cat']
print(pets)
while 'cats' in pets:
    pets.remove('cat')  # removes 1st found instance only
print(pets)



##
# fill dictionary with user input
##
responses = {}
polling_active = True  # a flag

while polling_active:

    # prompt name and response
    name = input("\nWhat's your name? ")
    response = input("What kind of animals do you like? ")

    # store it into the dictionary
    responses[name] = response

    repeat = input('Any other poll-takers? (yes/no) ')
    if repeat = 'no':
        polling_active = False

# polling complete, show results
print("\n---  Poll Results  ---")
for name, response in responses.items():
    print(f"{name} is a {response} person")
