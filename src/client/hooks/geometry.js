import usePromise from 'react-promise-suspense';
import { ExtrudeBufferGeometry } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

import close from '~/client/assets/images/close.svg';
import info from '~/client/assets/images/info.svg';
import logo from '~/client/assets/images/logo.svg';
import menu from '~/client/assets/images/menu.svg';
import thankyou from '~/client/assets/images/thankyou.svg';

const EXTRUDE_DEPTH = 20;

const paths = {
  close,
  info,
  logo,
  menu,
  thankyou,
};

const cache = {};

async function generateExtrudeGeometry(svg, depth) {
  const key = svg + depth.toString();

  if (!(key in cache)) {
    cache[key] = new Promise((resolve) => {
      const loader = new SVGLoader();

      loader.load(svg, (data) => {
        const shapes = data.paths.flatMap((path) => {
          return path.toShapes(false, false);
        });

        const options = {
          bevelEnabled: false,
          curveSegments: 36,
          depth,
        };

        resolve(new ExtrudeBufferGeometry(shapes, options));
      });
    });
  }

  return cache[key];
}

export const useExtrudeGeometry = (name, depth = EXTRUDE_DEPTH) => {
  return usePromise(generateExtrudeGeometry, [paths[name], depth]);
};
