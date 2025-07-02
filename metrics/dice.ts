import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('dice-lib', '0.0.3');
const counter = meter.createCounter('dice-lib.rolls.counter');

// {
//   descriptor: {
//     name: 'dice-lib.rolls.counter',
//     type: 'COUNTER',
//     description: '',
//     unit: '',
//     valueType: 1,
//     advice: {}
//   },
//   dataPointType: 3,
//   dataPoints: [
//     {
//       attributes: {},
//       startTime: [ 1751426479, 589000000 ],
//       endTime: [ 1751426487, 191000000 ],
//       value: 3
//     }
//   ]
// }
function rollOnce(i: number, min: number, max: number) {
  const result = Math.floor(Math.random() * (max - min + 1) + min);
  counter.add(1); // metrics counter
  return result;
}

export function rollTheDice(rolls: number, min: number, max: number) {
  const result: number[] = [];
  for (let i = 0; i < rolls; i++) {
    result.push(rollOnce(i, min, max));
  }
  return result;
}