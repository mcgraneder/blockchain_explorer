import { Listbox, Transition } from "@headlessui/react";
import { UilAngleDown } from "@iconscout/react-unicons";
import { Fragment, useState } from "react";

type Item = { name: string; id?: number };

interface SelectListBoxProps {
  items: Array<Item>;
  containerClassName?: string;
  onChange: (item: Item) => Promise<void> | void;
}

export default function SelectListBox({
  items,
  containerClassName = "",
  onChange,
}: SelectListBoxProps) {
  const [selected, setSelected] = useState(items[0]);

  async function handleOnChange(item: Item) {
    setSelected(item);
    await onChange?.(item);
  }

  return (
    <div className={`${containerClassName}`}>
      <Listbox value={selected} onChange={handleOnChange}>
        <div className='relative'>
          <Listbox.Button className='relative w-full py-2 pl-3 pr-10 text-left bg-transparent border-2 rounded-lg shadow-md cursor-default border-primary focus:outline-none sm:text-sm'>
            <span className='block text-xs font-bold tracking-wide truncate text-primary'>
              {selected.name}
            </span>
            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
              <UilAngleDown className='w-5 h-5 text-primary' aria-hidden='true' />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <Listbox.Options className='absolute py-1 mt-1 overflow-auto text-base border-2 rounded-md shadow-lg border-primary bg-black-800 max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {items.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 px-4 text-white ${
                      active ? "bg-primary/20" : ""
                    }`
                  }
                  value={item}>
                  {({ selected }) => (
                    <>
                      <span className={`block truncate text-primary font-bold tracking-wide`}>
                        {item.name}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
