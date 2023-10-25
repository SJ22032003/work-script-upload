const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
require("dotenv").config();
const token = process.env.TOKEN;

const formData = new FormData();
const imageDir = "./logos/cp_logos";
// es --> executive summary --> should be in SVG format
// cp --> company profile --> only in PNG
formData.append("type", "cp"); // <---- check this before make any change

fs.readdir(imageDir, (error, files) => {
  if (error) {
    console.error(error);
  } else {
    files.forEach((file) => {
      const imagePath = path.join(imageDir, file);
      formData.append("image", fs.createReadStream(imagePath));
    });
    console.log("LOADING.....")
    axios
      .post(
        "http://localhost:8080/api/additional_routes/upload_files",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            ...formData.getHeaders(),
          },
        }
      )
      .then((response) => {
        const urls = response.data.urls;
        console.log(urls);
        axios
          .post(
            "http://localhost:8080/api/additional_routes/storeUrls",
            {
              data: urls,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            console.log("Urls stored successfully", response.data);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }
});
