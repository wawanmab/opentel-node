import { trace, Span } from '@opentelemetry/api';
import express, { Express } from 'express';
import { rollTheDice } from './dice';

const tracer = trace.getTracer('dice-server', '0.0.1');

const PORT: number = parseInt(process.env.PORT || '8005');
const app: Express = express();

app.get('/rolldice', (req, res) => {
  const rolls = req.query.rolls ? parseInt(req.query.rolls.toString()) : NaN;
  if (isNaN(rolls)) {
    res
      .status(400)
      .send("Request parameter 'rolls' is missing or not a number.");
    return;
  }

  res.send(JSON.stringify(rollTheDice(rolls, 1, 6)));
});

app.get('/test-error', (req, res) => {
  const span = tracer.startSpan('errorpage-1');
  console.log('error-page');
  span.addEvent('some log', {
    'log.severity': 'error',
    'log.message': 'Data not found',
    'request.id': 'abc1',
  });
  
  span.end();
  res.send('Error Page');
});
// result on /test-error
// {
//   resource: {
//     attributes: {
//       'service.name': 'example-service-name',
//       'service.version': '0.1.1',
//       'telemetry.sdk.language': 'nodejs',
//       'telemetry.sdk.name': 'opentelemetry',
//       'telemetry.sdk.version': '2.0.1'
//     }
//   },
//   instrumentationScope: { name: 'dice-server', version: '0.0.1', schemaUrl: undefined },
//   traceId: '14044f1ef10c4a11b57102a0f0ad0369',
//   parentSpanContext: undefined,
//   traceState: undefined,
//   name: 'errorpage-1',
//   id: '76b62ae0edf96dc2',
//   kind: 0,
//   timestamp: 1751361608089000,
//   duration: 477.219,
//   attributes: {},
//   status: { code: 0 },
//   events: [
//     {
//       name: 'some log',
//       attributes: {
//         'log.severity': 'error',
//         'log.message': 'Data not found',
//         'request.id': 'abc1'
//       },
//       time: [ 1751361608, 89428002 ],
//       droppedAttributesCount: 0
//     }
//   ],
//   links: []
// }


app.get('/', (req, res) => {
  const span1 = tracer.startSpan('homepage-1');
  console.log('home-page');
  span1.end();
  res.send('Running!!');
});
// result on homepage
// {
//   resource: {
//     attributes: {
//       'service.name': 'example-service-name',
//       'service.version': '0.1.1',
//       'telemetry.sdk.language': 'nodejs',
//       'telemetry.sdk.name': 'opentelemetry',
//       'telemetry.sdk.version': '2.0.1'
//     }
//   },
//   instrumentationScope: { name: 'dice-server', version: '0.0.1', schemaUrl: undefined },
//   traceId: '393e92c1ffbc9437959ea6a6afd58b8b',
//   parentSpanContext: undefined,
//   traceState: undefined,
//   name: 'work-1',
//   id: '84f63950dd4b4665',
//   kind: 0,
//   timestamp: 1751361455723000,
//   duration: 264.238,
//   attributes: {},
//   status: { code: 0 },
//   events: [],
//   links: []
// }

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
})