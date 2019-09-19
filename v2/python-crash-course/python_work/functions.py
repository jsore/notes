##
# basic syntax
##
def greet_user():  # the definition

    # Docstring descriptions to make functions documentation
    """Display a simple greeting"""

    print('Hi')    # inside the function body

greet_user()       # function call



##
# with parameters and arguments
##
def greet_user(username):  # param: function needs this to work

    print(f"Hi {username.title()}")

greet_user('jesse')        # arg: passed function call -> func



##
# passing POSITIONAL args
#
# based on order of arguments
##
def describe_pet(animal_type, pet_name):
    """Display info about a pet"""
    print(f"\nI have a {animal_type}")
    print(f"My {animal_type}'s name is {pet_name.title()}")

# arguments get worked through in order and matched to the
# parameter at the same position in the function's definition
describe_pet('cat', 'sushi')
describe_pet('dog', 'stella')



##
# passing KEYWORD args
#
# name-value pairs, arg order doesn't matter, name and value
# are directly associated with the argument
##
...
describe_pet(animal_type='hamster', pet_name='harry')



##
# with default values
##
def describe_pet(pet_name, animal_type='dog')
    # defaults to dog if 2nd param not received
...
# args positional
describe_pet(pet_name='willie')
# willie is a dog
describe_pet('sushi', animal_type='cat')
# sushi is a cat



##
# returning values
##
def get_formatted_name(first_name, last_name):
    """Return a formatted name"""
    full_name = f"{first_name} {last_name}"
    return full_name.title()

musician = get_formatted_name('jimi', 'hendrix')
print(musician) # Jimi Hendrix



##
# optional arguments
##
def get_formatted_name(first_name, last_name, middle_name=''):
    if middle_name:
        full_name = f"{first_name} {middle_name} {last_name}"
    else:
        full_name = f"{first_name} {last_name}"
    return full_name.title()
musician = get_formatted_name('justin', 'sorensen')
print(musician)
musician = get_formatted_names('john', 'carter', 'lee')
print(musician)



##
# none keyword
##
def build_person(first_name, last_name, age=None):
    person = {'first': first_name, 'last': last_name}
    if age:
        person['age'] = age
    return person.title()
musician = build_person('justin', 'sorensen', age=28)
print(musician)
# {'first': 'justin', 'last': 'sorensen', 'age': 28}



##
# modifying list argument values
#
# modifying_list_args.py
##
def print_models(unprinted_designs, completed_models):
    """
    Simulate printing each design until none left.
    Move each design to completed_models after printing.
    """
    print("\n")
    while unprinted_designs:
        # remove and store last list item
        current_design = unprinted_designs.pop()
        print(f"Printing: {current_design}")
        # move to a new list for finished items
        completed_models.append(current_design)

def show_completed_models(completed_models):
    """
    Show all the models that were printed.
    """
    print("\nThe following models have been printed:")
    for completed_model in completed_models:
        print(completed_model)

# 3d models to be printed
unprinted_designs = ['phone case', 'robot pendant', 'dodecahedron']
completed_models = []

print_models(unprinted_designs, completed_models)
show_completed_models(completed_models)



##
# preserving originals by passing arg copies with slice
#
# this is less efficient than sending originals
##
...
# slice, we don't want to empty the original anymore
print_models(unprinted_designs[:], completed_models)



##
# arbitrary number of args
#
# ( tuple, "*args, arbitrary positional arguments" )
#
# *parameter_name makes Python create an empty tuple and
# gives it whatever value(s) it receives
##
def make_pizza(*toppings):  # note: positional param
    """
    Print the list of all ('toppings') requested
    """
    print("\nOn this pizza is:")
    for topping in toppings:
        print(f"- {topping}")

make_pizza('pepperoni')
make_pizza('mushrooms', 'green peppers', 'extra cheese')
# On this pizza is:
# - pepperoni
# On this pizza is:
# - mushrooms
# - green peppers
# - extra cheese


##
# arbitrary number of args
#
# ( dictionary, "**kwargs, non-specific keyword arguments" )
##
def build_profile(first, last, **user_info):
    """
    Build a dictionary containing everything we know about
    a user. We don't know ahead of time what kind of info
    the caller will send us other than a name.
    """
    user_info['first_name'] = first
    user_info['last_name'] = last
    return user_info

user_profile = build_profile('justin',
                             'sorensen',
                             age=28,
                             job_title='Abuse Analyst')
print(user_profile)
# {'first': 'justin', 'last': 'sorensen',
# 'age': 28, 'job_title': 'Abuse Analyst'}



##
# importing module files
##

# making_pizzas.py
import pizza
# code from pizza.py is being copied behind scenes before
# program runs

pizza.make_pizza(16, 'pepperoni')
pizza.make_pizza(12, 'mushrooms', 'onions', 'green peppers')

# pizza.py
def make_pizza(size, *toppings):
    """
    Summarize the pizza we're about to make.
    """
    print(f"\nMaking a {size}-inch pizza with:")
    for topping in toppings:
        print(f"- {topping}")


##
# other methods of importing
##

# import specific functions
from module_name import function_name
from module_name import function_0, function_1, function_2

# with a function alias
from module_name import function_name as fn
fn(args)

# with a module alias
import module_name as m
m.some_function(args)

# all the functions
from module_name import *
# access the functions imported by name directly
some_imported_function(args)
some_other_imported_function(args)
# not usually ideal, namespace clashes possible


##
# PEP 8: 79char width max, other style conventions
##
def some_long_function_with_many_parameters(
        param_1, param_2, param_3,
        param_4, param_5, param_6):

    function body indented once, params twice to separate...
