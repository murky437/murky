import { For, type JSX, onCleanup, onMount } from 'solid-js';
import Sortable from 'sortablejs';

interface Props<T> {
  items: T[];
  onChange: (items: T[]) => void;
  onIndexChange: (oldIndex: number, newIndex: number) => void;
  children: (item: T) => JSX.Element;
}

const SortableList: <T>(props: Props<T>) => JSX.Element = props => {
  let listRef: HTMLUListElement | undefined;

  onMount(() => {
    if (!listRef) {
      return;
    }
    const placeholderMap = new WeakMap<HTMLElement, Comment>();

    const sortable = Sortable.create(listRef, {
      animation: 150,
      ghostClass: 'ghost',
      onEnd: e => {
        const arr = [...props.items];
        const [moved] = arr.splice(e.oldIndex!, 1);
        arr.splice(e.newIndex!, 0, moved);
        props.onChange(arr);
        props.onIndexChange(e.oldIndex!, e.newIndex!);
      },
      // onChoose and onSort are used to revert sortablejs dom changes so that solidJS dom manipulation doesn't break
      onChoose(e) {
        // place a comment to where we took the item
        const placeholder = document.createComment('sort-placeholder');
        placeholderMap.set(e.item, placeholder);
        e.item.after(placeholder);
      },
      onSort(e) {
        // put the item back to its position
        const placeholder = placeholderMap.get(e.item);
        if (placeholder) {
          placeholder.replaceWith(e.item);
          placeholderMap.delete(e.item);
        }
      },
    });

    onCleanup(() => sortable.destroy());
  });

  return (
    <ul ref={listRef}>
      <For each={props.items}>{item => props.children(item)}</For>
    </ul>
  );
};

export { SortableList };
