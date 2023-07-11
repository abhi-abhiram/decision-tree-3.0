import { type RelationType } from "@prisma/client";
import React, { memo } from "react";
import { type EdgeProps, EdgeText, getSmoothStepPath } from "reactflow";

export interface RelationEdgeData {
  relationType: RelationType;
}

const RelationEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  labelStyle,
  labelShowBg,
  labelBgBorderRadius,
  labelBgPadding,
  labelBgStyle,
  data,
}: EdgeProps<RelationEdgeData>) => {
  const [path, centerX, centerY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const text = label ? (
    <EdgeText
      x={centerX}
      y={centerY}
      label={label}
      labelStyle={labelStyle}
      labelShowBg={labelShowBg}
      labelBgStyle={labelBgStyle}
      labelBgPadding={labelBgPadding}
      labelBgBorderRadius={labelBgBorderRadius}
    />
  ) : null;

  const { relationType } = data ?? {
    relationType: "OneToOne",
  };
  const [markerStart, markerEnd] = {
    ManyToMany: ["url(#prismaliser-many)", "url(#prismaliser-many)"],
    OneToMany: ["url(#prismaliser-many)", "url(#prismaliser-one)"],
    OneToOne: ["url(#prismaliser-one)", "url(#prismaliser-one)"],
    ManyToOne: ["url(#prismaliser-many)", "url(#prismaliser-one)"],
  }[relationType];

  return (
    <>
      <path
        className="fill-none stroke-current stroke-2 text-gray-400"
        d={path}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      {text}
    </>
  );
};

export default memo(RelationEdge);
