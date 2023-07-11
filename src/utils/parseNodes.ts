import { type Node, type Edge } from "reactflow"
import { type ModelNodeData } from "~/components/data-model/ModelNode";
import { type RelationEdgeData } from "~/components/data-model/RelationEdge";
import { type RouterOutputs } from "~/utils/api";

export const parseNodes = (models: RouterOutputs["model"]['modelsWithVariables']) => {
    const nodes: Node<ModelNodeData>[] = [];
    const edges: Edge<RelationEdgeData>[] = [];

    models.forEach((model) => {
        const modelNode: Node<ModelNodeData> = {
            id: model.id,
            type: "model",
            position: { x: model.positionX, y: model.positionY },
            data: {
                id: model.id,
                name: model.name,
                type: "model",
                variables: model.variables.map((variable) => ({
                    dataType: variable.dataType,
                    name: variable.name,
                    id: variable.id,
                    isForeignKey: variable.isForeignKey,
                    relationType: null,
                    sourceId: null,
                    targetId: null,
                })),
                primaryKeyId: model.primaryKeyId,
            },

        };

        model.sourceRelations.map((val) => {
            const targetModel = models.find(({ id }) => id === val.targetId);
            const edge: Edge<RelationEdgeData> = {
                id: `${val.id}`,
                sourceHandle: val.varId,
                target: val.targetId,
                source: model.id,
                targetHandle: targetModel?.primaryKeyId,
                type: "relation",
                data: {
                    relationType: val.type,
                }

            }

            edges.push(edge);
            const variable = modelNode.data.variables.find(({ id }) => id === val.varId);
            if (variable) {
                variable.relationType = val.type;
                variable.targetId = val.targetId;
                variable.sourceId = val.sourceId;
            }
        })

        nodes.push(modelNode);
    })
    return { nodes, edges };
}