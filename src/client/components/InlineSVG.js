import React, { useMemo } from 'react';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useLoader } from 'react-three-fiber';

const InlineSVG = (props) => {
  const { xml } = useLoader(SVGLoader, props.url);

  return useMemo(() => {
    return (
      <svg
        dangerouslySetInnerHTML={{ __html: xml.innerHTML }}
        viewBox={xml.attributes.viewBox.value}
        xmlns={xml.attributes.xmlns.value}
      />
    );
  }, [props.url]);
};

export default InlineSVG;
