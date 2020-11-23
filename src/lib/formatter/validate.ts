import * as yup from 'yup';
import { OrderInterface } from 'src/db/schemas/order.schema';

const schema = yup.object().shape({
  OrderID: yup.string().required(),
  InvoiceSendLater: yup.boolean().required().oneOf([false]),
  Issued: yup.string().required(),
  OrderType: yup.string().required().oneOf(['standard']),
  Shipping: yup.object().shape({
    CarrierID: yup.number().required(),
    DeliveryAddress: yup.object().shape({
      AddressLine1: yup.string().required(),
      AddressLine2: yup.string().nullable(),
      City: yup.string().required(),
      Company: yup.string().nullable(),
      CountryCode: yup.string().required().min(2).max(2),
      Email: yup.string().email().required(),
      PersonName: yup.string().required(),
      Phone: yup.string().required(),
      State: yup.string().required(),
      Zip: yup.string().required(),
    })
  }),
  Products: yup.array().of(yup.object().shape({
    Barcode: yup.string().required(),
    OPTProductID: yup.string().required(),
    Qty: yup.string().required()
  }))
});

export const validate = async (order: OrderInterface) => schema.validate(order);