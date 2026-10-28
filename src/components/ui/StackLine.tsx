import { useLayoutEffect, useRef, useState } from "react";

const TAG = "shrink-0 whitespace-nowrap border border-cyber/20 bg-black/50 px-2 py-0.5 text-[13px]";
const GAP = 6; // gap-1.5

/**
 * One line of stack: as many whole tools as fit in the line's width, then « +N » for the rest
 * (three short tools may show four or five, long ones two). Re-measured when the card resizes.
 */
export function StackLine({ tags }: { tags: readonly string[] }) {
  const line = useRef<HTMLDivElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(tags.length);

  useLayoutEffect(() => {
    const element = line.current;
    if (!element) return;
    const fit = () => {
      const measure = ruler.current;
      if (!measure) return;
      const width = element.clientWidth;
      const [plus = 0, ...items] = [...measure.children].map((el) => (el as HTMLElement).offsetWidth);
      let used = 0;
      let count = 0;
      for (const [i, w] of items.entries()) {
        const rest = i < items.length - 1 ? GAP + plus : 0; // room for « +N » unless this is the last tool
        if (used + (i ? GAP : 0) + w + rest > width) break;
        used += (i ? GAP : 0) + w;
        count++;
      }
      setShown(Math.max(count, 1));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, [tags]);

  const more = tags.length - shown;
  return (
    <div ref={line} className="relative mt-auto mb-3 flex flex-nowrap gap-1.5 overflow-hidden">
      {/* Invisible copy used to measure each tool (first child: the widest « +N »). */}
      <div ref={ruler} aria-hidden="true" className="invisible absolute flex">
        <span className={TAG}>+{tags.length}</span>
        {tags.map((tag) => (
          <span key={tag} className={TAG}>{tag}</span>
        ))}
      </div>
      {tags.slice(0, shown).map((tag) => (
        <span key={tag} title={tag} className={`${TAG} min-w-0 truncate text-zinc-300 transition-colors group-hover:border-cyber/60 group-hover:text-cyber/80`}>
          {tag}
        </span>
      ))}
      {more > 0 && <span className={`${TAG} text-cyber/80`}>+{more}</span>}
    </div>
  );
}

