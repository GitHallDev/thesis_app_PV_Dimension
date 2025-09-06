const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

/**
 * @description This function handles serial calculation requests to the PVGIS API.
 * It constructs the API URL with the provided parameters and fetches data from the PVGIS API.
 * @route GET /api/pvgis/serialcalc/:lon/:lat/:angle/:aspect/:startyear/:endyear/:outputformat
 * @param {Object} req - The request object containing parameters for the PVGIS API.
 * @param {Object} res - The response object to send back the result or error.
 * @returns {Object} - Returns the data fetched from the PVGIS API or an error message.
 */
const serialcalc = async (req, res) => {
  try {
    console.log("serialcalc called with params:", req.query);
    const { lon, lat, angle, aspect, startyear, endyear, outputformat } =
      req.query;

    // Validate input data
    if (
      !lon ||
      !lat ||
      !angle ||
      !aspect ||
      !startyear ||
      !endyear ||
      !outputformat
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    //
    const baseApiUrl =
      process.env.PVGIS_API_URL + `/seriescalc` ||
      "https://re.jrc.ec.europa.eu/api/v5_2/seriescalc";
    const params = new URLSearchParams({
      lon,
      lat,
      angle,
      aspect,
      startyear,
      endyear,
      outputformat,
    });
    const apiUrl = `${baseApiUrl}?${params.toString()}`;

    // Fetch data from the PVGIS API
    const response = await axios.get(apiUrl);

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in serialcalc:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  serialcalc,
};
