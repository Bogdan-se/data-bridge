import axios from 'axios';
import * as _ from 'lodash';

import { asyncSleep } from 'src/lib/asyncSleep';
import { OrderInterface } from 'src/db/schemas/order.schema';
import { ONE_MINUTE_IN_MS } from 'src/lib/const';
import { Partner } from 'src/db/schemas/partner.schema';

export async function notifyPartner(
  order: OrderInterface,
  partner: Partner,
  attempt: number = 0,
) {
  try {
    console.log(`Notify partner ${JSON.stringify(order)}, attempt: ${attempt}`);
    return await axios.patch(
      `${partner.url}/api/orders/${order.OrderID}`,
      {
        state: process.env.PARTNER_ORDER_FINISHED,
      },
      {
        headers: {
          'X-API-KEY': partner.outboundApiKey,
        },
      },
    );
  } catch (e) {
    console.log(e.message);
    if (
      _.get(e, 'response.status') !== 400 &&
      attempt < _.toNumber(process.env.MAX_API_RETRY)
    ) {
      console.log(`Retry ${JSON.stringify(e)}, attempt: ${attempt}`);

      await asyncSleep(ONE_MINUTE_IN_MS);
      return notifyPartner(order, partner, ++attempt);
    }
    throw e;
  }
}
