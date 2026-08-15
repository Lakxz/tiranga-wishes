const Chakra = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
    <circle cx="50" cy="50" r="7" fill="currentColor" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="50"
        y1="50"
        x2="50"
        y2="6"
        stroke="currentColor"
        strokeWidth="2.5"
        transform={`rotate(${i * 15} 50 50)`}
      />
    ))}
  </svg>
);

export const WavingFlag = ({ className = "" }: { className?: string }) => (
  <div className={`flag-wrap ${className}`}>
    <div className="flag-cloth">
      <div className="flag-band bg-saffron" />
      <div className="flag-band flag-band-white">
        <Chakra className="chakra text-navy" />
      </div>
      <div className="flag-band bg-india-green" />
      <div className="flag-shade" />
    </div>
  </div>
);

export const ChakraMark = Chakra;
