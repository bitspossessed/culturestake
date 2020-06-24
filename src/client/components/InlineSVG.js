import React, { useMemo } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

const InlineSVG = (props) => {
  const { xml } = useLoader(SVGLoader, props.url);
  const { innerHTML, attributes } = xml;

  return useMemo(() => {
    return (
      <svg
        dangerouslySetInnerHTML={{ __html: innerHTML }}
        viewBox={attributes.viewBox ? attributes.viewBox.value : null}
        xmlns={attributes.xmlns.value}
      />
    );
  }, [innerHTML, attributes]);
};

export default InlineSVG;
