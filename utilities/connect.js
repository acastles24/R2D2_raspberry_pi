async function connect(scanner, robot){
  const r2d2_connected = await scanner.find(robot.advertisement);
  return r2d2_connected
}

module.exports.connect = connect;