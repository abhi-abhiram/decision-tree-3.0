import Elk, { type ElkExtendedEdge, type ElkNode } from "elkjs/lib/elk.bundled";
import { type Edge, type Node } from "reactflow";

import { type ModelNodeData } from "~/components/data-model/ModelNode";


const elk = new Elk({
    defaultLayoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "RIGHT",
        "elk.spacing.nodeNode": "75",
        "elk.layered.spacing.nodeNodeBetweenLayers": "75",
    },
});


const FIELD_HEIGHT = 50;
const CHAR_WIDTH = 10;
const MIN_SIZE = 100;
const MARGIN = 50;


const normalizeSize = (value: number) => Math.max(value, MIN_SIZE) + MARGIN * 2;


const calculateHeight = (node: Node<ModelNodeData>) => {


    const fieldsHeight = node.data.variables.length * FIELD_HEIGHT;
    const heightWithTitle = fieldsHeight + FIELD_HEIGHT;

    return normalizeSize(heightWithTitle);
};


const calculateWidth = (node: Node<ModelNodeData>) => {


    const headerLength = node.data.name.length;

    const [nameLength, typeLength, defaultValueLength] = node.data.variables.reduce(
        (acc, curr) => {
            const currDefaultValueLength = 0;

            return [
                acc[0] < curr.name.length ? curr.name.length : acc[0],
                acc[1] < curr.dataType.length ? curr.dataType.length : acc[1],
                acc[2] < currDefaultValueLength ? currDefaultValueLength : acc[2],
            ];
        },
        [0, 0, 0]
    );

    const columnsLength = nameLength + typeLength + defaultValueLength;

    const width =
        headerLength > columnsLength
            ? headerLength * CHAR_WIDTH
            : columnsLength * CHAR_WIDTH;

    return normalizeSize(width);
};

export const getLayout = async (
    nodes: Array<Node<ModelNodeData>>,
    edges: Edge[]
) => {
    const elkNodes: ElkNode[] = [];
    const elkEdges: ElkExtendedEdge[] = [];

    nodes.forEach((node) => {
        elkNodes.push({
            id: node.id,
            width: calculateWidth(node),
            height: calculateHeight(node),
        });
    });

    edges.forEach((edge) => {
        elkEdges.push({
            id: edge.id,
            targets: [edge.target],
            sources: [edge.source],
        });
    });

    const layout = await elk.layout({
        id: "root",
        children: elkNodes,
        edges: elkEdges,
    });

    return layout;
};