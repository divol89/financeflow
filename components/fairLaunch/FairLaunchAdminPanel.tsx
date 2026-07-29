import { FormEvent, useState } from "react";
import {
  Eye,
  EyeOff,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";
import type {
  FairLaunchProject,
  FairLaunchStatus,
} from "@/types/fairLaunch";

interface AdminPanelProps {
  launches: FairLaunchProject[];
  onCreate: (input: Record<string, unknown>) => Promise<unknown>;
  onUpdate: (input: Record<string, unknown>) => Promise<unknown>;
  onDelete: (mint: string) => Promise<unknown>;
}

const INITIAL_FORM = {
  mint: "",
  name: "",
  symbol: "",
  summary: "",
  status: "announced" as FairLaunchStatus,
  launchAt: "",
  officialUrl: "",
  xUrl: "",
  telegramUrl: "",
  isPublished: true,
};

function nullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed || null;
}

export function FairLaunchAdminPanel({
  launches,
  onCreate,
  onUpdate,
  onDelete,
}: AdminPanelProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyKey("create");
    setMessage(null);
    setError(null);

    try {
      await onCreate({
        ...form,
        launchAt: form.launchAt
          ? new Date(form.launchAt).toISOString()
          : null,
        officialUrl: nullable(form.officialUrl),
        xUrl: nullable(form.xUrl),
        telegramUrl: nullable(form.telegramUrl),
      });
      setForm(INITIAL_FORM);
      setMessage("Launch added to the catalog.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to add this launch."
      );
    } finally {
      setBusyKey(null);
    }
  }

  async function updateProject(
    mint: string,
    changes: Record<string, unknown>
  ) {
    setBusyKey(mint);
    setMessage(null);
    setError(null);
    try {
      await onUpdate({ mint, ...changes });
      setMessage("Launch catalog updated.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update this launch."
      );
    } finally {
      setBusyKey(null);
    }
  }

  async function removeProject(project: FairLaunchProject) {
    const confirmed = window.confirm(
      `Remove ${project.name} from the launch catalog?`
    );
    if (!confirmed) return;

    setBusyKey(project.mint);
    setMessage(null);
    setError(null);
    try {
      await onDelete(project.mint);
      setMessage("Launch removed from the catalog.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to remove this launch."
      );
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <section className="mule-launch-admin" aria-labelledby="launch-admin-title">
      <header>
        <div>
          <p className="mule-launch-kicker">
            <Settings2 className="h-4 w-4" /> Administration
          </p>
          <h2 id="launch-admin-title">Manage supported launches.</h2>
          <p>
            Add verified token mints and official sources. Drafts remain visible
            only to configured administrators.
          </p>
        </div>
        <span>Signed admin wallet</span>
      </header>

      <form onSubmit={submit} className="mule-launch-admin-form">
        <label>
          Token mint
          <input
            value={form.mint}
            onChange={(event) =>
              setForm((current) => ({ ...current, mint: event.target.value }))
            }
            placeholder="Solana token mint"
            required
          />
        </label>
        <label>
          Project name
          <input
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            placeholder="Project name"
            required
          />
        </label>
        <label>
          Symbol
          <input
            value={form.symbol}
            onChange={(event) =>
              setForm((current) => ({ ...current, symbol: event.target.value }))
            }
            placeholder="TOKEN"
            required
          />
        </label>
        <label>
          Stage
          <select
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as FairLaunchStatus,
              }))
            }
          >
            <option value="announced">Announced</option>
            <option value="open">Launch window open</option>
            <option value="closed">Window closed</option>
          </select>
        </label>
        <label className="is-wide">
          Plain-language summary
          <textarea
            value={form.summary}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                summary: event.target.value,
              }))
            }
            placeholder="Explain what is supported and what holders should verify."
            minLength={24}
            maxLength={600}
            required
          />
        </label>
        <label>
          Launch time (optional)
          <input
            type="datetime-local"
            value={form.launchAt}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                launchAt: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Official launch URL
          <input
            type="url"
            value={form.officialUrl}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                officialUrl: event.target.value,
              }))
            }
            placeholder="https://..."
          />
        </label>
        <label>
          X URL
          <input
            type="url"
            value={form.xUrl}
            onChange={(event) =>
              setForm((current) => ({ ...current, xUrl: event.target.value }))
            }
            placeholder="https://x.com/..."
          />
        </label>
        <label>
          Telegram URL
          <input
            type="url"
            value={form.telegramUrl}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                telegramUrl: event.target.value,
              }))
            }
            placeholder="https://t.me/..."
          />
        </label>
        <label className="mule-launch-admin-check">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                isPublished: event.target.checked,
              }))
            }
          />
          Publish to holders immediately
        </label>
        <button
          type="submit"
          className="flow-primary-button"
          disabled={busyKey === "create"}
        >
          <Plus className="h-4 w-4" />
          {busyKey === "create" ? "Adding launch" : "Add launch"}
        </button>
      </form>

      {message ? (
        <p className="mule-launch-admin-feedback is-success" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mule-launch-admin-feedback is-error" role="alert">
          {error}
        </p>
      ) : null}

      {launches.length > 0 ? (
        <div className="mule-launch-admin-list">
          {launches.map((project) => (
            <div key={project.mint}>
              <div>
                <strong>
                  {project.name} · {project.symbol}
                </strong>
                <code>{project.mint}</code>
              </div>
              <select
                aria-label={`Status for ${project.name}`}
                value={project.status}
                disabled={busyKey === project.mint}
                onChange={(event) =>
                  void updateProject(project.mint, {
                    status: event.target.value,
                  })
                }
              >
                <option value="announced">Announced</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              <button
                type="button"
                onClick={() =>
                  void updateProject(project.mint, {
                    isPublished: !project.isPublished,
                  })
                }
                disabled={busyKey === project.mint}
                title={
                  project.isPublished ? "Move to draft" : "Publish to holders"
                }
              >
                {project.isPublished ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {project.isPublished ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                className="is-danger"
                onClick={() => void removeProject(project)}
                disabled={busyKey === project.mint}
              >
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
