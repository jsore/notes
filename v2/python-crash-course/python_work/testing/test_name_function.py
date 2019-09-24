import unittest

# function we want to test
from name_function import get_formatted_name

# create class inheriting fromm unittest.TestCase
class NamesTestCase(unittest.TestCase):
    """Methods that test 'name_function.py"""

    def test_first_last_name(self):
        """Do names like 'Janis Joplin' ( First Last )work?"""

        # call the function we want to test
        formatted_name = get_formatted_name('janis', 'joplin')
        self.assertEqual(formatted_name, 'Janis Joplin')

    def test_first_last_middle_name(self):
        """Do names like 'First Middle Last' work?"""
        formatted_name = get_formatted_name(
            'justin', 'sorensen', 'alan')
        self.assertEqual(formatted_name, 'Justin Alan Sorensen')

# won't get executed if using a framework, __name__ will not
# be set __main__
if __name__ == '__main__':
    unittest.main()
