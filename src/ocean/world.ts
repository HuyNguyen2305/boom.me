export type World = {
  w: number;
  h: number;
  t: number;
  scrollY: number;
  surfaceY: number; // document y of the water surface
  floorY: number; // document y of the sea floor
  depth: number; // metres
  moving: number; // 0..1 scroll speed
  reduced: boolean;
  laneX: number; // screen x of the fish's home lane 
  fishX: number; // screen x of the fish centre
  fishY: number;
  facing: 1 | -1;
};
