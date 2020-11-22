import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Carrier extends Document {
  @Prop()
  id: number;

  @Prop()
  name: string;
}

export const CarrierSchema = SchemaFactory.createForClass(Carrier);
