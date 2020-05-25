let express = require("express");
let path = require("path");
let favicon = require("serve-favicon");
let bodyParser = require("body-parser");
let session = require('express-session');
let cookieParser = require("cookie-parser");

let db = require("./models");
let config = require("./config/config.js");

let app = express();

// ---------------------------- TRACER LOGGING --------------------------------
// Need to declare this up front so other modules can use it
let clic = require("cli-color");
// "colors" is used by the 'tracer.js' module to format its output in various colours,
// as seen in the "<text>".colourName usages below.
require("colors");
let conf = {
    format:     "{{timestamp}}".bold.cyan + " {{file}}:{{line}}".bold.blue + " {{message}}",
    dateformat: "yyyy-mm-dd - HH:MM:ss",
	filters: {
		// log:     clic.blue,
		trace:  clic.magentaBright,
		debug:  clic.cyanBright.bold.bgXterm(232),
		// info:   clic.greenBright,
		warn:   clic.xterm(202),
		error:  clic.red.bold
	},
    level:      parseInt((process.argv[2]) ? process.argv[2] : 3)
};
logger = require("tracer").colorConsole(conf);

// "tracer" module logging levels. Setting your logging level to "N" will output every
// message that is "N" or higher. "debug" should be used whenever a piece of information
// would be useful for debugging but isn't relevant for regular operation. These can
// therefore be shown or hidden by setting the logging level to "2" or "3", respectively.
// logger.log("Level 0: log");       // Level 0
// logger.trace("Level 1: trace");   // Level 1
// logger.debug("Level 2: debug:");  // Level 2
// logger.info("Level 3: info");     // Level 3
// logger.warn("Level 4: warn");     // Level 4
// logger.error("Level 5: error");   // Level 5
// ----------------------------------------------------------------------------

// Set our view engine to EJS
app.set("view engine", "ejs");

//use sessions for tracking logins
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 10 } // 10 minutes
  }));

// Favicon
app.use(favicon(path.join(__dirname, "public/assets/img", "favicon.ico")));

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware Return Static File
//1.Append static style file
//link href='assets/style.css' => '/public/style.css'
app.use("/assets/js", express.static(__dirname + "/assets/js"));
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/img", express.static(__dirname + "/assets/img"));

let port = process.env.PORT || config.expressPort;
let ip = config.expressHost;
// Sync with our MySQL database then start our server listening
db.sequelize.sync().then(function() {
    app.listen(port, ip, () => {
        logger.info("Gateway HTTP server listening on port " + port);
    });
});

// This category will contain any general-purpose web services
// such as authentication
let api = require("./routes/api.js");
app.use("/api", api);

// This category will contain all of our post-login page endpoints,
// i.e.:
//   - / (i.e.: login page)
//   - /overview
//   - /admin
//   - /systemlog
let dashboard = require("./routes/dashboard.js");
app.use("/", dashboard);
