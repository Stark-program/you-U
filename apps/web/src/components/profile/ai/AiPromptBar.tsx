type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function AiPromptBar({ value, onChange, onSubmit, disabled }: Props) {
  return (
    <div className="profile__aiPrompt">
      <label className="profile__aiLabel" htmlFor="ai-prompt">
        Describe how you want your profile to change
      </label>
      <textarea
        id="ai-prompt"
        className="profile__aiTextarea"
        rows={3}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Make the accent purple and cyber, tighten spacing…"
      />
      <button
        type="button"
        className="profile__btn profile__btnPrimary profile__aiRun"
        disabled={disabled || !value.trim()}
        onClick={onSubmit}
      >
        Generate suggestions
      </button>
    </div>
  );
}
