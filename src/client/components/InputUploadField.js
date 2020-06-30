import PropTypes from 'prop-types';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import mime from 'mime/lite';
import { useDispatch } from 'react-redux';

import translate from '~/common/services/i18n';

import ButtonOutline from '~/client/components/ButtonOutline';
import InputFieldset from '~/client/components/InputFieldset';
import styles from '~/client/styles/variables';
import { imageToBase64 } from '~/client/services/images';
import { postRequest } from '~/client/store/api/actions';
import { useField } from '~/client/hooks/forms';
import { useRequest, useRequestId } from '~/client/hooks/requests';

import notify, {
  NotificationsTypes,
} from '~/client/store/notifications/actions';

const DOCUMENT_FILE_TYPES = ['pdf'];
const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];

function isImage(fileType) {
  return IMAGE_FILE_TYPES.includes(fileType);
}

const InputUploadField = ({
  isImageUpload = true,
  isMultipleFilesAllowed = false,
  label,
  name,
  validate,
}) => {
  const dispatch = useDispatch();

  const fileInputElem = React.createRef();

  const fileTypes = isImageUpload ? IMAGE_FILE_TYPES : DOCUMENT_FILE_TYPES;

  // Internal state of the component which holds all the
  // information we need to preview and manage files in the
  // user interface
  const [filesData, setFilesData] = useState([]);
  const [previousFilesData, setPreviousFilesData] = useState([]);
  const [pendingFilesData, setPendingFilesData] = useState([]);

  // Upload files to server and receive file ids
  const requestId = useRequestId();

  const { isPending } = useRequest(requestId, {
    onError: () => {
      setFilesData(previousFilesData);

      dispatch(
        notify({
          text: translate('InputUploadField.errorMessage'),
          type: NotificationsTypes.ERROR,
        }),
      );
    },
    onSuccess: (uploadedFiles) => {
      // Update new files for internal state as well
      setFilesData(
        previousFilesData.concat(
          uploadedFiles.map((file, index) => {
            // Keep previews to not reload images
            return {
              ...file,
              base64: pendingFilesData[index].base64,
            };
          }),
        ),
      );

      // setPendingFilesData([]);
      setPreviousFilesData([]);

      // Add uploaded file id to field values
      setValue(value.concat(uploadedFiles));
    },
  });

  useEffect(() => {
    // Indicate that we're upload the files now, this causes
    // the form submit button to be disabled during the
    // upload
    form.setMeta({
      isPending,
    });
  }, [isPending, form]);

  // Register form field
  const { form, meta, setMeta, setValue, value } = useField(name, {
    validate,
    defaultValue: [],
  });

  // Bring initial field value into our internal state when component gets
  // mounted
  useEffect(() => {
    setFilesData(value);
  }, [value]);

  const onClickUpload = (event) => {
    event.preventDefault();
    fileInputElem.current.click();
  };

  const onRemove = (fileId) => {
    setValue(value.filter((file) => file.id !== fileId));

    setFilesData(filesData.filter((file) => file.id !== fileId));
    setPendingFilesData(filesData.filter((file) => file.id !== fileId));
    setPreviousFilesData(filesData.filter((file) => file.id !== fileId));
  };

  const onChangeFiles = async (event) => {
    event.persist();

    const { files } = event.target;

    if (files.length === 0) {
      return;
    }

    // Bring files into our internal data structure to
    // process them further and display them to the user
    const newFilesData = [];
    for (let file of files) {
      const fileType = mime.getExtension(file.type);

      // Generate previews of images when given
      let base64 = null;
      if (isImage(fileType)) {
        try {
          base64 = await imageToBase64(file);
        } catch {
          // Do nothing
        }
      }

      const newFileData = {
        // Not set, as its not created yet
        id: null,
        fileName: null,
        url: null,
        urlThreshold: null,
        urlThresholdThumb: null,
        urlThumb: null,

        // Things we already know
        fileType,

        // This we only need to display previews until image is uploaded
        base64,
      };

      newFilesData.push(newFileData);
    }

    // Add new files to previous ones
    setPreviousFilesData([...filesData]);
    setPendingFilesData([...newFilesData]);
    setFilesData(filesData.concat(newFilesData));

    // Inform form element that this field was used
    setMeta({
      isTouched: true,
    });

    // Start upload
    dispatch(
      postRequest({
        id: requestId,
        isResponseKept: true,
        path: isImageUpload ? ['uploads', 'images'] : ['uploads', 'documents'],
        body: [...files].reduce((acc, file) => {
          acc.append('files', file, file.name);
          return acc;
        }, new FormData()),
      }),
    );

    // Reset upload input element
    event.target.value = '';
  };

  const fileTypesStr = fileTypes
    .map((ext) => {
      return mime.getType(ext);
    })
    .join(',');

  return (
    <InputFieldset label={label} meta={meta} name={name}>
      <InputUploadFieldItems files={filesData} onRemove={onRemove} />

      <input
        accept={fileTypesStr}
        multiple={isMultipleFilesAllowed}
        ref={fileInputElem}
        style={{ display: 'none' }}
        type="file"
        onChange={onChangeFiles}
      />

      <ButtonOutline disabled={form.meta.isPending} onClick={onClickUpload}>
        {translate('InputUploadField.buttonSelectFiles')}
      </ButtonOutline>
    </InputFieldset>
  );
};

const InputUploadFieldItems = ({ files, onRemove }) => {
  return (
    <InputUploadFieldItemsStyle>
      {files.map(({ id, fileName, fileType, base64, urlThumb }, index) => {
        const onClickRemove = () => {
          onRemove(id);
        };

        return (
          <InputUploadFieldItemStyle key={index}>
            {isImage(fileType) ? (
              <InputUploadFieldImageStyle src={base64 || urlThumb} width={50} />
            ) : null}

            <InputUploadFieldItemTextStyle>
              {fileName} [{fileType}]
            </InputUploadFieldItemTextStyle>

            <ButtonOutline disabled={!id} onClick={onClickRemove}>
              {translate('InputUploadField.buttonRemoveFile')}
            </ButtonOutline>
          </InputUploadFieldItemStyle>
        );
      })}
    </InputUploadFieldItemsStyle>
  );
};

const InputUploadFieldItemsStyle = styled.ul`
  padding: 0;

  list-style: none;
`;

const InputUploadFieldItemStyle = styled.li`
  display: flex;

  padding: 1rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 20px;

  color: ${styles.colors.violet};

  align-items: center;
  justify-content: space-between;

  & + & {
    margin-top: 1rem;
  }
`;

const InputUploadFieldImageStyle = styled.img`
  width: 10rem;

  border: 1.5px solid ${styles.colors.violet};
  border-radius: 20px;
`;

const InputUploadFieldItemTextStyle = styled.span``;

InputUploadField.propTypes = {
  isImageUpload: PropTypes.bool,
  isMultipleFilesAllowed: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

InputUploadFieldItems.propTypes = {
  files: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default InputUploadField;
