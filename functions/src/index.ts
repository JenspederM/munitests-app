import * as functions from "firebase-functions";
import * as AssistantV1 from "ibm-watson/assistant/v1";
import { MessageParams, MessageResponse } from "ibm-watson/assistant/v1";
import { IamAuthenticator } from "ibm-watson/auth";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const messageAssistant = functions.https.onCall(
  async (
    data: MessageParams,
    context: functions.https.CallableContext
  ): Promise<MessageResponse | undefined> => {
    if (!context.auth) {
      return;
    }

    const API_KEY = process.env.API_KEY;
    const SERVICE_URL = process.env.SERVICE_URL;
    const VERSION = process.env.VERSION;

    if (!API_KEY || !SERVICE_URL || !VERSION) {
      return;
    }

    const assistant = new AssistantV1({
      authenticator: new IamAuthenticator({
        apikey: API_KEY,
      }),
      serviceUrl: SERVICE_URL,
      version: VERSION,
    });

    const response = await assistant.message(data);

    return response.result;
  }
);
