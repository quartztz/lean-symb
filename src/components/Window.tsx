import React from 'react';

type WindowProps = {
  title: string;
  id: string;
  link?: string;
  fill?: boolean
};

export const Window = ({ title, id, link, fill = false, children }: React.PropsWithChildren<WindowProps>) => {
  return (
    <div className={`w-full bg-uchu-light-gray ${fill ? "grow flex flex-col" : ""}`} id={id}>
      <h3 className="window-title w-full p-2 flex flex-row items-start text-xs font-semibold bg-uchu-gray">
        {link ? <a href={link}>{title}</a> : title}
      </h3>
      <div className={`prose w-full p-2 flex flex-col gap-1 leading-[140%] h-full`} id={`${id}_child`}>
        {children}
      </div>
    </div>
  );
}