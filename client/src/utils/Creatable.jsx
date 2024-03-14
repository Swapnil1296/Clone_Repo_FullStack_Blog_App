import React, { useEffect, useState } from "react";

import CreatableSelect from "react-select/creatable";
const customStyles = {
  control: (provided) => ({
    ...provided,
    color: "blue", // Change font color
    fontWeight: "bold",
    textTransform: "capitalize",
    whiteSpace: "normal", // Allow text wrapping
    maxWidth: "400px", // Set a fixed size for the options
  }),
  multiValue: (provided) => ({
    ...provided,
    color: "green",
    backgroundColor: "violet", // Change multi-value (pill) color
  }),
};

export const SelectMulti = ({ categorries, setFormData }) => {
  const uniqueCategories = [...new Set(categorries)];

  const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const defaultOptions =
    uniqueCategories?.map((item) => createOption(item)) || [];
  console.log(categorries);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const [value, setValue] = useState();
  useEffect(() => {
    const getLabel = value?.map((value) => value.label);

    setFormData((prev) => ({
      ...prev,
      category: getLabel,
    }));
  }, [value]);
  const handleCreate = (inputValue) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      setValue((prev) => [...prev, newOption]);
    }, 1000);
  };

  return (
    <CreatableSelect
      styles={customStyles}
      isMulti
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={(newValue) => setValue(newValue)}
      onCreateOption={handleCreate}
      options={defaultOptions}
      value={value}
    />
  );
};
