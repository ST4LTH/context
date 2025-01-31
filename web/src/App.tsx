import { createSignal, type Component } from "solid-js";
import { Transition } from "solid-transition-group";
import { createStore } from "solid-js/store";
import { itemType } from "./types";
import ContextList from "@/components/contextList";
import { post } from "./misc";
import { useNuiEvent } from "./hooks/useNuiEvent";

export type storeType = {
  open: boolean;
  list: itemType[];
};

const App: Component = () => {
  let contextRef!: HTMLDivElement;
  const [store, setStore] = createStore<storeType>({
    open: true,
    list: [],
  });
  const [coords, setCoords] = createSignal<number[]>([0, 700])
  const [drawer, setDrawer] = createSignal<number>(-1)

  useNuiEvent('setMenu', (data:itemType[]) => {
    console.log(JSON.stringify(data))
    setStore('list', data)
  })

  useNuiEvent('toggleContext', (data:boolean) => {
    setStore('open', data)
  })

  const handleContext = (event: MouseEvent): void => {
    event.preventDefault()
    post('click')
    setDrawer(-1)
    setCoords([
      event.clientX - contextRef.offsetWidth / 2,
      event.clientY - contextRef.offsetHeight / 2,
    ]);
  };

  const handleClick = (e: MouseEvent, index: number): void => {
    e.stopPropagation()
    if (drawer() == index) {
      setDrawer(-1)
      return
    }
    setDrawer(index)
  }

  return (
    <div
      class="absolute w-full h-full select-none"
      onContextMenu={handleContext}
    >
      <div
        ref={contextRef}
        style={{ left: `${coords()[0]}px`, top: `${coords()[1]}px` }}
        class='absolute min-w-[20vh] min-h-[3vh]'
      >
        <Transition name="scale-fade">
          { store.open && store.list.length > 0 &&
            <ContextList
              list={store.list}
              handleClick={handleClick}
              drawer={drawer}
            />
          }
        </Transition>
      </div>
    </div>
  );
};

export default App;
