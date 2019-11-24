/**
 * Connects to R2-D2
 * @param {Scanner from spherov2} scanner 
 * @param {R2-D2 type from spherov2} scanner 
 * @returns {Connected R2-D2 instance}
 */
exports.connect = async(scanner, R2D2) => {
  const r2d2_connected = await scanner.find(R2D2.advertisement);
  return r2d2_connected
}