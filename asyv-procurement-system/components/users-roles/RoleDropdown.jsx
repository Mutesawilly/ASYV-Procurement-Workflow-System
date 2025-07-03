'use client'
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RoleDropdown({ handleClick, currentRole, allRoles }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="bg-blue-300 rounded-full text-center py-1"
        >
          {currentRole}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allRoles.map((role) => (
          <DropdownMenuItem
            key={role}
            onClick={()=>handleClick(role)}
          >
            {role}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}