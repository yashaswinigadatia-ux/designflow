import { useState } from 'react';
import { Maximize2 } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { OutputNodeData } from '@/workflow/workflow-types';
import { cn } from '@/utils/cn';
import { Field } from '../node-field';
import { useNodeData } from '../use-node-data';


export function MarkdownResult({
    preview,
    markdown,
}: {
    readonly preview?: string;
    readonly markdown?: string;
}) {
    const content = preview ?? markdown ?? '';

    if (!content) {
        return (
            <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                Build your prototype to preview it...
            </p>
        );
    }

    return (
        <div className="rounded-md border border-border bg-muted/30 p-3 text-xs whitespace-pre-wrap">
            {content}
        </div>
    );
}


function PreviewDialog({
    open,
    onOpenChange,
    preview,
}: {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly preview: string;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[92vw] max-w-3xl">

                <DialogHeader>
                    <DialogTitle>
                        Prototype Preview
                    </DialogTitle>

                    <DialogDescription>
                        Preview of your generated UI prototype.
                    </DialogDescription>
                </DialogHeader>

                <div className="-mx-1 max-h-[70vh] overflow-auto px-1">
                    <MarkdownResult preview={preview} />
                </div>

            </DialogContent>
        </Dialog>
    );
}


export function ExpandableResult({
    preview,
    markdown,
    boxClassName,
}: {
    readonly preview?: string;
    readonly markdown?: string;
    readonly boxClassName?: string;
}) {
    const [open, setOpen] = useState(false);

    const content = preview ?? markdown ?? '';

    return (
        <div className="relative min-w-0">

            <div
                onPointerDown={(event) => event.stopPropagation()}
                data-jj-scrollable
                className={cn(
                    'overflow-auto overscroll-contain rounded-md border border-border bg-muted/30 px-3 py-2',
                    boxClassName,
                )}
            >
                <MarkdownResult preview={content} />
            </div>


            <button
                type="button"
                aria-label="Open prototype preview"
                onClick={() => setOpen(true)}
                className={cn(
                    'absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-md',
                    'border border-border/60 bg-card/85 text-muted-foreground shadow-sm backdrop-blur-sm',
                    'transition-colors hover:text-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
            >
                <Maximize2 className="size-3.5 pointer-events-none" />
            </button>


            <PreviewDialog
                open={open}
                onOpenChange={setOpen}
                preview={content}
            />

        </div>
    );
}


export function OutputBody({
    data,
}: {
    readonly data: OutputNodeData;
}) {
    const patch = useNodeData<OutputNodeData>();

    return (
        <div className="space-y-3">

            <Field label="Prototype Name">
                <Input
                    value={data.prototypeName}
                    placeholder="Login Prototype"
                    onChange={(event) =>
                        patch({
                            prototypeName: event.target.value,
                        })
                    }
                />
            </Field>


            <Field label="Version">
                <Input
                    value={data.version}
                    placeholder="v1.0"
                    onChange={(event) =>
                        patch({
                            version: event.target.value,
                        })
                    }
                />
            </Field>


            <Field label="Preview">
                <ExpandableResult
                    preview={data.preview}
                    boxClassName="max-h-56"
                />
            </Field>

        </div>
    );
}