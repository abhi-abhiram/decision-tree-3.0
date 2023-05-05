import React from "react";
import {
  type ConnectionLineComponentProps,
  type EdgeProps,
  getBezierPath,
} from "reactflow";

export default function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const iconX = (sourceX + targetX) / 2;
  const iconY = (sourceY + targetY) / 2;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path !stroke-stone-900 !stroke-2"
        d={edgePath}
        markerEnd={markerEnd}
      ></path>
      <g
        transform={`translate(${iconX}, ${iconY})`}
        style={{ cursor: "pointer" }}
        onClick={() => console.log("af")}
        className="group !pointer-events-auto [&>*]:transition-transform [&>*]:duration-200 [&>*]:ease-in-out"
      >
        <circle
          cx="0"
          cy="0"
          r="10"
          stroke="#000"
          strokeWidth="2"
          className="!fill-gray-50 group-hover:!scale-125"
        />
        <rect
          x="-5"
          y="-1"
          width="10"
          height="2"
          fill="#000"
          className="group-hover:!scale-125"
        />
        <rect
          x="-1"
          y="-5"
          width="2"
          height="10"
          fill="#000"
          className="group-hover:!scale-125"
        />
      </g>
    </>
  );
}

export function ConnectionEdge({
  fromX,
  fromY,
  fromPosition,
  toX,
  toY,
  toPosition,
  connectionLineType,
  connectionLineStyle,
}: ConnectionLineComponentProps) {
  return (
    <g>
      <path
        fill="none"
        className="animated !stroke-stone-900 !stroke-2"
        d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
      />
      <circle
        cx={toX}
        cy={toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
}
