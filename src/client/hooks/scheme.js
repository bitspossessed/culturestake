import { useSelector } from 'react-redux';
import { DEFAULT_SCHEME, SCHEME_ALTERNATE } from '~/client/styles/variables';

export const useScheme = (defaultScheme = DEFAULT_SCHEME) => {
  const { isAlternateColor, isAlternateFontFace, isLargerFont } = useSelector(
    (state) => state.app,
  );

  const scheme = isAlternateColor ? SCHEME_ALTERNATE : defaultScheme;

  return {
    isAlternateColor,
    isAlternateFontFace,
    isLargerFont,
    scheme,
  };
};
