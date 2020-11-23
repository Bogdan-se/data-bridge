import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface OrderInterface {
  OrderID: string; // required
  InvoiceSendLater: boolean; // allways false
  Issued: string; // required, ISO 8601 date-time format
  OrderType: string; // allways "standard",
  Shipping: {
    CarrierID: number; // required, mapped from carriers list
    DeliveryAddress: {
      AddressLine1: string; // required
      AddressLine2?: string; // optional
      City: string; // required
      Company?: string; // optional
      CountryCode: string; // required, ISO 3166-1 alpha-2,
      Email: string; // required
      PersonName: string; // required
      Phone: string; // required
      State: string; // required
      Zip: string; // required
    };
  };
  Products: {
    Barcode: string; // required, EAN code
    OPTProductID: string; // required, EAN code
    Qty: number; // required
  }[];
}

export const ORDER_STATE = {
  NEW: 'new',
  PROCESSED: 'processed',
  FAILED: 'failed',
  INVALID: 'invalid',
};

@Schema()
export class Order extends Document {
  @Prop()
  partnerId: string;

  @Prop()
  data: OrderInterface | null;

  @Prop()
  originalData: unknown;

  @Prop()
  isValid: boolean;

  @Prop()
  state: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
