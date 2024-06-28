"use server";
import { getDB } from "@/lib/db";
import { StringRecordId } from "surrealdb.js";
import generateSystemPrompt from "@/lib/gen-system-prompt";
import { embed, summarize, PROMPTS_SUMMARIZE } from "@/lib/ai";
import { nameExists } from "@/lib/database/create";

export const updateAgent = async (
  identifier: string,
  {
    name = null,
    parameters = null,
    description = null,
    qualities = [],
    image = null,
  }: {
    name?: string | null;
    parameters?: string | null;
    description?: string | null;
    qualities?: [string, string][];
    image?: string | null;
  } = {}
): Promise<string> => {
  const db = await getDB();
  try {
    const id = new StringRecordId(identifier);
    // get agent
    const agent = await db.select(id);
    // name is different
    if (name && agent.name !== name) {
      if (await nameExists(name)) {
        return identifier;
      }
      agent.name = name;
    }
    if (agent.image !== image) {
      agent.image = image;
    }

    const combinedQualities = (
      description +
      "\n\n" +
      qualities.map(([k, v]) => `- ${k}\n  - ${v}`).join("\n")
    ).trim();

    // regenerate content if qualities or description have changed
    if (agent.combinedQualities !== combinedQualities) {
      // update system prompt, description and combinedQualities
      const content = combinedQualities
        ? await summarize(combinedQualities, PROMPTS_SUMMARIZE.LLM_PROMPT)
        : await summarize("", PROMPTS_SUMMARIZE.LLM_PROMPT_RANDOM);
      agent.content = content;
      agent.embedding = await embed(content as string);
      agent.qualities = qualities;
      agent.description = description?.trim();
      agent.combinedQualities = combinedQualities;
    }
    agent.parameters = parameters;
    agent.indexed = [agent.description, agent.content, agent.combinedQualities]
      .filter(Boolean)
      .join("\n ------------------ \n");

    await db.update(id, agent);
    return identifier;
  } finally {
    db.close();
  }
};

export const updateFile = async (
  identifier: string,
  {
    name = null,
    author = null,
    publisher = null,
    publishDate = null,
  }: {
    name?: string | null;
    author?: string | null;
    publisher?: string | null;
    publishDate?: string | null;
  } = {}
): Promise<string> => {
  const db = await getDB();
  try {
    const id = new StringRecordId(identifier);
    // get agent
    const doc = await db.select(id);
    doc.name = name;
    doc.author = author;
    doc.publisher = publisher;
    doc.publishDate = publishDate;
    await db.update(id, doc);
    return identifier;
  } finally {
    await db.close();
  }
};
