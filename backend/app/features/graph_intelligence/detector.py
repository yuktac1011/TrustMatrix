
import networkx as nx
from datetime import datetime
from typing import List
from app.features.log_ingestor.schemas import NormalizedEvent
from app.features.graph_intelligence.schemas import LateralMovementAlert


class GraphLateralMovementDetector:
    """
    Maintains a directed relationship graph to spot multi-hop lateral movement pathways.
    """

    def __init__(self):
        self.graph = nx.DiGraph()

    def build_graph_from_logs(self, events: List[NormalizedEvent]):
        """
        Populates nodes and directed edges in memory using normalized log entries.
        """
        self.graph.clear()
        
        for event in events:
            user = event.user
            device = event.device
            target = event.entity
            timestamp = event.timestamp

            # 1. Add User Node
            self.graph.add_node(user, type="USER")
            
            # 2. Add Source Device/IP Node
            if device:
                self.graph.add_node(device, type="DEVICE")
                # Edge representing the user operating on the device
                self.graph.add_edge(user, device, relation="OPERATES", timestamp=timestamp, user=user)

            # 3. Add Target Resource Node (e.g. workstation, server, database)
            if target and target != "system":
                # Only set node type to RESOURCE if it hasn't already been identified as a DEVICE
                if not self.graph.has_node(target) or self.graph.nodes[target].get("type") != "DEVICE":
                    self.graph.add_node(target, type="RESOURCE")
                
                # Directed connection from the operating device to target resource
                source_node = device if device else user
                self.graph.add_edge(source_node, target, relation=event.event_type, timestamp=timestamp, user=user)

    def analyze_lateral_paths(self, target_user: str) -> LateralMovementAlert:
        """
        Evaluates the relationship graph to detect multi-hop machine-to-machine pathways.
        """
        if not self.graph.has_node(target_user):
            return LateralMovementAlert(
                is_threat_detected=False,
                risk_score=0.0,
                path_taken=[],
                trigger_reason="No records found in graph for this identity."
            )

        # 1. Analyze Out-Degree Burst (e.g., single node contacting many resources)
        successors = list(self.graph.successors(target_user))
        out_degree_count = len(successors)
        if out_degree_count >= 5:
            return LateralMovementAlert(
                is_threat_detected=True,
                risk_score=min(100.0, 45.0 + (out_degree_count * 7.5)),
                path_taken=[target_user] + successors,
                trigger_reason=f"High outbound connection blast: pivot attempt to {out_degree_count} resources detected"
            )

        # 2. Extract the machine-to-machine subgraph (excluding direct USER nodes)
        machine_nodes = [
            node for node, attrs in self.graph.nodes(data=True) 
            if attrs.get("type") in ["DEVICE", "RESOURCE"]
        ]
        machine_subgraph = self.graph.subgraph(machine_nodes)

        # 3. Find multi-hop paths within the machine connections
        for start_node in machine_subgraph.nodes():
            for end_node in machine_subgraph.nodes():
                if start_node == end_node:
                    continue
                
                try:
                    # Find shortest machine-to-machine path
                    path = nx.shortest_path(machine_subgraph, source=start_node, target=end_node)
                    
                    # A path of length >= 3 (e.g. Host A -> Host B -> Server) indicates a pivot sequence
                    if len(path) >= 3:
                        # Validate if the transitions along this path were made by the target user
                        user_transition_match = True
                        for i in range(len(path) - 1):
                            edge_data = self.graph.get_edge_data(path[i], path[i+1])
                            if not edge_data or edge_data.get("user") != target_user:
                                user_transition_match = False
                                break

                        if user_transition_match:
                            full_trajectory = [target_user] + path
                            return LateralMovementAlert(
                                is_threat_detected=True,
                                risk_score=85.0 + (len(path) * 2.5),
                                path_taken=full_trajectory,
                                trigger_reason=f"Suspicious transit pathway detected: {len(path) - 1}-hop host-to-host pivot sequence found."
                            )
                except nx.NetworkXNoPath:
                    continue

        return LateralMovementAlert(
            is_threat_detected=False,
            risk_score=0.0,
            path_taken=[],
            trigger_reason="Standard behavior: no abnormal multi-hop pivots or transit patterns observed."
        )