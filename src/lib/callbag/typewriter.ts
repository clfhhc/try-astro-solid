import { createSource } from '@clfhhc/callbag-toolkit';

function changeWord({
  wordPointer,
  length,
  random,
}: {
  wordPointer: number;
  length: number;
  random: boolean;
}) {
  let newWordPointer = wordPointer;
  if (random) {
    while (newWordPointer === wordPointer) {
      newWordPointer = Math.floor(Math.random() * length);
    }
  } else {
    newWordPointer = (wordPointer + 1) % length;
  }
  return newWordPointer;
}

export function typewriter({
  words,
  typeDuration = 80,
  showDuration = 3000,
  random = false,
}: {
  words: string[];
  typeDuration?: number;
  showDuration?: number;
  random?: boolean;
}) {
  return createSource<string>(({ next, start, complete }) => {
    start();
    const { length } = words;
    if (!words.length) {
      next('');
      complete();
      return;
    }

    let wordPointer = 0;
    let charPointer = words[0].length;
    let forward = true;
    let currentTimeout: ReturnType<typeof setTimeout>;

    const nextStep = () => {
      next(words[wordPointer].slice(0, charPointer));
      let time = typeDuration;
      if (forward && charPointer === 0) {
        wordPointer = changeWord({ wordPointer, length, random });
        charPointer += 1;
      } else if (
        forward &&
        charPointer > 0 &&
        charPointer < words[wordPointer].length
      ) {
        charPointer += 1;
      } else if (forward && charPointer === words[wordPointer].length) {
        time = showDuration;
        forward = false;
        charPointer -= 1;
      } else if (!forward && charPointer > 1) {
        charPointer -= 1;
      } else if (!forward && charPointer === 1) {
        charPointer -= 1;
        forward = true;
      }
      currentTimeout && clearTimeout(currentTimeout);
      currentTimeout = setTimeout(nextStep, time);
    };
    nextStep();

    return {
      pull: () => {
        nextStep();
      },
      stop: () => {
        clearTimeout(currentTimeout);
      },
    };
  });
}
