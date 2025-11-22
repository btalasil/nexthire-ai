import "dotenv/config";
import fetch from "node-fetch";

async function listModels() {
  try {
    const url =
      "https://generativelanguage.googleapis.com/v1/models?key=" +
      process.env.GOOGLE_API_KEY;

    const res = await fetch(url);
    const data = await res.json();

    console.log("Raw response from Google:");
    console.log(JSON.stringify(data, null, 2));

    if (data.models) {
      console.log("\nAvailable models:");
      data.models.forEach((m) => console.log(" - " + m.name));
    } else {
      console.log("\nNo model list returned.");
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
