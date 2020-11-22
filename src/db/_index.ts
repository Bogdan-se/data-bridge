import { MongooseModule } from '@nestjs/mongoose';
import { CarrierSchema } from './schemas/carrier.schema';
import { CarrierService } from './carrier.service';
import { OrderSchema } from './schemas/order.schema';
import { OrderService } from './order.service';
import { PartnerSchema } from './schemas/partner.schema';
import { PartnerService } from './partner.service';

export const dbImports = [
  MongooseModule.forRoot(process.env.DB_CONNECTION),
  MongooseModule.forFeature([
    { name: 'Carrier', schema: CarrierSchema },
    { name: 'Order', schema: OrderSchema },
    { name: 'Partner', schema: PartnerSchema },
  ]),
];

export const dbProviders = [CarrierService, OrderService, PartnerService];
