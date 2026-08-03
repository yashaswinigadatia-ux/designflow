import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ModelSelectorProps {
    readonly model: string;
    readonly onChange: (model: string) => void;
    readonly className?: string;
}

const COMPONENT_TYPES = [
    'Primary Button',
    'Secondary Button',
    'Icon Button',
    'Text Button',
    'Floating Action Button',
    'Outlined Button',
    'Card',
    'Input Field',
    'Text Area',
    'Dropdown',
    'Checkbox',
    'Radio Button',
    'Switch',
    'Search Bar',
    'Navigation Bar',
    'Tab Bar',
    'Sidebar',
    'Modal',
    'Alert Dialog',
    'Avatar',
    'Profile Card',
];

export function ModelSelector({
    model,
    onChange,
    className,
}: ModelSelectorProps) {
    return (
        <Select
            value={model}
            onValueChange={onChange}
        >
            <SelectTrigger
                className={className}
                aria-label="Component Type"
            >
                <SelectValue placeholder="Select Component Type" />
            </SelectTrigger>

            <SelectContent>
                {COMPONENT_TYPES.map((component) => (
                    <SelectItem
                        key={component}
                        value={component}
                    >
                        {component}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}