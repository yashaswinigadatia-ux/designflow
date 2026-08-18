import { useGraph } from '@joint/react-plus';

import { ExpandableResult } from '@/components/nodes/bodies/output-body';
import { NodeIcon } from '@/components/nodes/node-icon';
import { PORT_CHIP_CLASS } from '@/components/nodes/port-style';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/cn';

import { NODE_CATALOG } from '@/workflow/node-catalog';
import { selectElements, selectLinks } from '@/workflow/selectors';

import type {
    Computed,
} from '@joint/react-plus';

import type {
    NodeAppearance,
    NodeData,
    WorkflowCell,
    WorkflowElement,
    WorkflowLink,
} from '@/workflow/workflow-types';

import { AppearanceSection } from './appearance-section';

import {
    Labelled,
    NodeTextarea,
    Panel,
} from './inspector-fields';

import { SwatchRow } from '@/components/ui/swatch-row';
import { InspectorEmptyState } from './inspector-empty-state';
import { NoteEditor } from './note-editor';


// -----------------------------------------------------------------------------
// Inspector
// -----------------------------------------------------------------------------

export function Inspector({
    cells,
}: {
    readonly cells: readonly Computed<WorkflowCell>[];
}) {
    const selectedElements = selectElements(cells);
    const selectedLinks = selectLinks(cells);

    // Nothing selected
    if (
        selectedElements.length === 0 &&
        selectedLinks.length === 0
    ) {
        return (
            <Panel>
                <InspectorEmptyState />
            </Panel>
        );
    }


    // Exactly one node selected
    if (
        selectedElements.length === 1 &&
        selectedLinks.length === 0
    ) {
        return (
            <Panel>
                <InspectorBody
                    element={selectedElements[0]}
                />
            </Panel>
        );
    }


    // Multiple things selected
    return (
        <Panel>
            <p className="text-xs text-muted-foreground">
                {describeSelection(
                    selectedElements.length,
                    selectedLinks.length,
                )}
            </p>
        </Panel>
    );
}


// -----------------------------------------------------------------------------
// Selection description
// -----------------------------------------------------------------------------

function describeSelection(
    nodeCount: number,
    linkCount: number,
): string {

    const parts: string[] = [];


    if (nodeCount > 0) {
        parts.push(
            `${nodeCount} ${
                nodeCount === 1
                    ? 'node'
                    : 'nodes'
            }`,
        );
    }


    if (linkCount > 0) {
        parts.push(
            `${linkCount} ${
                linkCount === 1
                    ? 'link'
                    : 'links'
            }`,
        );
    }


    return `${parts.join(' and ')} selected.`;
}


// -----------------------------------------------------------------------------
// Inspector body
// -----------------------------------------------------------------------------

interface InspectorBodyProps {
    readonly element: Computed<WorkflowElement>;
}


