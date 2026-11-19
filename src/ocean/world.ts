export type World = {
  w: number;
  h: number;
  t: number;
  scrollY: number;
  surfaceY: number; // document y of the water surface
  floorY: number; // document y of the sea floor
  shoreEnd: number; // screen x where the shore's flat top ends
  shoreRight: number; // screen x of the shore's far edge
  billboardLeft: number;
  billboardRight: number; // screen x of the billboard's right edge
  depth: number; // metres
  moving: number; // 0..1 scroll speed
  reduced: boolean;
  laneX: number; // screen x of the fish's home lane (also the buoy)
  fishX: number; // screen x of the fish centre
  fishY: number;
  facing: 1 | -1;
};
