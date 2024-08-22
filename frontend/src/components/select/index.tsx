import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FormControl } from "@mui/material";
import { SelectStateProps } from "../../models/select";
import Stack from "@mui/material/Stack";

function SelectState({ state, handleChange }: Readonly<SelectStateProps>) {
  return (
    <FormControl size="small">
      <Stack direction="row" spacing={1}>
        <p
          style={{
            padding: "0",
            margin: "0",
            fontSize: "18px",
            marginTop: "8px",
          }}
        >
          Filter By State{" "}
        </p>
        <Select
          sx={{ backgroundColor: "#f0f0f0" }}
          labelId="label-state"
          id="select-state"
          value={state}
          label="State"
          variant="outlined"
          onChange={handleChange}
        >
          {["all", "pending", "deleted", "success"].map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </FormControl>
  );
}

export default SelectState;
