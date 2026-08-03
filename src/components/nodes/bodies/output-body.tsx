import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { usePress } from '@/hooks/use-press';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { MarkdownView } from '@/components/ui/markdown';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import type { OutputNodeData } from '@/workflow/workflow-types';

// Preview of the generated UI design.
export function MarkdownResult({ markdown }: { readonly markdown: string }) {
    if (!markdown) {
        return (
            <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                Build your design to preview it...
            </p>
        );
    }

    return <MarkdownView markdown={markdown} />;
}

function ResultDialog({
    open,
    onOpenChange,
    markdown,
}: {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly markdown: string;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[92vw] max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Prototype Preview</DialogTitle>
                    <DialogDescription>
                        Preview of your generated UI design.
                    </DialogDescription>
                </DialogHeader>

                <div className="-mx-1 max-h-[70vh] overflow-auto px-1">
                    <MarkdownResult markdown={markdown} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function ExpandableResult({
    markdown,
    boxClassName,
}: {
    readonly markdown: string;
    readonly boxClassName?: string;
}) {
    const [open, setOpen] = useState(false);

    const expandPress = usePress(() => setOpen(true), {
        activateOn: 'pointerup',
    });

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
                <MarkdownResult markdown={markdown} />
            </div>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        aria-label="Open prototype preview"
                        onPointerDown={(event) => {
                            event.stopPropagation();
                            expandPress.onPointerDown(event);
                        }}
                        onPointerMove={expandPress.onPointerMove}
                        onPointerUp={(event) => {
                            event.stopPropagation();
                            expandPress.onPointerUp(event);
                        }}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            expandPress.onClick(event);
                        }}
                        className={cn(
                            'absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-md',
                            'border border-border/60 bg-card/85 text-muted-foreground shadow-sm backdrop-blur-sm',
                            'transition-colors hover:text-foreground',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        )}
                    >
                        <Maximize2 className="size-3.5 pointer-events-none" />
                    </button>
                </TooltipTrigger>

                <TooltipContent>
                    Open Prototype Preview
                </TooltipContent>
            </Tooltip>

            <ResultDialog
                open={open}
                onOpenChange={setOpen}
                markdown={markdown}
            />
        </div>
    );
}

export function OutputBody({
    data,
}: {
    readonly data: OutputNodeData;
}) {
    if (!data.markdown) {
        return <MarkdownResult markdown="" />;
    }

    return (
        <ExpandableResult
            markdown={data.markdown}
            boxClassName="max-h-56"
        />
    );
}