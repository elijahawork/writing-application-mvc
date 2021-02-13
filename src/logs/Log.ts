import { writeFile, writeFileSync } from 'fs';
import { join } from 'path';
import { __LOG_PATH } from '..';

class Log {
  private logContent: string = 'Created log\n';
  private logName: string;
  
  private get filePath() {
    return join(__LOG_PATH, this.logName);
  }

  private constructor(name: string) {
    this.logName = name;
    this.updateLog();
  }
  
  private updateLog() {
    writeFileSync(this.filePath, this.logContent);
  }
  
  public static create() {
    const logName =
      new Date().toJSON().replace(/[-:]/g, '.') + '.log';
    return new Log(logName);
  }
  public print(msg: string) {
    this.logContent += `MSG: ${msg}\n`;
    this.updateLog();
  }
  public warn(msg: string) {
    this.logContent += `WARNING: ${msg}\n`;
    this.updateLog();
  }
  public error(msg: string) {
    this.logContent += `ERROR: ${msg}\n`;
    this.updateLog();
  }
}
export default Log;
