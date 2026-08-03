import { Textarea } from '@/components/ui/textarea';
import type { InputNodeData } from '@/workflow/workflow-types';
import { Field } from '../node-field';
import { useNodeData } from '../use-node-data';

export function TextInputBody({
    data,
}: {
    readonly data: InputNodeData;
}) {
    const patch = useNodeData<InputNodeData>();

    return (
        <Field label="Screen Description">
            <Textarea
                value={data.prompt}
                placeholder="Describe the screen..."
                onChange={(event) =>
                    patch({
                        prompt: event.target.value,
                    })
                }
                className="resize-none field-sizing-content min-h-20 max-h-[400px] overflow-auto overscroll-contain text-sm"
            />
        </Field>
    );
}