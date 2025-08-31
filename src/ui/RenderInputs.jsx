import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import useThemeStyles from '../hooks/useThemeStyles';

// Switch button
const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));


// Simple labeled input
export const RenderLabeledInput = ({ value, onChange, inputName, label, placeholder, switchValue, onSwitch, switchName, type = "text", isDisabled }) => {
    const { grayText, border } = useThemeStyles();

    return (
        <div className="flex flex-col items-start mb-4">
            <label className={`text-sm font-medium ${grayText} mb-2`}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                name={inputName}
                onChange={(e) => onChange(e)}
                disabled={isDisabled || false}
                className={`mb-1 block w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 ${border} disabled:opacity-65 disabled:cursor-not-allowed`}
            />
            {(onSwitch && switchName) && <div className='flex items-end space-x-1'>
                <Android12Switch
                    checked={switchValue}
                    name={switchName}
                    value={switchValue}
                    onChange={(e) => onSwitch(e)}
                />
                <span className={`text-sm font-medium ${grayText} mb-2`}>Show on profile?</span>
            </div>}
        </div>
    );
}

// Dropdown with switch button
export const RenderDropdownWithSwitchButton = ({ value, onChange, inputName, label, options = [], switchValue, onSwitch, switchName }) => {
  const { grayText, border } = useThemeStyles();

  return (
    <div className="flex flex-col items-start mb-4">
      <label className={`text-sm font-medium ${grayText} mb-2`}>{label}</label>
      <select
        value={value}
        name={inputName}
        onChange={onChange}
        className={`mb-1 block w-full px-4 py-2 border rounded-xl focus:ring-blue-500 focus:border-blue-500 bg-transparent ${border}`}
      >
        <option value="" className={`${grayText}`}>Select {label}</option>
        {options.map(opt => (
          <option key={opt} value={opt} className='text-black'>{opt}</option>
        ))}
      </select>

      <div className="flex items-end space-x-1">
        <Android12Switch
          checked={switchValue}
          name={switchName}
          value={switchValue}
          onChange={onSwitch}
        />
        <span className={`text-sm font-medium ${grayText} mb-2`}>Show on profile?</span>
      </div>
    </div>
  );
};
