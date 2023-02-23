
import test from 'ava';
import { stringifyArrayToCsvRow } from './csv-parsers';


test('test stringifyArrayToCsvRow', t => {
  t.is(stringifyArrayToCsvRow([]), '');
  t.is(stringifyArrayToCsvRow([`1`]), `"1"`);
  t.is(stringifyArrayToCsvRow([`1`,`2`]), `"1","2"`);
  t.is(stringifyArrayToCsvRow([`1`,`2"`]), `"1","2"""`);
  t.is(stringifyArrayToCsvRow([`1,`,`2"`]), `"1,","2"""`);
});
