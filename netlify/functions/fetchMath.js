import { Client } from "@neondatabase/serverless";

const client = new Client({ connectionString: process.env.NETLIFY_DATABASE_URL });

export async function handler() {
  try {
    await client.connect();

    const res = await client.query('SELECT * FROM math_logs ORDER BY id ASC');

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ logs: res.rows }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
