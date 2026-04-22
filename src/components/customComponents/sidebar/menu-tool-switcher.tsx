import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/customComponents/sidebar/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  GalleryVerticalEndIcon,
  ChevronsUpDownIcon,
  CheckIcon,
} from "lucide-react"

type Tool = {
  label: string
  id: number
  icon?: string
}
export const MenuSwitcher = ({
  Menu,
  defaultToolId,
}: {
  Menu: Tool[]
  defaultToolId: number
}) => {
  console.log(Menu)

  const [toolSelected, setToolSelected] = useState(
    Menu.find((tool) => tool.id == defaultToolId)
  )
  console.log(toolSelected)
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-medium">{toolSelected?.label}</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Menu.map((tool) => (
              <DropdownMenuItem
                key={tool.id + "-key"}
                onClick={() => setToolSelected(tool)}
              >
                {tool.label} <CheckIcon className="ml-auto" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
