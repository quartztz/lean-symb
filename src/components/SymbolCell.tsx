type SymbolCellProps = {
  child: string,
  hover: string[]
}

export const SymbolCell = ({ child, hover }: SymbolCellProps) => {
  return (
    <div className="
      relative group aspect-square flex flex-col items-center justify-center
      bg-transparent hover:bg-uchu-gray hover:shadow-xs transition-colors
      duration-75 cursor-pointer rounded">
      <span className="text-2xl leading-none mb-2 font-math whitespace-nowrap">
        {child}
      </span>
      <span className="symbol-blurb text-xs leading-none font-mono no-common-ligatures w-full px-1 py-1 text-center truncate">
        {`\\${hover[0]}`}
      </span>
    </div>
  )
}