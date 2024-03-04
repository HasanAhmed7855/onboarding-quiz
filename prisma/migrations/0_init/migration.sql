-- CreateTable
CREATE TABLE "Answer" (
    "answer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "answer_text" TEXT NOT NULL,
    "is_correct_answer" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    CONSTRAINT "Answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question" ("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Question" (
    "question_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question_text" TEXT NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    CONSTRAINT "Question_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz" ("quiz_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "Quiz" (
    "quiz_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "access_level" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User_To_Quiz_Link" (
    "user_id" INTEGER NOT NULL,
    "quiz_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    CONSTRAINT "User_To_Quiz_Link_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "User_To_Quiz_Link_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz" ("quiz_id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_Quiz_1" ON "Quiz"("quiz_id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_User_1" ON "User"("user_id");
Pragma writable_schema=0;

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_User_2" ON "User"("username");
Pragma writable_schema=0;

