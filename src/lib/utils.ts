import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  GalleryVerticalEndIcon,
  ChevronsUpDownIcon,
  CheckIcon,
} from "lucide-react"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getIcon = (icon: string) => {}
