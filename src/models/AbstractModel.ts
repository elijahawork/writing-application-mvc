import { writeFileSync } from 'fs';
import { join } from 'path';
import { __PROJ_NAME } from '..';
import SchemaField from '../decorators/SchemaField';
import ISchema from '../schema/IModelSchema';

abstract class AbstractModel<Schema extends ISchema> {
  private readonly model: Schema = {} as Schema;
  private readonly EXT: string;

  private get filePath() {
    return join(__PROJ_NAME, `${this.id}.${this.EXT}`);
  }

  @SchemaField
  id: number;
  /**
   * 
   * @param ext Extension for file that serialized data to store in
   * @param obj The object that contains the data for the specified Schema
   */
  constructor(ext: string, obj: Schema) {
    this.EXT = ext;
    this.id = obj.id;
  }

  protected updateFile() {
    writeFileSync(this.filePath, JSON.stringify(this.model));
  }
}

export default AbstractModel;
