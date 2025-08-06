import { SoundModes } from "./types"
import * as fs from 'fs';
import {version} from '../package.json';

function checkInt(s: string | undefined): number | undefined {
  return s ? parseInt(s) : undefined
}

let deviceType: string = process.env.BALENA_DEVICE_TYPE ?? 'unknown'

export function defaultMode(): SoundModes {
  return ['raspberry-pi', 'raspberry-pi2', 'unknown'].includes(deviceType) ? SoundModes.STANDALONE : SoundModes.MULTI_ROOM
}

const VERSIONTAGS: {file?: string; packageJson: string} = {packageJson: version};
try {
  VERSIONTAGS.file = fs.readFileSync('VERSION', 'utf-8').trim();
} catch (e) {
  console.error('Error when reading VERSION file', e);
}

const VERSION = VERSIONTAGS.file ?? VERSIONTAGS.packageJson;

export const constants = {
  version: VERSION,
  debug: process.env.SOUND_SUPERVISOR_DEBUG ? true : false,
  port: checkInt(process.env.SOUND_SUPERVISOR_PORT) ?? 80,
  coteDelay: checkInt(process.env.SOUND_COTE_DELAY) ?? 5000,
  mode: (<SoundModes>process.env.SOUND_MODE) ?? defaultMode(),
  balenaDeviceType: deviceType,
  multiroom: {
    master: process.env.SOUND_MULTIROOM_MASTER,
    forced: process.env.SOUND_MULTIROOM_MASTER ? true : false,
    pollInterval: (checkInt(process.env.SOUND_MULTIROOM_POLL_INTERVAL) ?? 60) * 1000,
    disallowUpdates: process.env.SOUND_MULTIROOM_DISALLOW_UPDATES ? true : false
  },
  volume: checkInt(process.env.SOUND_VOLUME) ?? 75,
  inputSink: process.env.SOUND_INPUT_SINK ?? 'balena-sound.input'
}

