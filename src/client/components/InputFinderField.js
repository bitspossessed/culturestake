import PropTypes from 'prop-types';
import React from 'react';

import Finder from '~/client/components/Finder';
import InputFieldset from '~/client/components/InputFieldset';
import { useField } from '~/client/hooks/forms';

const InputFinderField = ({
  clientSideFilter,
  defaultQuery,
  isDisabled = false,
  label,
  name,
  placeholder,
  queryPath,
  searchParam,
  selectParam = 'id',
  validate,
}) => {
  const { meta, setMeta, setValue, value } = useField(name, {
    validate,
  });

  const onChange = (item) => {
    if (item) {
      setValue(item[selectParam]);
    } else {
      setValue(null);
    }

    setMeta({
      isTouched: true,
    });
  };

  return (
    <InputFieldset label={label} meta={meta} name={name}>
      <Finder
        clientSideFilter={clientSideFilter}
        defaultQuery={defaultQuery}
        isDisabled={isDisabled}
        label={label}
        name={name}
        placeholder={placeholder}
        queryPath={queryPath}
        searchParam={searchParam}
        selectParam={selectParam}
        value={value}
        onChange={onChange}
      />
    </InputFieldset>
  );
};

InputFinderField.propTypes = {
  clientSideFilter: PropTypes.func,
  defaultQuery: PropTypes.object,
  isDisabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  queryPath: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchParam: PropTypes.string.isRequired,
  selectParam: PropTypes.string,
  validate: PropTypes.object.isRequired,
};

export default InputFinderField;
