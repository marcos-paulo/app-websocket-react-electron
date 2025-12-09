import wait_on from "wait-on";
import "../detect-envs";

const opts = {
  resources: [`tcp:${process.env.PORT_WS}`],
  timeout: 5000,
};

wait_on(opts, function (err) {
  if (err) {
    console.error(
      "\x1b[31mBackend WebSocket server não está rodando na porta %s\x1b[0m",
      process.env.PORT_WS
    );
    process.exit(1);
  } else {
    console.log(
      "\x1b[32mBackend WebSocket server está rodando na porta %s\x1b[0m",
      process.env.PORT_WS
    );
    process.exit(0);
  }
});
