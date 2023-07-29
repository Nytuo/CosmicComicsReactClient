import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ReactNode } from 'react';

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