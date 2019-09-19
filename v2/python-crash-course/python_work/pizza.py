def make_pizza(size, *toppings):
    """
    Summarize the pizza we're about to make.
    """
    print(f"\nMaking a {size}-inch pizza with:")
    for topping in toppings:
        print(f"- {topping}")
