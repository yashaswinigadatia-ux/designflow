import { Slider } from '@/components/ui/slider';
import type { AgentNodeData, AgentProvider } from '@/workflow/workflow-types';
import { Field } from '../node-field';
import { ModelSelector } from '../model-selector';
import { useNodeData } from '../use-node-data';

export function AgentBody({ data }: { readonly data: AgentNodeData }) {
    const patch = useNodeData<AgentNodeData>();

    return (
        <div className="space-y-4">

            <Field label="Component Type">
                <ModelSelector
    model={data.model}
    className="w-full"
    onChange={(model) =>
        patch({
            model,
        })
    }
/>
            </Field>

            <Field label={`Corner Radius • ${data.tokenBudget}px`}>
                <Slider
                    aria-label="Corner Radius"
                    min={0}
                    max={40}
                    step={2}
                    value={[data.tokenBudget]}
                    onValueChange={([value]) =>
                        patch({
                            tokenBudget: value,
                        })
                    }
                />
            </Field>

        </div>
    );
}