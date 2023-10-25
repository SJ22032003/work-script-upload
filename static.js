const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
require("dotenv").config();

const token = process.env.TOKEN;

const formData = new FormData();
const imageDir = "./static_files/CEP SVGs";
formData.append("type", "static_slides");
formData.append("hub_id", "25"); // IMPORTANT TO CHANGE PLEASE!!!!

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
        const urlarr = Object.values(urls);
        const data = [];
        urlarr.forEach((url) => {
          data.push({url})
        })
        console.log(urls);
        fs.writeFile('./response.json', JSON.stringify(data), error => {
          if (error) {
            console.error(error);
          } else {
            console.log('Urls written to file');
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
});