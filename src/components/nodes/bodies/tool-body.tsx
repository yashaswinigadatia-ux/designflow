import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import type { ToolNodeData } from '@/workflow/workflow-types';
import { Field } from '../node-field';
import { useNodeData } from '../use-node-data';

export function ToolBody({ data }: { readonly data: ToolNodeData }) {
    const patch = useNodeData<ToolNodeData>();

    return (
        <div className="space-y-2.5">

            <Field label="Navigation Title">
                <Input
                    value={data.subreddit}
                    placeholder="Home"
                    onChange={(event) =>
                        patch({
                            subreddit: event.target.value,
                        })
                    }
                />
            </Field>

            <Field label={`Number of Menu Items · ${data.limit}`}>
                <Slider
                    aria-label="Menu Items"
                    min={1}
                    max={8}
                    step={1}
                    value={[data.limit]}
                    onValueChange={([limit]) =>
                        patch({
                            limit,
                        })
                    }
                />
            </Field>

        </div>
    );
}