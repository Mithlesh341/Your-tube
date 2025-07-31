const admin = require("firebase-admin");


if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // Fix for multiline private key 
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),

  });
}

const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Firebase token verification failed:", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = verifyFirebaseToken;
