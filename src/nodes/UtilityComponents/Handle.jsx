import { Handle as ReactFlowHandle } from "reactflow";
import { tw } from "twind";

export function Handle(props) {
  return (
    <ReactFlowHandle
      className={tw(
        `w-4 h-4 relative rounded-full border-2 border-gray-400 mb-2`
      )}
      {...props}
    />
  );
}
