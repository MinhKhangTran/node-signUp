const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config({ path: __dirname + "/.env" });

const app = express();
const API_ENDPOINT = `https://us${process.env.LIST_ID_PORT}.api.mailchimp.com/3.0/lists/`;
const url = `${API_ENDPOINT}${process.env.LIST_ID}`;
const options = {
  method: "POST",
  auth: `user:${process.env.API_KEY}`,
};
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const vName = req.body.vorname;
  const nName = req.body.nachname;
  const email = req.body.email;
  //   console.log(vName, nName, email);
  data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: vName,
          LNAME: nName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
      console.log("erfolg");
    } else {
      res.sendFile(__dirname + "/failure.html");
      console.log("fail");
    }
    // response.on("data", (data) => {
    //   console.log(JSON.parse(data));
    // });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(4000, () => {
  console.log("running on localhost:4000");
});
