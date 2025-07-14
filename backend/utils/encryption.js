// This file remains the same. Path: backend/utils/encryption.js
const crypto = require("crypto")

exports.generateKeyPair = () => {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  })
}

exports.encryptVote = (vote, publicKey) => {
  const buffer = Buffer.from(JSON.stringify(vote))
  const encrypted = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    buffer,
  )
  return encrypted.toString("base64")
}

exports.decryptVote = (encryptedVote, privateKey) => {
  const buffer = Buffer.from(encryptedVote, "base64")
  const decrypted = crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    buffer,
  )
  return JSON.parse(decrypted.toString())
}

exports.generateVerificationCode = () => {
  return "VER-" + crypto.randomBytes(8).toString("hex").toUpperCase()
}
