import { promises as fs } from "fs";
import { JWT } from "google-auth-library";
import path from "path";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH || path.join(process.cwd(), "credentials.json");

export async function getAuthClient(): Promise<JWT> {
  try {
    const content = await fs.readFile(CREDENTIALS_PATH);
    const credentials = JSON.parse(content.toString());

    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: SCOPES,
    });

    return client;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}
