import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import "../global-types";

const pathToEnv = path.resolve(__dirname, "../../../../.env");

export function writeReplacedNewPortEnv(newPort: number) {
  let envFileContent = "";
  if (fs.existsSync(pathToEnv)) {
    envFileContent = fs.readFileSync(pathToEnv, "utf-8");
    const regex = /PORT_WS=\d+/;
    if (regex.test(envFileContent)) {
      envFileContent = envFileContent.replace(regex, `PORT_WS=${newPort}`);
    } else {
      envFileContent += `\nPORT_WS=${newPort}\n`;
    }
  } else {
    envFileContent = `PORT_WS=${newPort}\n`;
  }
  fs.writeFileSync(pathToEnv, envFileContent);
}

const defaultEnvironments = ["PORT_WS=8080"];

export function writeNewFileEnv() {
  fs.writeFileSync(pathToEnv, defaultEnvironments.join("\n") + "\n", {
    flag: "a",
  });
  console.log(
    `\x1b[32mUm arquivo ${pathToEnv} foi criado na raiz do projeto, com as seguintes variáveis:\x1b[0m`,
    "\n",
    defaultEnvironments.join("\n"),
    "\n",
    `\x1b[33mEdite o arquivo ${pathToEnv} para ajustar as variáveis conforme necessário, e inicie o app novamente.\x1b[0m`
  );
}

function loadEnvFile() {
  fs.existsSync(pathToEnv) && dotenv.config({ path: pathToEnv });
}

function showMessageUndefinedEnvVars() {
  console.warn(
    "\x1b[31mAs variáveis de ambiente necessárias não estão definidas corretamente.\x1b[0m"
  );
}

function errorUndefinedEnvVars() {
  throw new Error(
    "As variáveis de ambiente necessárias não estão definidas corretamente.\n" +
      "Por favor, defina as variáveis no arquivo .env para continuar.\n" +
      defaultEnvironments.join("\n")
  );
}

const steps = [
  loadEnvFile,
  showMessageUndefinedEnvVars,
  writeNewFileEnv,
  loadEnvFile,
  errorUndefinedEnvVars,
];

while (!process.env.PORT_WS && steps.length > 0) {
  const step = steps.shift();
  step && step();
}

function validEnvPort() {
  if (!process.env.PORT_WS) {
    throw new Error(
      "A variável de ambiente PORT_WS não está definida.\n" +
        "Por favor, defina a variável no arquivo .env para continuar.\n" +
        "PORT_WS=8080"
    );
  }

  if (isNaN(Number(process.env.PORT_WS))) {
    throw new Error(
      "A variável de ambiente PORT_WS deve ser um número válido.\n" +
        "Por favor, corrija o valor da variável no arquivo .env para continuar.\n" +
        "Exemplo: PORT_WS=8080"
    );
  }

  if (Number(process.env.PORT_WS) < 1 || Number(process.env.PORT_WS) > 65535) {
    throw new Error(
      "A variável de ambiente PORT_WS deve estar entre 1 e 65535.\n" +
        "Por favor, corrija o valor da variável no arquivo .env para continuar.\n" +
        "Exemplo: PORT_WS=8080"
    );
  }

  if (!Number.isInteger(Number(process.env.PORT_WS))) {
    throw new Error(
      "A variável de ambiente PORT_WS deve ser um número inteiro.\n" +
        "Por favor, corrija o valor da variável no arquivo .env para continuar.\n" +
        "Exemplo: PORT_WS=8080"
    );
  }
}

function validEnvNodeEnv() {
  const validEnvs = ["development", "production", "production-frontend-server"];
  if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
    throw new Error(
      `A variável de ambiente NODE_ENV deve ser um dos seguintes valores: ${validEnvs.join(
        ", "
      )}.\n` +
        "Por favor, corrija o valor da variável no arquivo .env para continuar.\n" +
        `Exemplo: NODE_ENV=development`
    );
  }
}

function validEnvs() {
  validEnvPort();
  validEnvNodeEnv();
}

validEnvs();

export const envs = {
  PORT_WS: +process.env.PORT_WS,
  NODE_ENV: process.env.NODE_ENV || "development",
};
