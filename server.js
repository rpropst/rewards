const express = require('express');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const http = require("http");
const app = express();
const port = 3333;


require('dotenv').config();


Sentry.init({
  dsn: "https://ce3f836aa9064fbcbc2f8dbe78d34a56@o87286.ingest.sentry.io/5518875",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
    new Tracing.Integrations.Mongo()
  ],
  release: process.env.EXPRESS_API_RELEASE || "0.0.1",
  environment: process.env.API_ENVIRONMENT || "production",
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});


app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
  console.log('called onError()');
  Sentry.captureException(err);
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.use(express.json());

const db = require('./app/models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
    res.send('Hello World, from express');
});

require('./app/routes/account.routes')(app);

app.listen(port, () => { 
  console.log(`Hello world app listening on port ${port}!`);
  console.log(`Release: ${process.env.EXPRESS_API_RELEASE}`);
  console.log(`Environment: ${process.env.API_ENVIRONMENT}`);
});