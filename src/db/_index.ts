import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CarrierSchema } from './schemas/carrier.schema';
import { CarrierService } from './carrier.service';
import { OrderSchema } from './schemas/order.schema';
import { OrderService } from './order.service';
import { PartnerSchema } from './schemas/partner.schema';
import { PartnerService } from './partner.service';

export const dbImports = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async () => ({
      uri: process.env.MONGO_CONNECTION_STRING,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  }),
  MongooseModule.forFeature([
    { name: 'Carrier', schema: CarrierSchema },
    { name: 'Order', schema: OrderSchema },
    { name: 'Partner', schema: PartnerSchema },
  ]),
];

export const dbProviders = [CarrierService, OrderService, PartnerService];
