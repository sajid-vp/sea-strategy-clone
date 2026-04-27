import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch } from "lucide-react";
import { Objective, getInitiative } from "@/data/scorecardData";

interface Props {
  objectives: Objective[];
}

/**
 * Department-level: for each OKR, show which initiatives it powers
 * and the type of impact, so OKRs don't drift into "side projects".
 */
export const OkrInitiativeMapping = ({ objectives }: Props) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-1">
        <GitBranch className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">OKR → Initiative Mapping</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        How each OKR connects to the institution's strategic initiatives.
      </p>

      <div className="space-y-3">
        {objectives.map((o) => (
          <div key={o.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div className="font-medium text-foreground">{o.title}</div>
              <div className="text-xs text-muted-foreground">{o.contributions.length} initiative link{o.contributions.length === 1 ? "" : "s"}</div>
            </div>
            {o.contributions.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Not linked to any initiative — at risk of becoming a side project.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {o.contributions.map((c) => {
                  const init = getInitiative(c.initiativeId);
                  if (!init) return null;
                  return (
                    <div key={c.initiativeId} className="flex items-center gap-2 border rounded-md px-3 py-1.5 bg-muted/40">
                      <span className="text-sm font-medium text-foreground">{init.name}</span>
                      <Badge variant="outline" className={
                        c.impact === "direct"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground"
                      }>
                        {c.impact}
                      </Badge>
                      <span className="text-xs text-muted-foreground">weight {c.weight}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};