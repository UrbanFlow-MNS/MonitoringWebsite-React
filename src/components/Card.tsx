interface Props {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}

export default function Card({ title, action, children, noPadding = false }: Props) {
  return (
    <div
      className="rounded-[0.875rem] flex flex-col"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E5EA',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {(title || action) && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #E5E5EA' }}
        >
          {title && (
            <h2 style={{ fontWeight: 600, fontSize: 14, color: '#0A0A0A', margin: 0 }}>
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
