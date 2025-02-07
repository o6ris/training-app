import { google } from "googleapis";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const auth = new google.auth.GoogleAuth({
  keyFile: "./tough-star-389810-705ca1002720.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const SHEET_RANGE = "whiteListedEmail!B2:C";
const SHEET_ID = "1GLnE9NU2k-PLaDXKVgQPfNToZv099cIfuhSSwu7i3zU"

async function fetchSheetData() {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
    });

    return res.data.values.map((row) => ({ name: row[0], email: row[1] }));
  } catch (error) {
    console.log("fetch sheet data error:", error);
  }
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const WhitelistedEmail = mongoose.model("WhitelistedEmail", new mongoose.Schema({ email: String, name: String }));

async function syncWhitelist() {
  console.log("Fetching data from Google Sheets...");
  const sheetData = await fetchSheetData();
  
  console.log("Fetching existing emails from MongoDB...");
  const existingEmails = await WhitelistedEmail.find({}, "email");
  const existingEmailSet = new Set(existingEmails.map(e => e.email));

  const newEntries = sheetData.filter(e => !existingEmailSet.has(e.email));

  if (newEntries.length > 0) {
    await WhitelistedEmail.insertMany(newEntries);
    console.log(`✅ Whitelist updated! Added ${newEntries.length} new emails.`);
  } else {
    console.log("✅ No new emails to add.");
  }
}

syncWhitelist()
  .then(() => mongoose.connection.close())
  .catch(err => {
    console.error("❌ Error syncing whitelist:", err);
    mongoose.connection.close();
  });
