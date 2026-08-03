import { Input } from '@/components/ui/input';
import type { AgentNodeData } from '@/workflow/workflow-types';
import { Field } from '../node-field';
import { useNodeData } from '../use-node-data';

export function AgentBody({
    data,
}: {
    readonly data: AgentNodeData;
}) {
    const patch = useNodeData<AgentNodeData>();

    return (
        <div className="space-y-3">

            <Field label="Component Type">
                <Input
                    value={data.componentType}
                    placeholder="Button / Card / Input"
                    onChange={(event) =>
                        patch({
                            componentType: event.target.value as AgentNodeData['componentType'],
                        })
                    }
                />
            </Field>


            <Field label="Variant">
                <Input
                    value={data.variant}
                    placeholder="Primary / Secondary"
                    onChange={(event) =>
                        patch({
                            variant: event.target.value,
                        })
                    }
                />
            </Field>


            <Field label="Label">
                <Input
                    value={data.label}
                    placeholder="Login"
                    onChange={(event) =>
                        patch({
                            label: event.target.value,
                        })
                    }
                />
            </Field>

        </div>
    );
}