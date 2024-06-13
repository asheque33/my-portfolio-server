require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient, ObjectId } = require("mongodb");
// const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("portfolio");
    const skillsCollection = db.collection("skills");
    const projectsCollection = db.collection("projects");
    const blogsCollection = db.collection("blogs");

    // User Login
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;

      // Find user by email
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
      });

      res.json({
        success: true,
        message: "Login successful",
        token,
      });
    });

    // * create a new skill
    app.post("/skill", async (req, res) => {
      const skill = req.body;
      const result = await skillsCollection.insertOne(skill);
      res.status(200).json({
        success: true,
        message: "Skill created successfully",
        data: result,
      });
    });
    // get all skills
    app.get("/skills", async (req, res) => {
      const result = await skillsCollection.find().toArray();
      res.status(200).json({
        success: true,
        message: "All Skills retrieved successfully",
        data: result,
      });
    });
    // * update a skill
    app.put("/skill/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const filter = { id };
      const skill = req.body;
      const image = req.body.image;
      const options = { upsert: true };
      const updateSkill = {
        $set: {
          ...skill,
          image: image,
        },
      };
      const result = await skillsCollection.updateOne(
        filter,
        updateSkill,
        options
      );
      res.status(200).json({
        success: true,
        message: "Skill updated successfully",
        data: result,
      });
    });
    // * create a new project
    app.post("/project", async (req, res) => {
      const project = req.body;
      const result = await projectsCollection.insertOne(project);
      res.status(200).json({
        success: true,
        message: "Project created successfully",
        data: result,
      });
    });
    // get all projects
    app.get("/projects", async (req, res) => {
      const result = await projectsCollection.find().toArray();
      res.status(200).json({
        success: true,
        message: "All projects retrieved successfully",
        data: result,
      });
    });
    // * update a project
    app.put("/project/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const project = req.body;
      const options = { upsert: true };
      const updateProject = {
        $set: {
          ...project,
        },
      };
      const result = await projectsCollection.updateOne(
        filter,
        updateProject,
        options
      );
      res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: result,
      });
    });
    // * create a new category
    app.post("/blog", async (req, res) => {
      const blog = req.body;
      const result = await blogsCollection.insertOne(blog);
      res.status(200).json({
        success: true,
        message: "Blog created successfully",
        data: result,
      });
    });
    // get all Blogs
    app.get("/blogs", async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.status(200).json({
        success: true,
        message: "All blogs retrieved successfully",
        data: result,
      });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  const statusObject = {
    statusMessage: "Server is running very smoothly!",
    timeStamp: new Date(),
  };
  res.send(statusObject);
});
