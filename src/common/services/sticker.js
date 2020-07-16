const CODE_TABLE = ['|', '/', '[', '_'];
const POSITIONS_SEPARATOR = '/';
const POSITIONS_COORDINATE = '|';

function makeCodeTable(items) {
  return items.reduce((acc, item, index) => {
    acc[CODE_TABLE[index]] = item;
    return acc;
  }, {});
}

function encode(item, table) {
  const index = Object.values(table).findIndex((value) => value === item);
  return Object.keys(table)[index];
}

function encodePositions(positions) {
  return positions
    .map(({ x, y }) => {
      return `${x}${POSITIONS_COORDINATE}${y}`;
    })
    .join(POSITIONS_SEPARATOR);
}

function decode(item, table) {
  if (!(item in table)) {
    throw new Error('Invalid value');
  }

  return table[item];
}

function decodePositions(positions) {
  if (!positions) {
    return [];
  }

  return positions.split(POSITIONS_SEPARATOR).map((position) => {
    const [x, y] = position.split(POSITIONS_COORDINATE);
    return {
      x: parseInt(x, 10),
      y: parseInt(y, 10),
    };
  });
}

export const STICKER_SCHEMES = makeCodeTable(['violet', 'pink', 'blue']);

export const STICKER_CLIP_SHAPE_IDS = makeCodeTable([
  'clip-path-corners',
  'clip-path-ellipsis',
  'clip-path-rectangle',
  'clip-path-snake',
]);

export const STICKER_PARTICLE_SHAPE_IDS = makeCodeTable([
  'star',
  'swirl',
  'rectangle',
]);

export function encodeSticker({
  clipShapeId,
  particlePositions,
  particleShapeId,
  scheme,
}) {
  if (!Object.values(STICKER_SCHEMES).includes(scheme)) {
    throw new Error('Invalid scheme');
  }

  if (!Object.values(STICKER_CLIP_SHAPE_IDS).includes(clipShapeId)) {
    throw new Error('Invalid clipShapeId');
  }

  if (!Object.values(STICKER_PARTICLE_SHAPE_IDS).includes(particleShapeId)) {
    throw new Error('Invalid particleShapeId');
  }

  if (!Array.isArray(particlePositions)) {
    throw new Error('particlePositions is not an array');
  }

  particlePositions.forEach((position) => {
    if (!('x' in position) || !('y' in position)) {
      throw new Error('x, y positions missing in particlePositions');
    } else if (!Number.isInteger(position.x) || !Number.isInteger(position.y)) {
      throw new Error('x, y positions invalid in particlePositions');
    }
  });

  return [
    encode(scheme, STICKER_SCHEMES),
    encode(clipShapeId, STICKER_CLIP_SHAPE_IDS),
    encode(particleShapeId, STICKER_PARTICLE_SHAPE_IDS),
    encodePositions(particlePositions),
  ].join('');
}

export function decodeSticker(code) {
  if (typeof code !== 'string') {
    throw new Error('Code must be a string');
  }

  if (code.length < 3) {
    throw new Error('Code must be at least 3 characters long');
  }

  return {
    scheme: decode(code[0], STICKER_SCHEMES),
    clipShapeId: decode(code[1], STICKER_CLIP_SHAPE_IDS),
    particleShapeId: decode(code[2], STICKER_PARTICLE_SHAPE_IDS),
    particlePositions: decodePositions(code.slice(3)),
  };
}
