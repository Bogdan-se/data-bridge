import axios from 'axios';
import * as _ from 'lodash';

import { asyncSleep } from 'src/lib/asyncSleep';
import { OrderInterface } from 'src/db/schemas/order.schema';
import { ONE_MINUTE_IN_MS } from 'src/lib/const';

export async function notifyProvider(
  order: OrderInterface,
  attempt: number = 0,
) {
  try {
    console.log(
      `Notify provider ${JSON.stringify(order)}, attempt: ${attempt}`,
    );
    return await axios.post(`${process.env.PARTNER_API}/api/orders`, order, {
      auth: {
        username: process.env.PARTNER_USERNAME,
        password: process.env.PARTNER_PASSWORD,
      },
    });
  } catch (e) {
    if (_.get(e, 'response.data', '') === 'Order already exists.') {
      return;
    }
    if (
      _.get(e, 'response.status') !== 400 &&
      attempt < _.toNumber(process.env.MAX_API_RETRY)
    ) {
      console.log(`Retry ${JSON.stringify(e)}, attempt: ${attempt}`);
      await asyncSleep(ONE_MINUTE_IN_MS);
      return notifyProvider(order, ++attempt);
    }
    throw e;
  }
}
