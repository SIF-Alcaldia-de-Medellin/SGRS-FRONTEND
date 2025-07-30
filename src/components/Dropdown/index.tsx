import './Dropdown.css';

interface StateOptions{
    label: string;
    value: string | number;
}

interface DropdownProps {
    options: Array<StateOptions>;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
}

function Dropdown({ options = [], onChange, className='primary' }: DropdownProps) {
    return (
        <div className={`dropdown ${className}`}>
        <select onChange={onChange}>
            {options.map((option, index) => (
            <option key={index} value={option.value}>
                {option.label}
            </option>
            ))}
        </select>
        </div>
    );
}

export default Dropdown;

