import { Client } from "@neondatabase/serverless";

const client = new Client({ connectionString: process.env.DATABASE_URL });

export async function handler(event) {
  try {
    const { question, answer, notes } = JSON.parse(event.body);

    await client.connect();

    // Ensure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS math_logs(
        id SERIAL PRIMARY KEY,
        question TEXT,
        answer TEXT,
        notes TEXT
      )
    `);

    // Insert new log
    await client.query(
      'INSERT INTO math_logs(question, answer, notes) VALUES($1,$2,$3)',
      [question, answer, notes]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Saved successfully" }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
