import axios from 'axios';
import * as _ from 'lodash';

import { asyncSleep } from 'src/lib/asyncSleep';
import { logger } from 'src/lib/logger/_index';
import { OrderInterface } from 'src/db/schemas/order.schema';
import { ONE_MINUTE_IN_MS } from 'src/lib/const';

export async function notifyProvider(order: OrderInterface, attempt = 0) {
  try {
    logger.log(`Notify provider ${JSON.stringify(order)}, attempt: ${attempt}`);
    return await axios.post(`${process.env.PARTNER_API}/api/orders`, order, {
      auth: {
        username: process.env.PARTNER_USERNAME,
        password: process.env.PARTNER_PASSWORD,
      },
    });
  } catch (e) {
    if (_.get(e, 'response.data', '') === 'Order already exists.') {
      return null;
    }
    logger.error(e.message);
    if (
      _.get(e, 'response.status') >= 500 &&
      attempt < _.toNumber(process.env.MAX_API_RETRY)
    ) {
      await asyncSleep(ONE_MINUTE_IN_MS);
      return notifyProvider(order, ++attempt);
    }
    throw e;
  }
}
