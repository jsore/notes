# simple calculator for division

print("Give me two numbers to divide.")
print("Enter 'q' to quit")

while True:

    first_number = input("\nFirst number: ")
    if first_number == 'q':
        break

    second_number = input("Second: ")
    if second_number == 'q':
        break

    try:
        answer = int(first_number) / int(second_number)
    except ZeroDivisionError:
        print("You can't divide by 0")
    else:
        print(answer)


