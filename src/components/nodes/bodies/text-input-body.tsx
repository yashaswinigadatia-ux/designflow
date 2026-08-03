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
        <div className="space-y-3">

            <Field label="Screen Name">
                <Textarea
                    value={data.screenName}
                    placeholder="Enter screen name..."
                    onChange={(e) =>
                        patch({
                            screenName: e.target.value,
                        })
                    }
                    className="resize-none min-h-16"
                />
            </Field>

            <Field label="Screen Type">
                <Textarea
                    value={data.screenType}
                    placeholder="Login / Home / Profile..."
                    onChange={(e) =>
                        patch({
                            screenType: e.target.value as InputNodeData['screenType'],
                        })
                    }
                    className="resize-none min-h-16"
                />
            </Field>

            <Field label="Description">
                <Textarea
                    value={data.description}
                    placeholder="Describe this screen..."
                    onChange={(e) =>
                        patch({
                            description: e.target.value,
                        })
                    }
                    className="resize-none min-h-20"
                />
            </Field>

        </div>
    );
}