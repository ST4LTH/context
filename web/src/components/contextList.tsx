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
    const [subDrawer, setSubDrawer] = createSignal<number>(-1);

    const handleSubClick = (e: MouseEvent, index: number): void => {
        e.stopPropagation();

        if (list[index]?.subItems) {
            if (subDrawer() == index) {
                setSubDrawer(-1)
                return
            }
            setSubDrawer(index)
            return
        }
      
        post('action', list[index])
    };

    return (
        <div class="context shadow-lg flex flex-col min-w-[20vh] w-fit h-fit p-[0.35vh] rounded-[0.7vh] text-white">
            {list.map((item, index) => (
                <div
                    onClick={(e) => handleClick(e, index)}
                    class="contextItem relative rounded-[0.5vh] w-full flex items-center gap-[0.8vh] hover:bg-black/30 px-[0.8vh] py-[0.5vh]"
                >
                    {item.icon && <Icon class="text-[1.4vh]" icon={item.icon} />}
                    <p class="text-[1.3vh]">{item.label}</p>
                    <div class="flex-grow" />
                    {item.subItems && (
                        <Icon
                            class="text-[1.5vh]"
                            icon={
                                index === drawer()
                                    ? "mdi:close"
                                    : "mdi:format-list-bulleted"
                            }
                        />
                    )}
                    {drawer() === index && item?.subItems && (
                        <div class="absolute translate-x-[95%]">
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