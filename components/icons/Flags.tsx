type FlagProps = { className?: string };

export function FlagUS({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 60 32"
      aria-hidden
      className={className}
      role="presentation"
    >
      <rect width="60" height="32" fill="#bf0a30" />
      <g fill="#ffffff">
        <rect y="2.46" width="60" height="2.46" />
        <rect y="7.38" width="60" height="2.46" />
        <rect y="12.31" width="60" height="2.46" />
        <rect y="17.23" width="60" height="2.46" />
        <rect y="22.15" width="60" height="2.46" />
        <rect y="27.08" width="60" height="2.46" />
      </g>
      <rect width="24" height="17.23" fill="#002868" />
    </svg>
  );
}

export function FlagES({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 30 20"
      aria-hidden
      className={className}
      role="presentation"
    >
      <rect width="30" height="20" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
    </svg>
  );
}
