import concurrently from "concurrently";
import { checkPortAvailability } from "./avaliable-ports";
import { envs } from "../detect-envs";

process.on("unhandledRejection", (reason, promise) => {
  console.error("🚨 Unhandled Promise Rejection:");
  console.error("Reason:", reason);
  console.error("Promise:", promise);
  console.error("Stack trace:", new Error().stack);
});

process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught Exception:");
  console.error(error);
  process.exit(1);
});

async function startAppInProdMode() {
  const { availablePort } = await checkPortAvailability(envs.PORT_WS);

  // ...existing code...

  try {
    const { result } = concurrently(
      [
        {
          name: "BACKEND",
          command: `PORT_WS=${availablePort} NODE_ENV=${envs.NODE_ENV} npm run start:prod --workspace=@app/backend`,
          prefixColor: "green",
        },
        {
          name: "ELECTRON",
          command: `PORT_WS=${availablePort} NODE_ENV=${envs.NODE_ENV} npm run start:prod --workspace=@app/electron`,
          prefixColor: "magenta",
        },
      ],
      {
        // killOthersOn: ["failure", "success"],
      }
    );

    const outputs = await result;
    console.log("✅ Processos finalizados com sucesso");
    outputs.forEach((output) => {
      console.log(`🟢 ${output.command.name} exitCode:`, output.exitCode);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao executar processos:");

    // Se for um array de erros do concurrently, mostra cada um
    if (Array.isArray(error)) {
      error.forEach((err, index) => {
        console.error(`Erro ${index + 1}:`);
      });
    }

    process.exit(0);
  }
}

startAppInProdMode();
