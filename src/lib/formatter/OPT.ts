import * as countryFormatter from 'iso-3166-1-alpha-2';
import * as moment from 'moment';
import * as _ from 'lodash';

import { AbstractFormatter } from './abstract';
import { OrderInterface } from 'src/db/schemas/order.schema';
import { CarrierService } from 'src/db/carrier.service';
import { stateDetector } from 'src/lib/stateDetector';

interface orderSchema {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  company?: string;
  zipCode: string;
  city: string;
  country: string;
  carrierKey: string;
  status: string;
  details: {
    productId?: number;
    name?: string;
    quantity: number;
    weight?: number;
    eanCode: string;
  }[];
}

export class OPT extends AbstractFormatter {
  constructor(private readonly carrierService: CarrierService) {
    super();
  }

  async normalizeOrder(order: orderSchema) {
    const carrier = await this.carrierService.findByName(order.carrierKey);
    const countryCode = countryFormatter.getCode(order.country);
    const stateName = await stateDetector(order.zipCode, countryCode);

    return {
      OrderID: _.toString(order.id),
      InvoiceSendLater: false,
      Issued: moment().utc().toISOString(),
      OrderType: 'standard',
      Shipping: {
        CarrierID: carrier?.id,
        DeliveryAddress: {
          AddressLine1: order.addressLine1,
          AddressLine2: order.addressLine2,
          City: order.city,
          Company: order.company,
          CountryCode: countryCode,
          Email: order.email,
          PersonName: order.fullName,
          Phone: order.phone,
          State: stateName,
          Zip: order.zipCode,
        },
      },
      Products: _.map(order.details, (product) => ({
        Barcode: product.eanCode,
        OPTProductID: product.eanCode,
        Qty: product.quantity,
      })),
    } as OrderInterface;
  }
}
