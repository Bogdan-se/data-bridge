import axios from 'axios';
import * as _ from 'lodash';

import { asyncSleep } from 'src/lib/asyncSleep';
import { ONE_MINUTE_IN_MS } from 'src/lib/const';

export async function waitForStatusUpdate(orderId: string) {
  let attempt = 0;
  while (true) {
    console.log(`Wait for status update for ${orderId}, attempt: ${attempt}`);

    const response = await axios.get(
      `${process.env.PARTNER_API}/api/orders/${orderId}/state`,
      {
        auth: {
          username: process.env.PARTNER_USERNAME,
          password: process.env.PARTNER_PASSWORD,
        },
      },
    );

    console.log(response.data);

    if (_.get(response, 'data.State') === process.env.PARTNER_ORDER_FINISHED) {
      return response;
    }

    if (attempt > _.toNumber(process.env.MAX_API_RETRY)) {
      throw new Error('Max retry occurred');
    }

    await asyncSleep(ONE_MINUTE_IN_MS);
    attempt++;
  }
}
