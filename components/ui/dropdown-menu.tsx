"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"
import { cn } from "cn"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root>) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Trigger>) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Popup>) {
  return (
    <MenuPrimitive.Portal data-slot="dropdown-menu-portal">
      <MenuPrimitive.Positioner
        data-slot="dropdown-menu-positioner"
        className="z-50"
        align="end"
        sideOffset={4}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "bg-popover text-popover-foreground min-w-36 overflow-hidden rounded-lg border p-1 shadow-md",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Item>) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none",
        "hover:bg-muted focus-visible:bg-muted",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
