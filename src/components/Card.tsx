interface Props {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function Card({ title, action, children, noPadding = false }: Props) {
  return (
    <div className="rounded-[0.875rem] flex flex-col bg-(--color-bg) border border-(--color-border) shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-(--color-border)">
          {title && (
            <h2 className="text-sm font-semibold text-(--color-fg) m-0">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}
