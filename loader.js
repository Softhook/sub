window.loadMod = async function (urlOrBuffer) {
  let arrayBuffer;

  if (typeof urlOrBuffer === 'string') {
    const response = await fetch(urlOrBuffer);
    arrayBuffer = await response.arrayBuffer();
  } else if (urlOrBuffer instanceof Uint8Array) {
    arrayBuffer = urlOrBuffer.buffer;
  } else if (urlOrBuffer instanceof ArrayBuffer) {
    arrayBuffer = urlOrBuffer;
  } else {
    throw new Error("loadMod expects a URL string, Uint8Array, or ArrayBuffer.");
  }

  // ✅ construct the Mod directly
  const mod = new Mod(arrayBuffer);
  return mod;
};