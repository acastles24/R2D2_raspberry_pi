exports.connect = async(scanner, robot) => {
  const r2d2_connected = await scanner.find(robot.advertisement);
  return r2d2_connected
}