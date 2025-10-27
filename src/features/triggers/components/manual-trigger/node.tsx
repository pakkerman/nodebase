import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import { BaseTriggerNode } from "../base-trigger-node";
import { MousePointerIcon } from "lucide-react";

export const ManualTriggerNode = memo((props: NodeProps) => {
  return (
    <>
      <BaseTriggerNode
        {...props}
        name="when clicking 'Execute workflow'"
        icon={MousePointerIcon}
        // TODO: status={nodeStatus}
        // TODO: onSettings={handleOpenSettings}
        // TODO: onDoubleClick={handleOpenSettings}
      />
    </>
  );
});
