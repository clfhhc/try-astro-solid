import fromPromise from 'callbag-from-promise';
import take from 'callbag-take';

export function fromFetch(...args: Parameters<typeof fetch>) {
  const source = fromPromise(fetch(...args).then((res) => res.json()));
  return take(1)(source);
}
