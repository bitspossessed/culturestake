import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

//import { useScheme } from '~/client/hooks/scheme';

const Image = (props) => {
  //const [href, setHref] = useState(props.src);

  //code for stylized image filters, not currently used

  //const { scheme } = useScheme(props.scheme);

  // const onToggle = () => {
  //   setHref((value) => (value === props.src ? props.srcOriginal : props.src));
  // };

  //const filter = href === props.src ? `url(#filter-${scheme})` : null;

  return (
    <ImageStyle>
      <ImageInnerStyle
        filter={null}
        href={props.srcOriginal}
        preserveAspectRatio="xMidYMid slice"
      />
    </ImageStyle>
  );
};

export const ImageStyle = styled.svg`
  width: 100%;
  height: 50rem;

  margin-top: 1rem;
  margin-bottom: 1rem;

  cursor: crosshair;
`;

export const ImageInnerStyle = styled.image`
  width: 100%;
  height: 100%;

  background-size: contain;
`;

Image.propTypes = {
  scheme: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  srcOriginal: PropTypes.string.isRequired,
};

export default Image;
