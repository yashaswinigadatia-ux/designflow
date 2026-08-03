import { Input } from '@/components/ui/input';
import type { ToolNodeData } from '@/workflow/workflow-types';
import { Field } from '../node-field';
import { useNodeData } from '../use-node-data';

export function ToolBody({
    data,
}: {
    readonly data: ToolNodeData;
}) {
    const patch = useNodeData<ToolNodeData>();

    return (
        <div className="space-y-3">

            <Field label="Navigation Position">
                <Input
                    value={data.navigationPosition}
                    placeholder="Top / Bottom / Side"
                    onChange={(event) =>
                        patch({
                            navigationPosition: event.target.value,
                        })
                    }
                />
            </Field>


            <Field label="Logo">
                <Input
                    value={data.logo}
                    placeholder="Enter logo name..."
                    onChange={(event) =>
                        patch({
                            logo: event.target.value,
                        })
                    }
                />
            </Field>


            <Field label="Menu Items">
                <Input
                    value={data.menuItems}
                    placeholder="Home, Profile, Settings"
                    onChange={(event) =>
                        patch({
                            menuItems: event.target.value,
                        })
                    }
                />
            </Field>

        </div>
    );
}