function InspectorBody({
    element,
}: InspectorBodyProps) {

    const {
        setCellData,
    } =
        useGraph<
            WorkflowElement,
            WorkflowLink
        >();


    const data =
        element.data;


    const elementId =
        element.id;


    // -------------------------------------------------------------------------
    // Generic data updater
    // -------------------------------------------------------------------------

    function updateData<T extends NodeData>(
        current: T,
        next: Partial<T>,
    ) {

        setCellData(
            elementId,
            {
                ...current,
                ...next,
            } as T,
        );
    }


    // -------------------------------------------------------------------------
    // Appearance
    // -------------------------------------------------------------------------

    function setAppearance(
        next: NodeAppearance,
    ) {

        if (data.kind === 'note') {
            return;
        }


        updateData(
            data,
            {
                appearance: {
                    ...data.appearance,
                    ...next,
                },
            },
        );
    }


    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------

    function setMeta(
        next: {
            name?: string;
            description?: string;
        },
    ) {

        if (data.kind === 'note') {
            return;
        }


        updateData(
            data,
            next,
        );
    }


    // -------------------------------------------------------------------------
    // NOTE
    // -------------------------------------------------------------------------

    if (data.kind === 'note') {

        return (
            <div className="space-y-3">

                <div className="space-y-2">

                    <span className="text-[11px] text-muted-foreground">
                        Note
                    </span>


                    <NoteEditor
                        text={data.text}
                        onChange={(text) =>
                            updateData(
                                data,
                                { text },
                            )
                        }
                    />

                </div>


                <div className="space-y-2">

                    <span className="text-[11px] text-muted-foreground">
                        Color
                    </span>


                    <SwatchRow
                        label="Note color"
                        value={data.color}
                        onChange={(color) =>
                            updateData(
                                data,
                                { color },
                            )
                        }
                        size="size-5"
                        ringOffset="ring-offset-background"
                        className="gap-1.5"
                    />

                </div>

            </div>
        );
    }


    // -------------------------------------------------------------------------
    // Catalog configuration
    // -------------------------------------------------------------------------

    const config =
        NODE_CATALOG[data.kind];


    return (
        <div className="space-y-5">

            {/* --------------------------------------------------------------- */}
            {/* Header                                                          */}
            {/* --------------------------------------------------------------- */}

            <header className="flex items-center gap-2.5">

                <span
                    className={cn(
                        'grid size-8 place-items-center rounded-lg',
                        PORT_CHIP_CLASS[config.accent],
                    )}
                >

                    <NodeIcon
                        name={config.icon}
                        className="size-4"
                    />

                </span>


                <div className="min-w-0">

                    <p className="truncate text-sm font-semibold">
                        {data.name ?? config.title}
                    </p>


                    <p className="truncate text-xs text-muted-foreground">
                        {config.title}
                    </p>

                </div>

            </header>


            {/* --------------------------------------------------------------- */}
            {/* Common fields                                                    */}
            {/* --------------------------------------------------------------- */}

            <div className="space-y-3">

                <Labelled label="Title">

                    <Input
                        value={
                            data.name ??
                            config.title
                        }
                        placeholder={config.title}
                        onChange={(event) =>
                            setMeta({
                                name:
                                    event.target.value,
                            })
                        }
                    />

                </Labelled>


                <Labelled label="Description">

                    <Input
                        value={
                            data.description ??
                            config.description
                        }
                        placeholder={config.description}
                        onChange={(event) =>
                            setMeta({
                                description:
                                    event.target.value,
                            })
                        }
                    />

                </Labelled>

            </div>


            {/* ================================================================= */}
            {/* INPUT SCREEN                                                       */}
            {/* ================================================================= */}

            {data.kind === 'input' && (

                <div className="space-y-3">

                    <Labelled label="Screen Name">

                        <Input
                            value={data.screenName}
                            placeholder="Login Screen"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        screenName:
                                            event.target.value,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <Labelled label="Screen Type">

                        <Input
                            value={data.screenType}
                            placeholder="Login"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        screenType:
                                            event.target.value as typeof data.screenType,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <Labelled label="Screen Description">

                        <NodeTextarea
                            value={data.description}
                            onChange={(description) =>
                                updateData(
                                    data,
                                    { description },
                                )
                            }
                        />

                    </Labelled>

                </div>

            )}


            {/* ================================================================= */}
            {/* SKILL / HOME SCREEN                                                */}
            {/* ================================================================= */}

            {data.kind === 'skill' && (

                <div className="space-y-3">

                    <Labelled label="Screen Name">

                        <Input
                            value={data.screenName}
                            placeholder="Home Screen"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        screenName:
                                            event.target.value,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <Labelled label="Layout">

                        <Input
                            value={data.layout}
                            placeholder="Mobile"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        layout:
                                            event.target.value as typeof data.layout,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <Labelled label="Screen Description">

                        <NodeTextarea
                            value={data.description}
                            onChange={(description) =>
                                updateData(
                                    data,
                                    { description },
                                )
                            }
                        />

                    </Labelled>

                </div>

            )}


            {/* ================================================================= */}
            {/* AGENT / UI COMPONENT                                               */}
            {/* ================================================================= */}

            {data.kind === 'agent' && (

                <div className="space-y-3">

                    <Labelled label="Component Type">

                        <Input
                            value={data.componentType}
                            placeholder="Button"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        componentType:
                                            event.target.value as typeof data.componentType,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <Labelled label="Variant">

                        <Input
                            value={data.variant}
                            placeholder="Primary"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        variant:
                                            event.target.value,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <Labelled label="Label">

                        <Input
                            value={data.label}
                            placeholder="Login"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        label:
                                            event.target.value,
                                    },
                                )
                            }
                        />

                    </Labelled>

                </div>

            )}


            {/* ================================================================= */}
            {/* TOOL / NAVIGATION BAR                                              */}
            {/* ================================================================= */}

            {data.kind === 'tool' && (

                <div className="space-y-3">

                    <Labelled label="Navigation Position">

                        <Input
                            value={
                                data.navigationPosition
                            }
                            placeholder="Top"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        navigationPosition:
                                            event.target.value,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <Labelled label="Logo">

                        <Input
                            value={data.logo}
                            placeholder="DesignFlow"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        logo:
                                            event.target.value,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <Labelled label="Menu Items">

                        <Input
                            value={data.menuItems}
                            placeholder="Home, Profile, Settings"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        menuItems:
                                            event.target.value,
                                    },
                                )
                            }
                        />

                    </Labelled>

                </div>

            )}


            {/* ================================================================= */}
            {/* OUTPUT / PROTOTYPE PREVIEW                                         */}
            {/* ================================================================= */}

            {data.kind === 'output' && (

                <div className="space-y-3">

                    <Labelled label="Prototype Name">

                        <Input
                            value={data.prototypeName}
                            placeholder="Login Prototype"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        prototypeName:
                                            event.target.value,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <Labelled label="Version">

                        <Input
                            value={data.version}
                            placeholder="v1.0"
                            onChange={(event) =>
                                updateData(
                                    data,
                                    {
                                        version:
                                            event.target.value,
                                    },
                                )
                            }
                        />

                    </Labelled>


                    <div className="space-y-2">

                        <span className="text-[11px] text-muted-foreground">
                            Preview
                        </span>


                        <ExpandableResult
                            preview={data.preview}
                            boxClassName="max-h-72"
                        />

                    </div>

                </div>

            )}


            {/* --------------------------------------------------------------- */}
            {/* Appearance                                                       */}
            {/* --------------------------------------------------------------- */}

            <AppearanceSection
                appearance={data.appearance}
                onChange={setAppearance}
            />

        </div>
    );
}