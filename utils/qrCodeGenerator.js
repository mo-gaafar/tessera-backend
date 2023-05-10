const axios = require("axios");
const fs = require("fs/promises");
// const fs = require("fs");

const path = require("path");

/**
 * Generate a QR code with a logo using the QRCode Monkey API and save it locally
 * @async
 * @function generateQRCodeWithLogo
 * @param {string} url - The URL to encode in the QR code
 * @returns {Promise<string>} - A Promise that resolves with the base64-encoded image data
 * @throws {Error} - If the URL is not provided or if an error occurs during the process
 */
async function generateQRCodeWithLogo(url) {
  try {
    // Check if URL is provided
    if (!url) {
      throw new Error("URL is required");
    }

    // Set API options
    const apiUrl = "https://api.qrcode-monkey.com/qr/custom";
    const apiOptions = {
      method: "post",
      url: apiUrl,
      data: {
        data: url,
        config: {
          body: "square",
          eye: "frame0",
          eyeBall: "ball0",
          er: { e: "M", p: 0 },
          mb: "t",
          me: true,
          m: 4,
          mSize: 0.15,
        },
        size: 150,
        download: false,
        file: "png",
        getConfig: "false",
      },
      responseType: "arraybuffer",
    };

    // Send request to API
    const response = await axios(apiOptions);

    // Convert response data to base64-encoded image data
    const qrCodeDataUrl = `data:image/png;base64,${Buffer.from(
      response.data
    ).toString("base64")}`;

    // Save the QR code image locally
    saveQRCodeLocal(qrCodeDataUrl, "qrcode_with_logo.png");

    // Return the base64-encoded image data
    return qrCodeDataUrl.split(";base64,").pop();
  } catch (error) {
    throw error;
  }
}

/**
 * Saves a QR code image to the local filesystem.
 *
 * @async
 * @function saveQRCodeLocal
 * @param {string} qrCodeDataUrl - The data URL of the QR code image.
 * @param {string} fileName - The name of the file to save the image as.
 * @throws {Error} If an error occurs while writing the file.
 * @returns {Promise<void>} A Promise that resolves when the image has been saved.
 */
async function saveQRCodeLocal(qrCodeDataUrl, fileName) {
  try {
    // Remove the data URL prefix and convert to buffer
    const data = Buffer.from(
      qrCodeDataUrl.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    // Create the file path
    const filePath = `${__dirname}/qr_codes/${fileName}`;

    // Write the file
    await fs.writeFile(filePath, data);
    console.log(`QR code saved as ${filePath}`);
  } catch (error) {
    throw error;
  }
}

module.exports = generateQRCodeWithLogo;
