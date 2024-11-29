import { Hono } from "hono";

const app = new Hono();

// Deno KV as the database
const store = await Deno.openKv();

// Create (Set a value)
app.post("/", async (c) => {
  try {
    const request = c.req;
    const json = await request.json();
    console.log("Set:", json);

    if (json.key === undefined || json.value === undefined) {
      throw new Error("Missing field in key-value pair.");
    }
    const { key, value } = json;
    const result = await store.set([key], value);

    if (result.ok) {
      return c.json({ message: `Successfully Set: ${key}` });
    } else {
      throw new Error(`Error while setting ${key}`);
    }
  } catch (e) {
    return c.json({ error: `${e}` });
  }
});

// Read (Get a value)
app.get("/:key", async (c) => {
  try {
    const request = c.req;
    const key = request.param("key");
    console.log("Get: ", key);

    const result = await store.get([key]);

    if (result.value === null) {
      return c.json({ error: `Key ${key} not found.` }, 404);
    } else {
      return c.json({ value: result.value });
    }
  } catch (e) {
    return c.json({ request: c.req.json(), error: `${e}` });
  }
});

Deno.serve(app.fetch);
