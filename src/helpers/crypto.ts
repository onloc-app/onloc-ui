export async function deriveKey(password: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  )

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode("onloc"),
      iterations: 600000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}

export async function generateKeypair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"],
  )
}

export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("spki", publicKey)
  return btoa(String.fromCharCode(...new Uint8Array(exported)))
}

export async function exportPrivateKey(privateKey: CryptoKey): Promise<string> {
  const exported = await crypto.subtle.exportKey("pkcs8", privateKey)
  return btoa(String.fromCharCode(...new Uint8Array(exported)))
}

export async function encryptPrivateKey(
  privateKey: CryptoKey,
  encryptionKey: CryptoKey,
): Promise<string> {
  const exported = await crypto.subtle.exportKey("pkcs8", privateKey)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    encryptionKey,
    exported,
  )

  const combined = new Uint8Array(iv.byteLength + encrypted.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encrypted), iv.byteLength)
  return btoa(String.fromCharCode(...combined))
}

export async function decryptPrivateKey(
  encryptedPrivateKey: string,
  encryptionKey: CryptoKey,
): Promise<CryptoKey> {
  const combined = Uint8Array.from(atob(encryptedPrivateKey), (c) =>
    c.charCodeAt(0),
  )
  const iv = combined.slice(0, 12)
  const encrypted = combined.slice(12)
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    encryptionKey,
    encrypted,
  )
  return crypto.subtle.importKey(
    "pkcs8",
    decrypted,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey"],
  )
}
