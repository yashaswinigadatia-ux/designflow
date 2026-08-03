import { Textarea } from '@/components/ui/textarea';
import type { InputNodeData } from '@/workflow/workflow-types';
import { Field } from '../node-field';
import { useNodeData } from '../use-node-data';

export function TextInputBody({ data }: { readonly data: InputNodeData }) {
    const patch = useNodeData<InputNodeData>();

    return (
        <div className="space-y-3">

            <Field label="Screen Name">
                <Textarea
                    value={data.prompt}
                    placeholder="Enter screen name..."
                    onChange={(e) =>
                        patch({
                            prompt: e.target.value,
                        })
                    }
                    className="resize-none min-h-16"
                />
            </Field>

            <Field label="Screen Description">
                <Textarea
                    placeholder="Describe this screen..."
                    className="resize-none min-h-20"
                />
            </Field>

        </div>
    );
}