import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import DropZone from 'react-dropzone';
import { useSelector } from 'react-redux';

import styles from '~/client/styles/variables';
import { isString } from '~/common/helpers/strings';

const DEFAULT_UPLOAD_TEXT =
  'Upload files by dragging &amp; dropping it here or click to select.';

const FileUpload = ({
  onUpload,
  onError,
  disabled = false,
  accept = [],
  uploadText = DEFAULT_UPLOAD_TEXT,
}) => {
  const { isAlternateColor } = useSelector((state) => state.app);

  const onDrop = useCallback(
    (files) => {
      const reader = new FileReader();

      reader.addEventListener('abort', () =>
        onError('file reading was aborted'),
      );

      reader.addEventListener('error', () =>
        onError('file reading has failed'),
      );

      reader.addEventListener('load', () => {
        if (isString(reader.result)) {
          onUpload(reader.result);
        }
      });

      files.forEach((file) => reader.readAsText(file));
    },
    [onUpload, onError],
  );

  return (
    <DropZone
      accept={accept}
      disabled={disabled}
      multiple={false}
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div {...getRootProps()}>
          <input {...getInputProps()} />

          <FileUploadStyle
            disabled={disabled}
            isAlternateColor={isAlternateColor}
          >
            {isDragActive ? <p>Drop your file here</p> : <p>{uploadText}</p>}
          </FileUploadStyle>
        </div>
      )}
    </DropZone>
  );
};

FileUpload.propTypes = {
  accept: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  onError: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  uploadText: PropTypes.string,
};

export const FileUploadStyle = styled.div`
  max-width: 100%;

  padding: 3rem;
  padding-right: 1.5rem;
  padding-left: 1.5rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 5px;

  vertical-align: middle;

  white-space: nowrap;

  color: ${(props) =>
    props.isAlternateColor ? styles.colors.yellow : styles.colors.white};

  background-color: ${styles.colors.violet};

  text-overflow: ellipsis;

  opacity: ${(props) => (props.disabled ? 0.2 : 1)};

  text-align: center;
`;

export default FileUpload;
