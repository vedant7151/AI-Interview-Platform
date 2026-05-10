import { pgEnum, pgTable, varchar } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelper";
import { Users } from "./user";
import { relations } from "drizzle-orm";
import { InterviewTable } from "./interview";
import { QuestionsTable } from "./questions";

export const experienceLevels = ["junior", "mid-level", "senior"] as const
export type ExperienceLevel = typeof experienceLevels[number]
export const experienceLevlEnum = pgEnum("job_infos_experience_level", experienceLevels)

export const JobInfoTable = pgTable("job_info", {
    id,
    title: varchar(),
    name: varchar().notNull(),
    experienceLevel: experienceLevlEnum().notNull(),
    description: varchar().notNull(),
    userId: varchar().references(() => Users.id, { onDelete: "cascade", onUpdate: "cascade" }).notNull(),
    createdAt,
    updatedAt
})

export const JobInfoRelations = relations(JobInfoTable, ({ one, many }) => ({
    user: one(Users, {
        fields: [JobInfoTable.userId],
        references: [Users.id]
    }),
    interviews: many(InterviewTable),
    questions: many(QuestionsTable)
}))
