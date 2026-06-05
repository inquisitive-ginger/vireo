export function DemoPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-8 text-center">
      <h1 className="text-page-title">Demo Plugin</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Plugin content renders here — this slot is wired via the plugin-loader story.
      </p>
    </div>
  )
}
