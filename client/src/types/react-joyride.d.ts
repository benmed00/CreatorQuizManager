// Type declaration file for react-joyride
import 'react-joyride';

declare module 'react-joyride' {
  export enum STATUS {
    IDLE = 'idle',
    READY = 'ready',
    RUNNING = 'running',
    PAUSED = 'paused',
    FINISHED = 'finished',
    SKIPPED = 'skipped',
    ERROR = 'error',
  }
}