import { writeFileSync } from 'fs';
import { join } from 'path';
import { __PROJ_NAME } from '..';
import ISchema from '../schema/IModelSchema';

abstract class AbstractModel<Schema extends ISchema> {
  protected abstract readonly EXT: string;
  protected abstract readonly model: Schema;
  protected get filePath() {
    return join(__PROJ_NAME, `${this.id}.${this.EXT}`);
  }

  public set id(v) {
    this.model.id = v;
    this.updateFile();
  }
  public get id() {
    return this.model.id;
  }

  protected updateFile() {
    writeFileSync(this.filePath, JSON.stringify(this.model));
  }
}

export default AbstractModel;
