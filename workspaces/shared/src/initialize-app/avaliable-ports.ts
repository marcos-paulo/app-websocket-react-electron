import detectPort from "detect-port";

export async function checkPortAvailability(
  port: number
): Promise<{ availablePort: number }> {
  try {
    const availablePort = await detectPort(port);
    console.log(port, typeof port);
    console.log(availablePort, typeof availablePort);
    if (availablePort !== port) {
      console.error(
        "\x1b[31mA porta %s não está disponível. Porta disponível encontrada: %s\x1b[0m",
        port,
        availablePort
      );
      return { availablePort };
    } else {
      console.log("\x1b[32mA porta %s está disponível para uso.\x1b[0m", port);
      return { availablePort: port };
    }
  } catch (error) {
    console.error(
      "\x1b[31mErro ao verificar a disponibilidade da porta %s: %s\x1b[0m",
      port,
      (error as Error).message
    );
    throw error;
  }
}
