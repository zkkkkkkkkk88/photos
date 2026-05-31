interface TagProps {
  label: string;
  onRemove?: () => void;
  color?: string;
}

export default function Tag({ label, onRemove, color = 'bg-gold text-white' }: TagProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label.startsWith('#') ? label : `#${label}`}
      {onRemove && (
        <button onClick={onRemove} className="ml-0.5 hover:opacity-70">&times;</button>
      )}
    </span>
  );
}
