# print pi to a million digits

filename = 'pi_million_digits.txt'

with open(filename) as file_object:
    lines = file_object.readlines()

pi_string = ''
for line in lines:
    pi_string += line.strip()

print(f"{pi_string[:52]}...")
print(len(pi_string))


# does my birthday appear anywhwere in pi
birthday = input("Enter your birthday, mmddyy: ")
if birthday in pi_string:
    print("Contained in the first million digits")
else:
    print("Not found in the first million digits")
