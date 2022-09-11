import joke from "./joke";
import cointoss from "./cointoss";
import breakReminder from "./breakReminder";
import mentalHealthHelp from "./mentalHealthHelp";
import { ping } from "./ping";
import { resources } from "./resources";
import { pairProgrammingApplication } from "./pairProgrammingApplication";
import type { SlashCommand } from '../../types';

// js exports
const jscmds = [
  joke,
  mentalHealthHelp,
  cointoss,
  breakReminder 
] as unknown as SlashCommand[];

// ts exports
export const commands: SlashCommand[] = [
  ping,
  resources,
  pairProgrammingApplication,
  ...jscmds
];
