import { pgEnum, pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelper";
import { JobInfoTable } from "./jobInfo";
import { relations } from "drizzle-orm";

export const InterviewTable = pgTable("interviews", {
    id,
    jobInfoId: uuid().references(() => JobInfoTable.id, { onDelete: "cascade" }).notNull(),
    duration: varchar().notNull(),
    humanChatid: varchar(),
    feedback: varchar(),
    createdAt,
    updatedAt
})

export const InterviewRelations = relations(InterviewTable, ({ one }) => ({
    jobInfo: one(JobInfoTable, {
        fields: [InterviewTable.jobInfoId],
        references: [JobInfoTable.id]
    })
})) 