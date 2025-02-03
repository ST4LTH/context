import { post } from "@/misc";
import { itemType } from "@/types";
import { Icon } from "@iconify-icon/solid";
import { createSignal } from "solid-js";

const ContextList = ({
    list,
    drawer,
    handleClick,
}: {
    list: itemType[];
    drawer: () => number;
    handleClick: (e: MouseEvent, index: number) => void;
}) => {

    console.log("Rendering ContextList with list:", list[0].label);
    const [subDrawer, setSubDrawer] = createSignal<number>(-1);

    const handleSubClick = (e: MouseEvent, index: number): void => {
        e.stopPropagation();
        const items = list[drawer()].subItems
        console.log(JSON.stringify(list[index]))

        if (!items) return
        if (items[index]?.subItems) {
            if (subDrawer() == index) {
                setSubDrawer(-1)
                return
            }
            setSubDrawer(index)
            return
        }
      
        console.log(index)
        console.log(JSON.stringify(list))
        post('action', items[index])
    };

    return (
        <div class="context border border-transparent flex flex-col divide-y divide-gray-300 min-w-[20vh] w-fit h-fit text-white">
            {list.map((item, index) => (
                <div
                    onClick={(e) => handleClick(e, index)}
                    class="contextItem font-bold relative w-full flex items-center gap-[0.8vh] hover:bg-black/30 px-[0.8vh] py-[0.5vh]"
                >
                    {item.icon && <Icon class="text-[2vh] w-[2vh] h-[2vh]" icon={item.icon} />}
                    <p class="text-[1.3vh]">{item.label}</p>
                    <div class="flex-grow" />
                    {item.subItems && (
                        <Icon
                            class="text-[2vh]"
                            icon={
                                index === drawer()
                                    ? "pixelarticons:close"
                                    : "pixelarticons:list"
                            }
                        />
                    )}
                    {drawer() === index && item?.subItems && (
                        <div class="absolute translate-x-[100%]">
                            <ContextList
                                list={item.subItems}
                                handleClick={handleSubClick}
                                drawer={subDrawer}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ContextList;