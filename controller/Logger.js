const { createLogger, transports, format } = require("winston");
const loggerController = createLogger({
	transports: [
		new transports.File({
			filename: "Tessera.log",
			level: "info",
			format: format.combine(format.timestamp(), format.json()),
		}),
		new transports.File({
			filename: "Tessera.log",
			level: "error",
			format: format.combine(format.timestamp(), format.json()),
		}),
	],
});
module.exports = { loggerController };
