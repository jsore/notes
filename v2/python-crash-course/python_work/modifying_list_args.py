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

# $ python modifying_list_args.py
#
#   Printing: dodecahedron
#   Printing: robot pendant
#   Printing: phone case
#
#   The following models have been printed:
#   dodecahedron
#   robot pendant
#   phone case
