require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//swagger

const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

//connectDB
const connectDB = require("./db/connect");

const authenticateUser = require("./middleware/authentication");

// routes
const jonsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy ", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100, // limit each ip to 100 require pre windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// extra packages

// routes

app.get("/", (req, res) => {
  res.send('<H1>Jobs API</H1> <a href="api-docs">Document</a>');
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jonsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
