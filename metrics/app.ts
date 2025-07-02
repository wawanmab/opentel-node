import { metrics } from '@opentelemetry/api';
import express, { Express } from 'express';
import { rollTheDice } from './dice';

const meter = metrics.getMeter('dice-server-metric', '0.1.2');

const PORT: number = parseInt(process.env.PORT || '8005');
const app: Express = express();


// {
//   descriptor: {
//     name: 'rolldice.duration',
//     type: 'HISTOGRAM',
//     description: '',
//     unit: '',
//     valueType: 1,
//     advice: {}
//   },
//   dataPointType: 0,
//   dataPoints: [
//     {
//       attributes: {},
//       startTime: [ 1751426479, 589000000 ],
//       endTime: [ 1751426487, 191000000 ],
//       value: {
//         min: 0,
//         max: 0,
//         sum: 0,
//         buckets: {
//           boundaries: [
//                0,    5,    10,   25,
//               50,   75,   100,  250,
//              500,  750,  1000, 2500,
//             5000, 7500, 10000
//           ],
//           counts: [
//             1, 0, 0, 0, 0, 0,
//             0, 0, 0, 0, 0, 0,
//             0, 0, 0, 0
//           ]
//         },
//         count: 1
//       }
//     }
//   ]
// }
app.get('/rolldice', (req, res) => {
  const histogram = meter.createHistogram('rolldice.duration');
  const startTime = new Date().getTime();

  // do some work in an API call
  const rolls = req.query.rolls ? parseInt(req.query.rolls.toString()) : NaN;

  const endTime = new Date().getTime();
  const executionTime = endTime - startTime;
  
  // Record the duration of the task operation
  histogram.record(executionTime);
  
  if (isNaN(rolls)) {
    res
      .status(400)
      .send("Request parameter 'rolls' is missing or not a number.");
    return;
  }
  
  res.send(JSON.stringify(rollTheDice(rolls, 1, 6)));
});


app.get('/', (req, res) => {
  res.send('Running!!');
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
})