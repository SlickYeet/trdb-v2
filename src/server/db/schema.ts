import { relations, sql } from "drizzle-orm"
import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core"

export const createTable = pgTableCreator((name) => `trdb_${name}`)

export const recipeDifficulty = pgEnum("recipe_difficulty", [
  "easy",
  "medium",
  "hard",
])

export const recipeTable = createTable(
  "recipe",
  (d) => ({
    cookTime: d.integer("cook_time"),
    createdAt: d
      .timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    difficulty: recipeDifficulty("difficulty"),
    id: d.serial("id").primaryKey(),
    ingredients: d.text("ingredients").notNull(),
    instructions: d.text("instructions").notNull(),
    lastMadeAt: d.timestamp("last_made_at", {
      mode: "date",
      withTimezone: true,
    }),
    notes: d.text("notes"),
    prepTime: d.integer("prep_time"),
    rating: d.integer("rating"),
    servings: d.integer("servings"),
    slug: d.text("slug").notNull().unique(),
    source: d.text("source"),
    title: d.text("title").notNull(),
    updatedAt: d
      .timestamp("updated_at", { mode: "date", withTimezone: true })
      .$onUpdate(() => new Date()),
    userId: d
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [
    index("recipe_userId_idx").on(t.userId),
    index("recipe_slug_idx").on(t.slug),
    index("recipe_title_idx").on(t.title),
    index("recipe_createdAt_idx").on(t.createdAt),
  ],
)

export type Recipe = typeof recipeTable.$inferSelect
export type RecipeInsert = typeof recipeTable.$inferInsert

export const tagsTable = createTable("tag", (d) => ({
  createdAt: d
    .timestamp("created_at", { mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  id: d.serial("id").primaryKey(),
  name: d.text("name").notNull().unique(),
  slug: d.text("slug").notNull().unique(),
}))

export const recipeTagsTable = createTable(
  "recipe_tags",
  (d) => ({
    createdAt: d
      .timestamp("created_at", { mode: "date", withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    id: d.serial("id").primaryKey(),
    recipeId: d
      .integer("recipe_id")
      .notNull()
      .references(() => recipeTable.id, { onDelete: "cascade" }),
    tagId: d
      .integer("tag_id")
      .notNull()
      .references(() => tagsTable.id, { onDelete: "cascade" }),
  }),
  (t) => [
    index("recipe_tags_recipeId_idx").on(t.recipeId),
    index("recipe_tags_tagId_idx").on(t.tagId),
  ],
)

export const user = createTable(
  "user",
  (d) => ({
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    email: d.text().notNull().unique(),
    emailVerified: d
      .boolean()
      .$defaultFn(() => false)
      .notNull(),
    id: d.text().primaryKey(),
    image: d.text(),
    name: d.text().notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("user_name_idx").on(t.name),
    index("user_email_idx").on(t.email),
  ],
)

export const session = createTable(
  "session",
  (d) => ({
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    expiresAt: d.timestamp().notNull(),
    id: d.text().primaryKey(),
    ipAddress: d.text(),
    token: d.text().notNull().unique(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    userAgent: d.text(),
    userId: d
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index("session_userId_idx").on(t.userId)],
)

export const account = createTable(
  "account",
  (d) => ({
    accessToken: d.text(),
    accessTokenExpiresAt: d.timestamp(),
    accountId: d.text().notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    id: d.text().primaryKey(),
    idToken: d.text(),
    password: d.text(),
    providerId: d.text().notNull(),
    refreshToken: d.text(),
    refreshTokenExpiresAt: d.timestamp(),
    scope: d.text(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    userId: d
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index("account_userId_idx").on(t.userId)],
)

export const verification = createTable(
  "verification",
  (d) => ({
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    expiresAt: d.timestamp().notNull(),
    id: d.text().primaryKey(),
    identifier: d.text().notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    value: d.text().notNull(),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)],
)

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  recipes: many(recipeTable),
  sessions: many(session),
}))

export const recipeRelations = relations(recipeTable, ({ one, many }) => ({
  tags: many(recipeTagsTable),
  user: one(user, {
    fields: [recipeTable.userId],
    references: [user.id],
  }),
}))

export const tagRelations = relations(tagsTable, ({ many }) => ({
  recipes: many(recipeTagsTable),
}))

export const recipeTagsRelations = relations(recipeTagsTable, ({ one }) => ({
  recipe: one(recipeTable, {
    fields: [recipeTagsTable.recipeId],
    references: [recipeTable.id],
  }),
  tag: one(tagsTable, {
    fields: [recipeTagsTable.tagId],
    references: [tagsTable.id],
  }),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))
