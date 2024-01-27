import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

export const updateData = functions.pubsub
  .schedule("*/10 * * * *")
  .onRun(async () => {
    const db = admin.firestore();
    const tokensRef = db.collection("tokens");
    const tokensSnapshot = await tokensRef.get();
    const tokens = tokensSnapshot.docs.map(
      (doc) => doc.data() as { address: string },
    );

    for (const token of tokens) {
      try {
        const response = await axios.get(
          `https://api.geckoterminal.com/api/v2/networks/avax/tokens/${token.address}/pools`,
          {
            headers: {
              Accept: "application/json;version=20230302",
            },
          },
        );

        const poolData = response.data.data;

        if (poolData && poolData.length > 0) {
          const tokenPrice = parseFloat(poolData[0].attributes.token_price_usd);
          const decimalDigits = tokenPrice.toString().split(".")[1] || "";
          const firstNonZeroIndex = [...decimalDigits].findIndex(
            (digit) => digit !== "0",
          );
          const displayPrice = tokenPrice
            .toFixed(firstNonZeroIndex + 2)
            .replace(/0+$/, "");

          await tokensRef.doc(token.address).update({
            price: `$${displayPrice}`,
          });
        } else {
          await tokensRef.doc(token.address).update({
            price: "No se encontró el precio del token.",
          });
        }
      } catch (error) {
        console.error("Error fetching token price:", error);
        await tokensRef.doc(token.address).update({
          price: "Ocurrió un error al buscar el precio del token.",
        });
      }
    }
  });
