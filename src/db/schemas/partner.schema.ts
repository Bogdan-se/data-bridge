import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Partner extends Document {
  @Prop()
  provider: string;

  @Prop({ unique: true })
  inboundApiKey: string;

  @Prop()
  outboundApiKey: string;

  @Prop()
  url: string;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);
