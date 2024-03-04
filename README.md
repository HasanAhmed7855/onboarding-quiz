# Purpose of this Project
This app was created as a way for new joiners of the team to confirm the knowledge they learnt duting their onboarding. Its a way to test out if they really did learn the content they were taught.

# Features of the app

Admin features:
- Admins of the app (potentially a senior of the team) would create quizzes with multiple-choice questions to ask the new onboarder.
- Admins can see all the quizzes they have made live on a dedicated page.
- Admins can update contents of the quiz even after quiz creation.
- Admins can delete quizzes if they dont want them to be taken by Regular users (new onboarders) anymore.

Regular user features:
- Regular users can register a new account with unique credentials if they don't already have one.
- Regular users can see all the quizzes avaliable for them to take on a dedicated page.
- Regular users can take a quiz, publish their answers, then get their score reported back to them.
- The regular users quiz score is saved in a database table if in the future there are plans to make this information visible to the users of the app.

# Dependencies
Production dependencies:
- Prisma Client
- Node.js
- Next.js
- Typescript
- React

Development dependencies:
- Jest
- React Test Library
- jest-fetch-mock
- Prisma


# Project Structure

## prisma/
    Contains all the files needed and used by the Prisma dependency.

    P.S Prisma is an ORM that links a database system with the ability to apply OOP principles.
<!--- CodeInstitute (no date) -->

## src/components/common
    Contains components that are shared between multiple pages.

## src/helperVarsAndFunctions
    Contains variables and functions that are used across multiple pages or areas of the code.

## src/pages
    Contains pages that the user can navigate to
    - The `pages/api/` directory is involved in the backend and handles fetch requests. Every other directory other than `pages/api/` directory are pages for the user to navigate to.

## src/styles
    Contains the CSS files used on the pages.

## src/tests
    Contains unit tests that test out the view and behaviour of the pages and their components.
## src/types
    Contains types that are shared between multiple pages.

# Database structure
`User` table:

|  Fields       | Types                                         |
| --------      | -------                                       |
| user_id       | Primary Key, Integer, Unique, Auto increment  |
| username      | Text, Unique                                  |
| password      | Text                                          |
| access_level  | Text (admin or regular)                       |

`Quiz` table:

|  Fields       | Types                                         |
| --------      | -------                                       |
| quiz_id       | Primary Key, Integer, Unique, Auto increment  |
| title         | Text                                          |

`Question` table:

|  Fields           | Types                                 |
| --------          | -------                               |
| question_id       | Primary Key, Integer, Auto increment  |
| question_text     | Text                                  |
| quiz_id           | Foreign Key, Integer                  |

`Answer` table:

|  Fields               | Types                                     |
| --------              | -------                                   |
| answer_id             | Primary Key, Integer, Auto increment      |
| answer_text           | Text                                      |
| is_correct_answer     | Integer (1 - true, 0 - false)             |
| question_id           | Foreign Key, Integer                      |

`User_To_Quiz_link` table:

|  Fields       | Types                                             |
| --------      | -------                                           |
| record_id     | Primary Key, Integer, Unique, Auto increment      |
| user_id       | Foreign Key, Integer                              |
| quiz_id       | Foreign Key, Integer                              |
| score         | Integer                                           |

# Setup instructions to run locally

1. Download all relevant files need to run the app
- Database file
- Project file (it's called `onboarding-quiz`)

2. Within the `onboarding-quiz` folder, locate the `env` file, then within the `env` file locate the `DATABASE_URL` variable, then change the the path to the where the `Database file` is located.

- P.S The `Database file` will be named `onboardingQuizDb.db`.

3. In a terminal, enter the `onboarding-quiz` directory, then run the command `npm run dev`

4. In a browser, direct to url `http://localhost:3000/`

5. You should now be able to interact with the app. Congrats!

# Reference list

CodeInstitute (no date) [online] Object Relational Mapping, Available from: https://codeinstitute.net/ie/blog/object-relational-mapping/ [Accessed 18/04/23]

Bastian Stein (2019) [online] How do i deal with localStorage in jest tests?, Available from: https://stackoverflow.com/questions/32911630/how-do-i-deal-with-localstorage-in-jest-tests [Accessed 18/04/23]

ghiscoding (2019) [online] How to reset or clear a spy in Jest?, Available from: https://stackoverflow.com/questions/53350382/how-to-reset-or-clear-a-spy-in-jest [Accessed 18/04/23]

Estus Flask (2018) [online] How can i mock the window.alert method in jest?, Avaliable from: https://stackoverflow.com/questions/53611098/how-can-i-mock-the-window-alert-method-in-jest [Accessed 18/04/2023]

Sam (2019) [online] How do you test for the non-existence of an element using jest and react-testing-library?, Avaliable from: https://stackoverflow.com/questions/52783144/how-do-you-test-for-the-non-existence-of-an-element-using-jest-and-react-testing [Accessed 18/04/23]

Prisma docs (no date) [online] Transactions and batch queries, Avaliable from: https://www.prisma.io/docs/concepts/components/prisma-client/transactions [Accessed 18/04/23]

Prisma docs (no date) [online] CRUD, Avaliable from: https://www.prisma.io/docs/concepts/components/prisma-client/crud [Accessed 18/04/23]

npm (2020) [online] Jest Fetch Mock, Avaliable from: https://www.npmjs.com/package/jest-fetch-mock [Accessed 18/04/23]