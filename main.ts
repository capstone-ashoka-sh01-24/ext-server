import { Hono } from "hono";

const app = new Hono();

// In-memory storage for key-value pairs
const store = {};

// Create (Set a value)
app.post("/", async (c) => {
    const { key, value } = await c.req.json();
    store[key] = value; // Store the value in memory
    return c.json({ message: `Successfully Set: ${value}` });
});

// Read (Get a value)
app.get("/", async (c) => {
    const { key } = await c.req.json();

    const value = store[key];
    if (value !== undefined) {
        return c.json({ key, value });
    } else {
        return c.json({ error: "Key not found" }, 404);
    }
});

/* ------------------------------------------------------------------------
// Update (Set a value)
app.put("/", async (c) => {
    const { key, value } = await c.req.json();
    if (store[key] !== undefined) {
        store[key] = value; // Update the existing value
        return c.json({ message: "Value updated successfully" });
    } else {
        return c.json({ error: "Key not found" }, 404);
    }
});

// Delete (Remove a value)
app.delete("/delete", (c) => {
    const { key } = await c.req.json();
    if (store[key] !== undefined) {
        delete store[key]; // Remove the key-value pair
        return c.json({ message: "Value deleted successfully" });
    } else {
        return c.json({ error: "Key not found" }, 404);
    }
});
 */

Deno.serve(app.fetch);
