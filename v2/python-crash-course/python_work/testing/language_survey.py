# example for test cases on classes

from survey import AnonymousSurvey

# define a question and turn it into a survey
question = "What language did you first learn to speak?"
my_survey = AnonymousSurvey(question)

# show the question and store its response
my_survey.show_question()
print('Enter "q" at any time to quit\n')
while True:
    response = input('Language: ')
    if response == 'q':
        break
    my_survey.store_response(response)

# show survey's results
print('\nThanks for participating!')
my_survey.show_results()
