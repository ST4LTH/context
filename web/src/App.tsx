import { createSignal, type Component } from "solid-js";
import { createStore } from "solid-js/store";
import { itemType } from "./types";
import ContextList from "@/components/contextList";
import { post } from "./misc";

export type storeType = {
  list: itemType[];
};

const App: Component = () => {
  let contextRef!: HTMLDivElement;
  const [store, setStore] = createStore<storeType>({
    list: [
      {
        icon: "mdi:police-badge",
        label: "Police actions",
        subItems: [{ label: "Search", subItems: [{ label: "Search" }] }],
      },
      {
        icon: "mdi:police-badge",
        label: "Police actions",
        subItems: [{ label: "Asd" }],
      },
    ],
  });
  const [coords, setCoords] = createSignal<number[]>([0, 700])
  const [drawer, setDrawer] = createSignal<number>(-1)

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
        class="absolute shadow-lg"
      >
        <ContextList
          list={store.list}
          handleClick={handleClick}
          drawer={drawer}
        />
      </div>
    </div>
  );
};

export default App;
