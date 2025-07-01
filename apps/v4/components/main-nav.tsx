"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york-v4/ui/button"
import { PulsatingButton } from "./magicui/pulsating-button"

export function MainNav({
  items,
  className,
  ...props
}: React.ComponentProps<"nav"> & {
  items: { href: string; label: string }[]
}) {
  const pathname = usePathname()

  return (
    <nav className={cn("items-center gap-0.5", className)} {...props}>
      {items.map((item) => (
        <Button key={item.href} variant="ghost" asChild size="sm">
          <Link
            href={item.href}
            className={cn(pathname === item.href && "text-primary")}
          >
            {item.label}
          </Link>
        </Button>
      ))}
      <Link href={process.env.NEXT_PUBLIC_MAMDAS_DOCS || "#"}>
					<PulsatingButton
						pulseColor="rgba(220, 38, 38, 0.5)"
						className="text-xs font-bold"
					>
						<span className="bg-gradient-to-r from-red-500  via-yellow-500 to-purple-500 bg-clip-text text-transparent animate-rainbow-text bg-[length:200%_auto]">
							MAMDAS DOCS!
						</span>
					</PulsatingButton>
				</Link>
    </nav>
  )
}
