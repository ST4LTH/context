import { createEffect, createSignal, onCleanup, type Component } from "solid-js";
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
  let backgroundRef!: HTMLDivElement;
  const [store, setStore] = createStore<storeType>({
    open: true,
    list: [
      {
        label: 'Test',
        subItems: [
          {
            label: 'Subitem',
            subItems: [
              {
                  label: 'Subitem in a subitem 🤓',
              }
            ]
          }
        ]
      },
      {
        label: 'Test',
        subItems: [
          {
            label: 'Subitem',
            subItems: [
              {
                  label: 'Subitem in a subitem 🤓',
              }
            ]
          }
        ]
      },
      {
        label: 'Test',
        subItems: [
          {
            label: 'Subitem',
            subItems: [
              {
                  label: 'Subitem in a subitem 🤓',
              }
            ]
          }
        ]
      },
    ],
  })
  const [lastCoords, setLastCoords] = createSignal<number[]>([0, 700])
  const [coords, setCoords] = createSignal<number[]>([0, 700])
  const [drawer, setDrawer] = createSignal<number>(-1)
  const [direction, setDirection] = createSignal<'left' | 'right' | 'center'>()

  useNuiEvent('setMenu', (data:itemType[]) => {
    setStore('list', data)
    setTimeout(() => {
      let left = Math.max(0, Math.min(lastCoords()[0] - contextRef.offsetWidth / 2, window.innerWidth - contextRef.offsetWidth))
      let top = Math.max(0, Math.min(lastCoords()[1] - contextRef.offsetHeight / 2, window.innerHeight - contextRef.offsetHeight))
    
      console.log(left, window.innerWidth)
  
      setCoords([left, top])
    })
  })

  useNuiEvent('toggleContext', (data:boolean) => {
    setStore('open', data)
  })

  const handleContext = (event: MouseEvent): void => {
    event.preventDefault()
    post('click')
    setDrawer(-1)
    setLastCoords([event.clientX, event.clientY])
  }

  const handleClick = (e: MouseEvent, index: number) : void => {
    e.stopPropagation()
    if (drawer() == index) {
      setDrawer(-1)
      return
    }
    setDrawer(index)
  }

  const scroll = () => {
    setTimeout(() => {
      if (backgroundRef) {
        backgroundRef.scrollLeft = backgroundRef.scrollWidth;
        backgroundRef.scrollTop = backgroundRef.scrollHeight;
      }
    }, 0);
  }

  const handleMouseMove = (event: MouseEvent): void => {
    let dir: 'left' | 'right' | 'center' = 'center'
  
    if (event.clientX < 50) {
      dir = 'right'
    } else if (event.clientX > window.innerWidth - 50) {
      dir = 'left'
    }
  
    if (dir !== direction()) {
      post(dir)
      setDirection(dir)
    }
  };
  

/*   createEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    onCleanup(() => window.removeEventListener("mousemove", handleMouseMove))
  }); */

  createEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      event.preventDefault()
      scroll()
    }

    document.addEventListener("click", handleGlobalClick)

    onCleanup(() => {
      document.removeEventListener("click", handleGlobalClick)
    })
  })

  return (
    <div
      class="absolute w-full h-full select-none overflow-auto"
      ref={backgroundRef}
      onContextMenu={handleContext}
    >
      <div 
        ref={contextRef}
        style={{ left: `${coords()[0]}px`, top: `${coords()[1]}px` }}
        class='absolute min-w-[20vh] min-h-[3vh]'
      >
        <Transition name="scale-fade">
          {
            store.open && store.list.length > 0 &&
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
