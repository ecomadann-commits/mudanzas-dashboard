interface ModeToggleProps {
  mode: 'AI' | 'HUMAN';
  onToggle: () => void;
}

export default function ModeToggle({ mode, onToggle }: ModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
        mode === 'AI'
          ? 'bg-blue-500 hover:bg-blue-600'
          : 'bg-green-500 hover:bg-green-600'
      }`}
    >
      <span className="text-lg">{mode === 'AI' ? '🤖' : '👨'}</span>
      <span className="font-medium">{mode === 'AI' ? 'AI' : 'Humano'}</span>
      <div className="w-10 h-5 bg-white/30 rounded-full relative">
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            mode === 'HUMAN' ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </div>
    </button>
  );
}