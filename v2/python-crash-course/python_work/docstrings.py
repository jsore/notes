# https://www.geeksforgeeks.org/python-docstrings/

def some_function():
    """this is a dosctring that describes some_function"""
    print('look at the docstring')
    return None

print(some_function.__doc__)

print("using help instead:")
#help(some_function)
#help(some_class)  # to access Class docstrings
#help(some_class.a_class_method)  # to access a method on the class
