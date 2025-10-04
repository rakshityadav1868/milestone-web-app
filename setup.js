#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`\n[${step}] ${message}`, "cyan");
}

function logSuccess(message) {
  log(`✅ ${message}`, "green");
}

function logError(message) {
  log(`❌ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠️  ${message}`, "yellow");
}

function checkRequirements() {
  logStep(1, "Checking system requirements...");

  try {
    // Check Node.js version
    const nodeVersion = execSync("node --version", { encoding: "utf8" }).trim();
    const nodeVersionNumber = parseFloat(nodeVersion.slice(1));

    if (nodeVersionNumber < 16) {
      logError(
        `Node.js version ${nodeVersion} is too old. Please upgrade to Node.js 16 or higher.`
      );
      process.exit(1);
    }

    logSuccess(`Node.js version: ${nodeVersion}`);

    // Check npm version
    const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim();
    const npmVersionNumber = parseFloat(npmVersion);

    if (npmVersionNumber < 8) {
      logWarning(
        `npm version ${npmVersion} is quite old. Consider upgrading to npm 8 or higher.`
      );
    } else {
      logSuccess(`npm version: ${npmVersion}`);
    }
  } catch (error) {
    logError("Failed to check system requirements");
    logError(error.message);
    process.exit(1);
  }
}

function loadConfig() {
  try {
    const configPath = path.join(__dirname, "setup-config.json");
    const configData = fs.readFileSync(configPath, "utf8");
    return JSON.parse(configData);
  } catch (error) {
    logError("Failed to load setup configuration");
    logError(error.message);
    process.exit(1);
  }
}

function runCommand(command, directory, description) {
  try {
    log(`   Running: ${command}`, "blue");
    execSync(command, {
      cwd: directory,
      stdio: "inherit",
      encoding: "utf8",
    });
    logSuccess(description);
    return true;
  } catch (error) {
    logError(`Failed: ${description}`);
    logError(`Command: ${command}`);
    logError(`Directory: ${directory}`);
    return false;
  }
}

function installDependencies(config) {
  logStep(2, "Installing dependencies...");

  const steps = config.setup.steps;
  let successCount = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const fullPath = path.resolve(step.directory);

    log(`\n   ${i + 1}/${steps.length} ${step.name}`, "magenta");

    if (runCommand(step.command, fullPath, step.description)) {
      successCount++;
    } else {
      logWarning(`Skipping remaining steps due to failure in: ${step.name}`);
      break;
    }
  }

  return successCount === steps.length;
}

function showCompletionMessage(config) {
  log("\n" + "=".repeat(60), "green");
  log(`🎉 ${config.project.name} Setup Complete!`, "green");
  log("=".repeat(60), "green");

  log(`\n${config.setup.postInstall.message}`, "bright");

  config.setup.postInstall.commands.forEach((cmd, index) => {
    log(`\n${index + 1}. ${cmd}`, "cyan");
  });

  log("\n📚 Additional Information:", "bright");
  log(
    `   • Frontend will run on: http://localhost:${config.ports.frontend}`,
    "blue"
  );
  log(
    `   • Backend will run on: http://localhost:${config.ports.backend}`,
    "blue"
  );
  log(`   • Demo mode doesn't require API keys`, "blue");
  log(`   • Full mode requires Firebase and OpenAI configuration`, "blue");

  log("\n📖 For more information, check the README.md file", "yellow");
  log("=".repeat(60), "green");
}

function main() {
  log("🚀 CelebrateHub Setup Script", "bright");
  log("============================", "bright");

  try {
    // Check requirements
    checkRequirements();

    // Load configuration
    const config = loadConfig();

    // Install dependencies
    const success = installDependencies(config);

    if (success) {
      showCompletionMessage(config);
    } else {
      logError("\nSetup failed. Please check the errors above and try again.");
      process.exit(1);
    }
  } catch (error) {
    logError("\nSetup script encountered an unexpected error:");
    logError(error.message);
    process.exit(1);
  }
}

// Run the setup
if (require.main === module) {
  main();
}

module.exports = { main, checkRequirements, loadConfig, installDependencies };
