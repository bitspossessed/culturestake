import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import mime from 'mime/lite';

import translate from '~/common/services/i18n';

import InputFieldset from '~/client/components/InputFieldset';
import { imageToBase64 } from '~/client/services/images';
import { useField } from '~/client/hooks/forms';

export const DOCUMENT_FILE_TYPES = ['pdf'];
export const IMAGE_FILE_TYPES = ['jpg', 'jpeg', 'png'];

const DEFAULT_FILE_TYPES = IMAGE_FILE_TYPES;
const DEFAULT_MAX_FILE_COUNT = 1;

function isImage(fileType) {
  return IMAGE_FILE_TYPES.includes(fileType);
}

const InputUploadField = ({
  fileTypes = DEFAULT_FILE_TYPES,
  maxFileCount = DEFAULT_MAX_FILE_COUNT,
  label,
  name,
  validate,
}) => {
  const fileInputElem = React.createRef();

  // Internal state of the component which holds all the
  // information we need to preview and manage files in the
  // user interface
  const [filesData, setFilesData] = useState([]);

  // Register form field
  const { form, meta, setMeta, setValue, value } = useField(name, {
    validate,
    defaultValue: [],
  });

  // Bring initial field value into our internal state when component gets
  // mounted
  useEffect(() => {
    setFilesData(value);
  }, []);

  const onClickUpload = event => {
    event.preventDefault();
    fileInputElem.current.click();
  };

  const onRemove = fileId => {
    setValue(value.filter(file => file.id !== fileId));
    setFilesData(filesData.filter(file => file.id !== fileId));
  };

  const onChangeFiles = async event => {
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
    const tempFilesData = [...filesData];
    setFilesData(filesData.concat(newFilesData));

    // Inform form element that this field was used
    setMeta({
      isTouched: true,
    });

    // Indicate that we're upload the files now, this causes
    // the form submit button to be disabled during the
    // upload
    form.setMeta({
      isPending: true,
    });

    // Upload files to server and receive file ids
    // const uploadedFiles = await uploadFiles(files); // @TODO
    await new Promise(resolve => setTimeout(resolve, 2500));
    const uploadedFiles = newFilesData.map(file => {
      file.id = Math.round(Math.random() * 100000);
      return file;
    });

    // Update new files for internal state as well
    setFilesData(
      tempFilesData.concat(
        uploadedFiles.map((file, index) => {
          // Keep previews to not reload images
          file.base64 = newFilesData[index].base64;
          return file;
        }),
      ),
    );

    // Add uploaded file id to field values
    setValue(value.concat(uploadedFiles));

    // Unset pending flag for form
    form.setMeta({
      isPending: false,
    });

    // Reset upload input element
    event.target.value = '';
  };

  const fileTypesStr = fileTypes
    .map(ext => {
      return mime.getType(ext);
    })
    .join(',');

  return (
    <InputFieldset label={label} meta={meta} name={name}>
      <InputUploadFieldItems files={filesData} onRemove={onRemove} />

      <input
        accept={fileTypesStr}
        multiple={maxFileCount > 1}
        ref={fileInputElem}
        style={{ display: 'none' }}
        type="file"
        onChange={onChangeFiles}
      />

      <button disabled={form.meta.isPending} onClick={onClickUpload}>
        {translate('InputUploadField.buttonSelectFiles')}
      </button>
    </InputFieldset>
  );
};

const InputUploadFieldItems = ({ files, onRemove }) => {
  return (
    <ul>
      {files.map(({ id, fileName, fileType, base64, urlThumb }, index) => {
        const onClickRemove = () => {
          onRemove(id);
        };

        return (
          <li key={index}>
            <span>
              {fileName} [{fileType}]
            </span>

            {isImage(fileType) ? (
              <img src={base64 || urlThumb} width={50} />
            ) : null}

            <button disabled={!id} onClick={onClickRemove}>
              {translate('InputUploadField.buttonRemoveFile')}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

InputUploadField.propTypes = {
  fileTypes: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string.isRequired,
  maxFileCount: PropTypes.number,
  name: PropTypes.string.isRequired,
  validate: PropTypes.object.isRequired,
  value: PropTypes.string,
};

InputUploadFieldItems.propTypes = {
  files: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default InputUploadField;
