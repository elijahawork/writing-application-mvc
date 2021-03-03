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
    // writeFileSync(this.filePath, this.logContent);
  }
  
  public static create() {
    const logName =
      new Date().toJSON().replace(/[-:]/g, '.') + '.log';
    return new Log(logName);
  }
  public print(msg: string) {
    const prefixedMsg = `MSG: ${msg}\n`; 
    console.log(prefixedMsg);
    this.logContent += prefixedMsg;
    this.updateLog();
  }
  public warn(msg: string) {
    const prefixedMsg = `WARNING: ${msg}\n`; 
    console.warn(prefixedMsg);
    this.logContent += prefixedMsg;
    this.updateLog();
  }
  public error(msg: string) {
    const prefixedMsg = `ERROR: ${msg}\n`; 
    console.error(prefixedMsg);
    this.logContent += prefixedMsg;
    this.updateLog();
  }
}
export default Log;
