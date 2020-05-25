reqFile = require.main.require;

// ---------------------------- TRACER LOGGING --------------------------------
// Need to declare this up front so other modules can use it
var clic = require("cli-color");
// "colors" is used by the 'tracer.js' module to format its output in various colours,
// as seen in the "<text>".colourName usages below.
require("colors");
var conf = {
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

let app = reqFile("./testSources.js");

app.start();
