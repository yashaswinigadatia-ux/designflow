import { Textarea } from '@/components/ui/textarea';
import type { SkillNodeData } from '@/workflow/workflow-types';
import { Field } from '../node-field';
import { useNodeData } from '../use-node-data';

export function SkillBody({
    data,
}: {
    readonly data: SkillNodeData;
}) {
    const patch = useNodeData<SkillNodeData>();

    return (
        <div className="space-y-3">

            <Field label="Screen Name">
                <Textarea
                    value={data.screenName}
                    placeholder="Enter screen name..."
                    onChange={(event) =>
                        patch({
                            screenName: event.target.value,
                        })
                    }
                    className="resize-none min-h-16"
                />
            </Field>


            <Field label="Layout">
                <Textarea
                    value={data.layout}
                    placeholder="Mobile / Tablet / Desktop"
                    onChange={(event) =>
                        patch({
                            layout: event.target.value as SkillNodeData['layout'],
                        })
                    }
                    className="resize-none min-h-16"
                />
            </Field>


            <Field label="Description">
                <Textarea
                    value={data.description}
                    placeholder="Describe this screen..."
                    onChange={(event) =>
                        patch({
                            description: event.target.value,
                        })
                    }
                    className="resize-none min-h-20"
                />
            </Field>

        </div>
    );
}