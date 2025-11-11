export function SiteFooter() {
  return (
    <footer
      id="feedback"
      className="border-t border-[var(--color-border)] bg-surface text-sm"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          This is an unofficial parody of the Life in the UK test. No lawyers
          were harmed in the making of these questions.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a
            href="mailto:feedback@unofficiallifeintheuk.com"
            className="underline-offset-2 hover:underline"
          >
            Suggest a question
          </a>
          <span aria-hidden="true">•</span>
          <a
            href="https://ko-fi.com/"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Support on Ko-fi
          </a>
        </div>
      </div>
    </footer>
  );
}
