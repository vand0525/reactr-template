#!/usr/bin/env node
import { Command } from "commander";
import { registerAddCommands } from "./add.mjs";
import { registerDeleteCommands } from "./delete.mjs";

const program = new Command();

program
  .name("reactr")
  .description("Project scaffolding CLI")
  .version("1.0.0");

registerAddCommands(program);
registerDeleteCommands(program);

program.parse();