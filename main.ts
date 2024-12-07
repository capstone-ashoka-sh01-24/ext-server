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
      c.status(400);
      return c.json("Missing field in key-value pair.");
    }
    const { key, value } = json;
    const result = await store.set([key], value);

    if (result.ok) {
      c.status(200);
      return c.json({ message: `Successfully Set: ${key}` });
    } else {
      c.status(500);
      return c.json({ error: `Error while setting ${key}` });
    }
  } catch (e) {
    c.status(500);
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
      c.status(404);
      return c.json({ error: `Key ${key} not found.` });
    } else {
      c.status(200);
      return c.json({ value: result.value });
    }
  } catch (e) {
    c.status(500);
    return c.json({ error: `${e}` });
  }
});

app.get("/", (c) => {
  c.status(400);
  return c.json({
    message:
      "Only POST requests allowed on route /, for GET request use /<key>",
  });
});

Deno.serve(app.fetch);
