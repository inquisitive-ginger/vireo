import { Button } from '@/components/ui/button'

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">Home</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        Family OS home screen — widget grid coming in M1.
      </p>
      <Button variant="outline" size="sm">
        Get Started
      </Button>
    </div>
  )
}
