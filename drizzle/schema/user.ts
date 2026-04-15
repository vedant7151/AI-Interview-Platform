import { pgTable, varchar } from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../schemaHelper";
import { JobInfoTable } from "./jobInfo";
import { relations } from "drizzle-orm";

export const Users = pgTable("users", {
    id: varchar("id", { length: 255 }).primaryKey(),
    email: varchar().notNull().unique(),
    name: varchar().notNull(),
    createdAt,
    updatedAt,
    image: varchar().notNull(),


})


export const UserRelations = relations(Users, ({ many }) => ({
    jobInfo: many(JobInfoTable)
}))
