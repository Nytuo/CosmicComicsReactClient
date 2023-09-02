import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ReactNode } from 'react';

/**
 * Selector component that renders a dropdown menu with selectable options.
 * @param options - An array of strings representing the selectable options.
 * @param label - A string representing the label of the dropdown menu.
 * @param handleChange - A function that handles the change event of the dropdown menu.
 * @param value - A string representing the currently selected option.
 * @param labelId - A string representing the ID of the label element.
 * @param id - A string representing the ID of the dropdown menu element.
 * @returns A React component that renders a dropdown menu with selectable options.
 */
export default function Selector({ options, label, handleChange, value, labelId, id }: { options: string[], label: string, handleChange: (event: SelectChangeEvent<string>, child: ReactNode) => void, value: string, labelId: string, id: string; }) {


    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id={labelId}>{label}</InputLabel>
                <Select
                    labelId={labelId}
                    id={id}
                    value={value}
                    onChange={handleChange}
                    autoWidth
                    label={label}
                >
                    {options.map((option: string, index: number) => {
                        return (
                            <MenuItem value={option} key={index}>{option}</MenuItem>
                        );
                    })
                    }
                </Select>
            </FormControl>
        </div>
    );
}