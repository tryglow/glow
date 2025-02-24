import {
  SidebarContentHeader,
  SidebarGroup,
  SidebarGroupContent,
} from '@tryglow/ui';

export function SidebarAnalytics() {
  return (
    <>
      <SidebarContentHeader title="Analytics"></SidebarContentHeader>

      <SidebarGroup>
        <SidebarGroupContent>
          <div className="w-full aspect-square bg-stone-200 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              Available soon
            </span>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
