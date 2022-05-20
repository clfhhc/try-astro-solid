import { toSubscribable } from '@/lib/callbag/toSubscribable';
import { typewriter } from '@/lib/callbag/typewriter';
import { from } from 'solid-js';

export interface Props {
  words: string[];
  random?: boolean;
}

function Typewriter({ words, random }: Props) {
  const value = from<string>(toSubscribable(typewriter({ words, random })));
  return <span>{value() || '\u200B'}</span>;
}

export default Typewriter;
