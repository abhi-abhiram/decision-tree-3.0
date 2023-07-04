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
            position: { x: 0, y: 0 },
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
                }))
            },

        };

        model.sourceRelations.map((val) => {
            const edge: Edge<RelationEdgeData> = {
                id: `${val.id}`,
                sourceHandle: `${model.name}-${val.varId}`,
                target: val.targetId,
                source: model.id,
                targetHandle: `${model.name}-${val.id}`,
                type: "relation"
            }
            edges.push(edge);
            const variable = modelNode.data.variables.find(({ id }) => id === val.varId);
            if (variable) {
                variable.relationType = val.type;
                variable.targetId = val.targetId;
                variable.sourceId = val.sourceId;
            }
        })

        model.targetRelations.map(val => {
            modelNode.data.variables.push({
                id: val.id,
                dataType: "String",
                isForeignKey: true,
                name: val.name,
                relationType: val.type,
                sourceId: val.sourceId,
                targetId: val.targetId,
            })
        });
        nodes.push(modelNode);
    })
    return { nodes, edges };
}