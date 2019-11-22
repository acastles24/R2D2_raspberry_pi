function connect(scanner, robot, bt_id) {
  return scanner.find(robot.advertisement, bt_id);
}


function connect_promise(ms, promise){
  let timeout = new Promise((resolve, reject)  =>{
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Connect failed.');
    }, ms)
  });
  return Promise.race([promise, timeout]);
}


function connect_start(scanner, robot, bt_id, wait_time){
  console.log('Started Connection')
  const start_race = connect_promise(wait_time, connect(scanner, robot, bt_id));
  start_race.then(connected_robot => {
    console.log('Connected!');
    return connected_robot;
  })
  start_race.catch(() => {
    console.log('Connection attemped failed.');
  })
}