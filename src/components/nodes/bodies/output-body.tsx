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

import type {
    OutputNodeData,
} from '@/workflow/workflow-types';

import { cn } from '@/utils/cn';

import { Field } from '../node-field';
import { useNodeData } from '../use-node-data';

import {
    PrototypeRenderer,
    type PrototypeData,
} from './prototype-renderer';


function parsePrototype(
    preview?: string,
): PrototypeData | null {

    if (!preview?.trim()) {
        return null;
    }

    try {

        const parsed =
            JSON.parse(preview);

        if (
            parsed &&
            typeof parsed === 'object'
        ) {
            return parsed as PrototypeData;
        }

    } catch {
        // Preview may still be old markdown.
    }

    return null;
}


export function MarkdownResult({
    preview,
    markdown,
}: {
    readonly preview?: string;
    readonly markdown?: string;
}) {

    const content =
        preview ??
        markdown ??
        '';


    const prototype =
        parsePrototype(content);


    if (prototype) {

        return (
            <div className="min-h-0 overflow-hidden rounded-md">

                <PrototypeRenderer
                    data={prototype}
                />

            </div>
        );
    }


    if (!content) {

        return (
            <p
                className="
                    rounded-md
                    border
                    border-dashed
                    border-border
                    px-3
                    py-6
                    text-center
                    text-xs
                    text-muted-foreground
                "
            >
                Build your prototype to preview it...
            </p>
        );
    }


    return (
        <div
            className="
                rounded-md
                border
                border-border
                bg-muted/30
                p-3
                text-xs
                whitespace-pre-wrap
            "
        >
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

    const prototype =
        parsePrototype(preview);


    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent
                className="
                    h-[92vh]
                    w-[96vw]
                    max-w-6xl
                    overflow-hidden
                    p-0
                "
            >

                <DialogHeader className="shrink-0 px-6 pt-6">

                    <DialogTitle>
                        Prototype Preview
                    </DialogTitle>

                    <DialogDescription>
                        Preview of your generated UI prototype.
                    </DialogDescription>

                </DialogHeader>


                <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4">

                    {prototype ? (

                        <PrototypeRenderer
                            data={prototype}
                            fullscreen
                        />

                    ) : (

                        <div
                            className="
                                h-full
                                overflow-auto
                                rounded-lg
                                border
                                border-border
                                bg-muted/30
                                p-4
                                text-sm
                                whitespace-pre-wrap
                            "
                        >
                            {preview ||
                                'Build your prototype to preview it...'}
                        </div>

                    )}

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

    const [open, setOpen] =
        useState(false);


    const content =
        preview ??
        markdown ??
        '';


    return (
        <div className="relative min-w-0">

            <div
                onPointerDown={(event) =>
                    event.stopPropagation()
                }
                data-jj-scrollable
                className={cn(
                    `
                        overflow-auto
                        overscroll-contain
                        rounded-md
                        border
                        border-border
                        bg-muted/30
                    `,
                    boxClassName,
                )}
            >

                <MarkdownResult
                    preview={content}
                />

            </div>


            <button
                type="button"
                aria-label="Open prototype preview"
                onClick={() =>
                    setOpen(true)
                }
                className="
                    absolute
                    right-1.5
                    top-1.5
                    grid
                    size-7
                    place-items-center
                    rounded-md
                    border
                    border-border/60
                    bg-card/85
                    text-muted-foreground
                    shadow-sm
                    backdrop-blur-sm
                    transition-colors
                    hover:text-foreground
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                "
            >

                <Maximize2
                    className="
                        pointer-events-none
                        size-3.5
                    "
                />

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

    const patch =
        useNodeData<OutputNodeData>();


    return (
        <div className="space-y-3">

            <Field label="Prototype Name">

                <Input
                    value={data.prototypeName}
                    placeholder="Login Prototype"
                    onChange={(event) =>
                        patch({
                            prototypeName:
                                event.target.value,
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
                            version:
                                event.target.value,
                        })
                    }
                />

            </Field>


            <Field label="Preview">

                <ExpandableResult
                    preview={data.preview}
                    boxClassName="max-h-72"
                />

            </Field>

        </div>
    );
}