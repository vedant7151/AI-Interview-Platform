import { pgEnum, pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelper";
import { Users } from "./user";
import { relations } from "drizzle-orm";
import { JobInfoTable } from "./jobInfo";


export const questionDifficulties = ["easy", "medium", "hard"] as const
export type QuestionDifficulty = typeof questionDifficulties[number]
export const questionDifficultyEnum = pgEnum("questions_difficulty", questionDifficulties)
export const QuestionsTable = pgTable("questions", {
    id,
    jobInfoId: uuid().references(() => JobInfoTable.id, { onDelete: "cascade" }).notNull(),
    text: varchar().notNull(),
    difficulty: questionDifficultyEnum().notNull(),
    createdAt,
    updatedAt
})

export const QuestionRelations = relations(QuestionsTable, ({ one }) => ({
    jobInfo: one(JobInfoTable, {
        fields: [QuestionsTable.jobInfoId],
        references: [JobInfoTable.id]
    })
}))
