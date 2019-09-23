# open a file, read it, print contents

filename = 'pi_digits.txt'

with open(filename) as file_object:
    contents = file_object.read()

print(contents.rstrip())
