import { FormEvent, useState } from "react";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import type {
  JournalDecision,
  PortfolioJournalEntry,
} from "@/types/portfolio";

const emptyForm = {
  id: undefined as string | undefined,
  decision: "watch" as JournalDecision,
  tokenMint: "",
  targetWallet: "",
  thesis: "",
  invalidation: "",
  notes: "",
  outcome: "",
};

export function DecisionJournal({
  entries,
  limit,
  onSave,
  onDelete,
}: {
  entries: PortfolioJournalEntry[];
  limit: number;
  onSave(entry: typeof emptyForm): Promise<unknown>;
  onDelete(entry: PortfolioJournalEntry): Promise<void>;
}) {
  const [form, setForm] = useState(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave(form);
      setForm(emptyForm);
      setIsOpen(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save entry");
    } finally {
      setIsSaving(false);
    }
  };

  const edit = (entry: PortfolioJournalEntry) => {
    setForm({
      id: entry.id,
      decision: entry.decision,
      tokenMint: entry.tokenMint,
      targetWallet: entry.targetWallet || "",
      thesis: entry.thesis,
      invalidation: entry.invalidation,
      notes: entry.notes,
      outcome: entry.outcome,
    });
    setIsOpen(true);
  };

  return (
    <section className="levi-portfolio-section levi-journal" aria-labelledby="journal-title">
      <div className="levi-result-section-heading">
        <div><p className="levi-section-label">Decision discipline</p><h2 id="journal-title">Private trading journal</h2></div>
        {limit > 0 ? <button type="button" className="levi-inline-action" onClick={() => { setForm(emptyForm); setIsOpen((value) => !value); }}>{isOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{isOpen ? "Close" : "New entry"}</button> : <span>Storage unavailable</span>}
      </div>

      {isOpen ? (
        <form onSubmit={submit} className="levi-journal-form">
          <div className="levi-journal-form-grid">
            <label className="levi-field-label">Decision<select value={form.decision} onChange={(event) => setForm({ ...form, decision: event.target.value as JournalDecision })} className="levi-form-input"><option value="watch">Watch</option><option value="entered">Entered</option><option value="trimmed">Trimmed</option><option value="exited">Exited</option><option value="avoided">Avoided</option></select></label>
            <label className="levi-field-label">Token mint<input value={form.tokenMint} onChange={(event) => setForm({ ...form, tokenMint: event.target.value })} className="levi-form-input" required minLength={32} /></label>
            <label className="levi-field-label">Wallet reviewed (optional)<input value={form.targetWallet} onChange={(event) => setForm({ ...form, targetWallet: event.target.value })} className="levi-form-input" /></label>
          </div>
          <label className="levi-field-label">Thesis<textarea value={form.thesis} onChange={(event) => setForm({ ...form, thesis: event.target.value })} className="levi-form-input" required minLength={3} /></label>
          <label className="levi-field-label">Invalidation condition<textarea value={form.invalidation} onChange={(event) => setForm({ ...form, invalidation: event.target.value })} className="levi-form-input" /></label>
          <div className="levi-journal-form-grid is-two"><label className="levi-field-label">Notes<textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="levi-form-input" /></label><label className="levi-field-label">Outcome<textarea value={form.outcome} onChange={(event) => setForm({ ...form, outcome: event.target.value })} className="levi-form-input" /></label></div>
          {error ? <p className="levi-form-error" role="alert">{error}</p> : null}
          <button type="submit" className="levi-primary-button" disabled={isSaving}>{isSaving ? <Save className="h-4 w-4 animate-pulse" /> : form.id ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{isSaving ? "Saving" : form.id ? "Update entry" : "Save entry"}</button>
        </form>
      ) : null}

      {limit <= 0 ? <div className="levi-empty-state">Private journal storage is unavailable for this session.</div> : entries.length ? (
        <div className="levi-journal-list">
          {entries.map((entry) => (
            <article key={entry.id}>
              <div className="levi-journal-entry-head"><span className={`is-${entry.decision}`}>{entry.decision}</span><time>{new Date(entry.updatedAt).toLocaleDateString()}</time></div>
              <code>{entry.tokenMint}</code>
              <h3>{entry.thesis}</h3>
              {entry.invalidation ? <p><strong>Invalidation:</strong> {entry.invalidation}</p> : null}
              {entry.outcome ? <p><strong>Outcome:</strong> {entry.outcome}</p> : null}
              <div className="levi-journal-entry-actions"><button type="button" onClick={() => edit(entry)}><Edit3 className="h-4 w-4" /> Edit</button><button type="button" onClick={() => void onDelete(entry)}><Trash2 className="h-4 w-4" /> Delete</button></div>
            </article>
          ))}
        </div>
      ) : <div className="levi-empty-state">Record the thesis before the trade and the outcome after it.</div>}
    </section>
  );
}
