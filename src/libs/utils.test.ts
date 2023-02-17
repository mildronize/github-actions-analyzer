import test from "ava";
import { setDefaultValue } from "./utils";


interface IMember {
  name: string;
  age?: number;
  address?: string;
}

test("test setDefaultValue", (t) => {
  const input: IMember = {
    name: 'bobby'
  }
  const actual = setDefaultValue<IMember>(input, {
    age: 35
  });
  //  as PartialRequired<IMember, 'age'>;

  const expected: IMember = {
    name: 'bobby',
    age: 35
  }

  t.deepEqual(actual, expected);
});



setDefaultValue
