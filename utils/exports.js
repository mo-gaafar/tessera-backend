const createCsvWriter = require("csv-writer").createObjectCsvWriter;
/**

Exports data to CSV file
@param {Array} data - The array of data to be exported to CSV
@param {string} csvFilePath - The path where the CSV file will be created
@param {Array} csvHeaders - The array of header objects containing id and title properties
*/
async function exportToCsv(data, csvFilePath, csvHeaders) {
	try {
		const csvWriter = createCsvWriter({
			path: csvFilePath,
			header: csvHeaders,
		});

		await csvWriter.writeRecords(data);

		console.log(`CSV file exported successfully to ${csvFilePath}`);
	} catch (error) {
		console.error(error);
	}
}
module.exports = { exportToCsv };
