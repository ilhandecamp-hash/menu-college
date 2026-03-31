"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  Building2,
  Link,
  Palette,
  Type,
  Search,
  Save,
  ArrowLeft,
  LogIn,
  Loader2,
  Check,
  AlertCircle,
  Shield,
  BarChart3,
  Eye,
  TrendingUp,
  Users,
  Globe,
} from "lucide-react";

interface SiteSettings {
  schoolName: string;
  pageTitle: string;
  subtitle: string;
  sourceUrl: string;
  sourceLabel: string;
  primaryColor: string;
  footerText: string;
  emptyStateMessage: string;
  downloadButtonText: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string;
  siteUrl: string;
  language: string;
  authorText: string;
}

interface ThemeOption {
  key: string;
  label: string;
  preview: string;
}

export default function AdminPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [themes, setThemes] = useState<ThemeOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [analytics, setAnalytics] = useState<{
    totalViews: number;
    pageViews: { date: string; count: number }[];
    lastVisit: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => {
        if (res.ok) {
          setIsAuth(true);
          return res.json();
        }
        throw new Error("Not authenticated");
      })
      .then((data) => {
        setSettings(data.settings);
        setThemes(data.themes);
        fetch("/api/admin/analytics")
          .then((r) => r.json())
          .then(setAnalytics)
          .catch(() => {});
      })
      .catch(() => setIsAuth(false))
      .finally(() => setCheckingAuth(false));
  }, []);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuth(true);
        const settingsRes = await fetch("/api/admin/settings");
        const data = await settingsRes.json();
        setSettings(data.settings);
        setThemes(data.themes);
        fetch("/api/admin/analytics")
          .then((r) => r.json())
          .then(setAnalytics)
          .catch(() => {});
      } else {
        setLoginError("Mot de passe incorrect");
      }
    } catch {
      setLoginError("Erreur de connexion");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setToast({ type: "success", message: "Paramètres enregistrés !" });
      } else {
        const data = await res.json();
        setToast({
          type: "error",
          message: data.error || "Erreur lors de la sauvegarde.",
        });
      }
    } catch {
      setToast({ type: "error", message: "Erreur de connexion au serveur." });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  function updateSetting<K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  // Loading state
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    );
  }

  // Login form
  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
              <Shield size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Espace Administration
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Connectez-vous pour gérer le site
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe admin"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                autoFocus
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                <AlertCircle size={16} />
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading || !password}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loginLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              Connexion
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-slate-400 transition-colors hover:text-slate-600"
            >
              Retour au site
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <Check size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Administration
            </h1>
            <p className="text-xs text-slate-500">
              Gérez les paramètres du site
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              Voir le site
            </a>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              Enregistrer
            </button>
          </div>
        </div>
      </header>

      {/* Settings form */}
      {settings && (
        <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
          {/* ===== INFOS GENERALES ===== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Building2 size={18} />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Informations générales
              </h2>
            </div>
            <div className="space-y-4">
              <Field
                label="Nom du collège"
                value={settings.schoolName}
                onChange={(v) => updateSetting("schoolName", v)}
              />
              <Field
                label="Titre principal"
                value={settings.pageTitle}
                onChange={(v) => updateSetting("pageTitle", v)}
              />
              <FieldTextarea
                label="Sous-titre / Description"
                value={settings.subtitle}
                onChange={(v) => updateSetting("subtitle", v)}
              />
            </div>
          </section>

          {/* ===== SOURCE ===== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Link size={18} />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Source des menus PDF
              </h2>
            </div>
            <div className="space-y-4">
              <Field
                label="URL source (page à scraper)"
                value={settings.sourceUrl}
                onChange={(v) => updateSetting("sourceUrl", v)}
                type="url"
              />
              <Field
                label="Label affiché dans le footer"
                value={settings.sourceLabel}
                onChange={(v) => updateSetting("sourceLabel", v)}
              />
            </div>
          </section>

          {/* ===== APPARENCE ===== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Palette size={18} />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Apparence
              </h2>
            </div>
            <p className="mb-4 text-sm text-slate-500">
              Choisissez le thème de couleur du site
            </p>
            <div className="flex flex-wrap gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => updateSetting("primaryColor", theme.key)}
                  className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all ${
                    settings.primaryColor === theme.key
                      ? "border-slate-900 bg-slate-50 text-slate-900 shadow-sm"
                      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="h-5 w-5 rounded-full shadow-inner ring-1 ring-black/5"
                    style={{ backgroundColor: theme.preview }}
                  />
                  {theme.label}
                  {settings.primaryColor === theme.key && (
                    <Check size={14} className="text-slate-900" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ===== TEXTES ===== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <Type size={18} />
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                Textes de l&apos;interface
              </h2>
            </div>
            <div className="space-y-4">
              <Field
                label="Texte du bouton de téléchargement"
                value={settings.downloadButtonText}
                onChange={(v) => updateSetting("downloadButtonText", v)}
              />
              <Field
                label="Message quand aucun menu n'est disponible"
                value={settings.emptyStateMessage}
                onChange={(v) => updateSetting("emptyStateMessage", v)}
              />
              <Field
                label="Texte du footer"
                value={settings.footerText}
                onChange={(v) => updateSetting("footerText", v)}
              />
              <Field
                label="Crédit / Auteur (affiché en bas du site)"
                value={settings.authorText}
                onChange={(v) => updateSetting("authorText", v)}
              />
            </div>
          </section>

          {/* ===== SEO ===== */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <Search size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  SEO / Métadonnées
                </h2>
                <p className="text-xs text-slate-500">
                  Optimisez le référencement du site sur Google
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <Field
                label="URL du site (ex: https://menu-college.vercel.app)"
                value={settings.siteUrl}
                onChange={(v) => updateSetting("siteUrl", v)}
                type="url"
              />
              <Field
                label="Titre de la page (onglet navigateur, max ~60 caractères)"
                value={settings.metaTitle}
                onChange={(v) => updateSetting("metaTitle", v)}
              />
              <FieldTextarea
                label="Meta description (affichée dans Google, max ~160 caractères)"
                value={settings.metaDescription}
                onChange={(v) => updateSetting("metaDescription", v)}
              />
              <FieldTextarea
                label="Mots-clés (séparés par des virgules)"
                value={settings.metaKeywords}
                onChange={(v) => updateSetting("metaKeywords", v)}
              />
              <Field
                label="URL image Open Graph (image partagée sur les réseaux sociaux, 1200x630px)"
                value={settings.ogImageUrl}
                onChange={(v) => updateSetting("ogImageUrl", v)}
                type="url"
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Langue du site
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting("language", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* SEO preview */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <Globe size={14} />
                  <span className="text-xs font-medium">
                    Aperçu Google
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-medium text-blue-700 line-clamp-1">
                    {settings.metaTitle || "Titre de la page"}
                  </p>
                  <p className="text-sm text-green-700 line-clamp-1">
                    {settings.siteUrl || "https://votre-site.vercel.app"}
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {settings.metaDescription || "Description de la page..."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== ANALYTICS ===== */}
          {analytics && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                  <BarChart3 size={18} />
                </div>
                <h2 className="text-base font-semibold text-slate-900">
                  Statistiques de visite
                </h2>
              </div>

              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Eye size={14} />
                    <span className="text-xs font-medium">Total des vues</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.totalViews.toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <TrendingUp size={14} />
                    <span className="text-xs font-medium">Aujourd&apos;hui</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {(
                      analytics.pageViews.find(
                        (pv) =>
                          pv.date === new Date().toISOString().split("T")[0]
                      )?.count ?? 0
                    ).toLocaleString("fr-FR")}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Users size={14} />
                    <span className="text-xs font-medium">7 derniers jours</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900">
                    {analytics.pageViews
                      .filter((pv) => {
                        const d = new Date(pv.date);
                        const now = new Date();
                        const diff =
                          (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
                        return diff <= 7;
                      })
                      .reduce((sum, pv) => sum + pv.count, 0)
                      .toLocaleString("fr-FR")}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-medium text-slate-500">
                  Visites des 14 derniers jours
                </p>
                <div className="flex items-end gap-1" style={{ height: 100 }}>
                  {(() => {
                    const days: { date: string; count: number }[] = [];
                    for (let i = 13; i >= 0; i--) {
                      const d = new Date();
                      d.setDate(d.getDate() - i);
                      const key = d.toISOString().split("T")[0];
                      const found = analytics.pageViews.find(
                        (pv) => pv.date === key
                      );
                      days.push({ date: key, count: found?.count ?? 0 });
                    }
                    const max = Math.max(...days.map((d) => d.count), 1);
                    return days.map((day) => (
                      <div
                        key={day.date}
                        className="group relative flex-1"
                        style={{ height: "100%" }}
                      >
                        <div
                          className="absolute bottom-0 w-full rounded-t-sm transition-all duration-500 bg-primary-gradient"
                          style={{
                            height: `${Math.max((day.count / max) * 100, 4)}%`,
                          }}
                        />
                        <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {day.date.slice(5)} : {day.count}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>il y a 14j</span>
                  <span>aujourd&apos;hui</span>
                </div>
              </div>

              {analytics.lastVisit && (
                <p className="mt-4 text-xs text-slate-400">
                  Dernière visite : {new Date(analytics.lastVisit).toLocaleString("fr-FR")}
                </p>
              )}
            </section>
          )}

          <div className="h-20" />

          <div className="fixed bottom-4 left-1/2 z-40 w-full max-w-4xl -translate-x-1/2 px-4 sm:px-6">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md">
              <p className="hidden text-sm text-slate-500 sm:block">
                Les modifications seront visibles immédiatement.
              </p>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}
