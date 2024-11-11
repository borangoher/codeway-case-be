var express = require("express");
var router = express.Router();
var authenticateToken = require("../middleware/auth.js");
var { admin, db } = require("../firebase");

router.get("/", authenticateToken, async (req, res) => {
  const uid = req.user.uid;

  try {
    const userDoc = await db.collection("parameters").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User data not found" });
    }

    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ error: "Error fetching user data", details: error.message });
  }
});

router.put("/", authenticateToken, async (req, res) => {
  const uid = req.user.uid;
  const newItem = req.body;

  try {
    const userDocRef = db.collection("parameters").doc(uid);

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);

      if (!userDoc.exists) {
        transaction.set(userDocRef, { params: [newItem] });
      } else {
        transaction.update(userDocRef, {
          params: admin.firestore.FieldValue.arrayUnion(newItem),
        });
      }
    });

    const userDoc = await transaction.get(userDocRef);
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error adding item to array:", error);
    res
      .status(500)
      .json({ error: "Error adding item to array", details: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  const uid = req.user.uid;
  const newItem = req.body;

  try {
    const userDocRef = db.collection("parameters").doc(uid);

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User document not found" });
      }

      const items = userDoc.data().params || [];

      const itemIndex = items.findIndex((item) => item.id === newItem.id);
      if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found in array" });
      }

      items[itemIndex] = { ...items[itemIndex], ...newItem };
      transaction.update(userDocRef, { params });
    });

    const userDoc = await transaction.get(userDocRef);
    res.status(200).json(userDoc);
  } catch (error) {
    console.error("Error updating item in array:", error);
    res
      .status(500)
      .json({ error: "Error updating item in array", details: error.message });
  }
});

router.delete("/", authenticateToken, async (req, res) => {
  const uid = req.user.uid;
  const { id } = req.body;

  try {
    const userDocRef = db.collection("parameters").doc(uid);

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userDocRef);

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User document not found" });
      }

      const items = userDoc.data().params || [];
      const updatedItems = items.filter((item) => item.id !== id);
      transaction.update(userDocRef, { params: updatedItems });
    });

    const userDoc = await transaction.get(userDocRef);
    res.status(200).json(userDoc);
  } catch (error) {
    console.error("Error deleting item from array:", error);
    res.status(500).json({
      error: "Error deleting item from array",
      details: error.message,
    });
  }
  res.send(`user: ${req.user.name}`);
});

module.exports = router;
