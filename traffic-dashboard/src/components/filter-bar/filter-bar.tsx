import { Autocomplete, Chip, Input, TextField } from "@mui/material";
import { ChangeEventHandler } from "react";
import { MethodSelector } from "../method-selector/method-selector";
import styles from "./filter-bar.module.scss";

interface IFilterBarProps {
  services: string[];
  handleFilterChanged: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  setMethodsFilter: (methods: string[]) => void;
  setServicesFilter: (values: string[]) => void;
}

export const FilterBar: React.FC<IFilterBarProps> = ({
  services,
  handleFilterChanged,
  setMethodsFilter,
  setServicesFilter,
}) => {
  return (
    <div className={styles.container}>
      <Autocomplete
        freeSolo
        disablePortal
        multiple
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        options={services}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField variant="filled" {...params} label="Service" />
        )}
        onChange={(_, value) => {
          setServicesFilter(value);
        }}
      />
      <MethodSelector
        onChange={(values) => {
          setMethodsFilter(values);
        }}
      />
      <Input onChange={handleFilterChanged} placeholder="Endpoint..." />
    </div>
  );
};
