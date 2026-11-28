import React from 'react';

export type CharacterRigPose = {
  rootX?: number; rootY?: number; rootRotation?: number; rootScale?: number;
  torso?: number; head?: number;
  leftShoulder?: number; rightShoulder?: number;
  leftElbow?: number; rightElbow?: number;
  leftHip?: number; rightHip?: number;
  leftKnee?: number; rightKnee?: number;
};

export const resolveRigPose = (pose: CharacterRigPose = {}) => ({
  rootX: pose.rootX ?? 0, rootY: pose.rootY ?? 0,
  rootRotation: pose.rootRotation ?? 0, rootScale: pose.rootScale ?? 1,
  torso: pose.torso ?? 0, head: pose.head ?? 0,
  leftShoulder: pose.leftShoulder ?? 0, rightShoulder: pose.rightShoulder ?? 0,
  leftElbow: pose.leftElbow ?? 0, rightElbow: pose.rightElbow ?? 0,
  leftHip: pose.leftHip ?? 0, rightHip: pose.rightHip ?? 0,
  leftKnee: pose.leftKnee ?? 0, rightKnee: pose.rightKnee ?? 0,
});

export type RigSegment = readonly [number, number, number, number];
export type RigJoint = readonly [number, number];

/** Optional diagnostic skeleton. Hidden unless explicitly enabled; never part of normal renders. */
export const RigSkeleton: React.FC<{
  visible?: boolean; segments: readonly RigSegment[]; joints: readonly RigJoint[];
}> = ({visible = false, segments, joints}) => (
  <g aria-hidden="true" pointerEvents="none" opacity={visible ? 0.82 : 0}>
    {segments.map(([x1,y1,x2,y2], index) => (
      <line key={'bone-'+index} x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="#00c8ff" strokeWidth="12" strokeLinecap="round" />
    ))}
    {joints.map(([cx,cy], index) => (
      <circle key={'joint-'+index} cx={cx} cy={cy} r="13"
        fill="#ffcf45" stroke="#14212b" strokeWidth="5" />
    ))}
  </g>
);
