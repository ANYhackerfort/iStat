import { useEffect } from "react";

interface Nodes {
  id: number;
  type: string;
  numberInputs: number;
  numberOutputs: number;
  x: number;
  y: number;
  selected: boolean;
  neighbors_dependent: Nodes[];
  neighbors_pointing: Nodes[];
  dragAndDrop: boolean;
}

const NodeLoggerComponent = ({ nodes }: { nodes: { [key: number]: Nodes } }) => {
  useEffect(() => {
    const logAndSendNodeDetails = async () => {
      const nodesArray = Object.values(nodes);

      nodesArray.forEach(async (node) => {
        const payload = {
          node_id: node.id,
          type: node.type,
          neighbors_dependent: node.neighbors_dependent.map((neighbor) => neighbor.id),
          neighbors_pointing: node.neighbors_pointing.map((neighbor) => neighbor.id),
        };

        console.log(`Sending payload: ${JSON.stringify(payload)}`);

        try {
          const response = await fetch("http://localhost:3000/nodes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            console.log(`Node ${node.id} successfully sent to the server.`);
          } else {
            console.error(
              `Failed to send node ${node.id}: ${response.status} ${response.statusText}`
            );
          }
        } catch (error) {
          console.error(`Error sending node ${node.id}:`, error);
        }
      });
    };

    logAndSendNodeDetails(); // Call the function when `nodes` changes
  }, [nodes]); // Dependency on `nodes`

  return null; // No UI for this component
};

export default NodeLoggerComponent;