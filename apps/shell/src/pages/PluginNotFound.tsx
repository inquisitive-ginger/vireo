export function PluginNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-3">
      <p className="text-sm font-medium">Plugin not found</p>
      <p className="text-xs text-muted-foreground">
        No plugin is registered for this route.
      </p>
    </div>
  )
}
