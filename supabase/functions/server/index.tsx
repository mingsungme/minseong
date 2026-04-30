import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import ImageKit from "npm:imagekit";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a5c17b72/health", (c) => {
  return c.json({ status: "ok" });
});

// ImageKit Auth Route
app.get("/make-server-a5c17b72/imagekit-auth", (c) => {
  const imagekit = new ImageKit({
    publicKey: "public_S9pbeOHEU+4Cpp2i+o3lth14FyU=",
    privateKey: Deno.env.get("IMAGEKIT_PRIVATE_KEY") || "",
    urlEndpoint: "https://ik.imagekit.io/cazktqzlf"
  });

  const authParams = imagekit.getAuthenticationParameters();
  return c.json(authParams);
});

// Project CRUD
app.get("/make-server-a5c17b72/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix("project:");
    const values = (projects || [])
      .filter((p: any) => p && typeof p === 'object')
      .sort((a: any, b: any) => (b.id || 0) - (a.id || 0));
    return c.json(values);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

app.post("/make-server-a5c17b72/projects", async (c) => {
  try {
    const project = await c.req.json();
    const id = project.id || Date.now();
    const newProject = { ...project, id };
    await kv.set(`project:${id}`, newProject);
    return c.json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

app.put("/make-server-a5c17b72/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const project = await c.req.json();
    await kv.set(`project:${id}`, project);
    return c.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return c.json({ error: "Failed to update project" }, 500);
  }
});

app.delete("/make-server-a5c17b72/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`project:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

Deno.serve(app.fetch);