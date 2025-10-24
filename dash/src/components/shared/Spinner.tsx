import { type Component, onCleanup, onMount } from 'solid-js';
import { createMutable } from 'solid-js/store';

interface Props {
  class?: string;
}

const Spinner: Component<Props> = props => {
  const frames = ['·', '•', '●', '•'];
  const frame = createMutable({ char: frames[0] });

  let i = 0;
  let id: ReturnType<typeof setInterval>;

  onMount(() => {
    id = setInterval(() => {
      i = (i + 1) % frames.length;
      frame.char = frames[i];
    }, 100);
  });

  onCleanup(() => {
    clearInterval(id);
  });

  return <span class={props.class ?? ''}>{frame.char}</span>;
};

export { Spinner };
