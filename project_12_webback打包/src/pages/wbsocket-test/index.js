import '../../style.scss';
import Centrifuge from 'centrifuge'

console.log('start.....');

var centrifuge = new Centrifuge({
  url: 'wss://wkdev.bjywkd.com:9112/connection/websocket',
  user: "172",
  timestamp: "1588071188",
  token: "c63698d0f029be6ab227feb73de6c3c17725b126edc15039d0379e1695b15b4c"
});

centrifuge.on('connect', function (context) {
  console.log('connect');
  console.log(context);
});

centrifuge.subscribe("msg:172", function (message) {
  console.log(message);
});

centrifuge.on('disconnect', function (context) {
  console.log('disconnect');
  console.log(context);
});

centrifuge.connect();
