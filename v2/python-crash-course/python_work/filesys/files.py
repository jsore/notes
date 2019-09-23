##
# read an entire file, basic syntax
##
filename = 'file.txt'

# read a file into memory
with open(filename) as file_object:
    contents = file_object.read()

print(contents)


# or, to strip the newline and whitespace Python adds
print(contents.rstrip())



##
# read line by line
##
filename = 'file.txt'
with open(filename) as file_object:
    for line in file_object:
        print(line)



##
# use a list to access file contents outside of with block
##
with open(filename) as file_object:
    # take each line from file and store it in a list
    lines = file_object.readlines()

for line in lines:
    print(line.rstrip())



##
# concat a list of strings into a single string
##
with open(filename) as file_object:
    # three lines, composing pi to 30 digits
    lines = file_object.readlines()

pi_string = ''
for line in lines:
    pi_string += line.strip()

print(pi_string)
print(len(pi_string))  # 32 ( 30 digits + '3.' )



##
# open() modes
##
with open(filename, 'mode_char') as file_object:
    file_object.write("Something to add to file")

'w' = 'write'  # overwrites any existing file
'r' = 'read'   # default mode
'a' = 'append'
'r+' = 'read+write'


##
#
##



##
#
##



##
#
##



##
#
##



##
#
##



##
#
##



##
#
##



##
#
##



##
#
##



##
#
##



##
#
##
