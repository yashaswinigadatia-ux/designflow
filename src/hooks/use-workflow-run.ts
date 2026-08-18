// Runs the DesignFlow graph.
// Reads connected UI nodes and generates a visual prototype payload.

import { useEffect, useRef, useState } from 'react';
import { useGraph } from '@joint/react-plus';

import { useAnnounce } from '@/components/ui/announcer-context';
import { delay } from '@/utils/delay';

import {
    getAgentPlans,
    type AgentPlan,
} from '@/workflow/agent-plans';

import {
    getNodeData,
} from '@/workflow/node-model';

import type {
    RunStatus,
    WorkflowElement,
    WorkflowLink,
} from '@/workflow/workflow-types';


// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface RunFeedback {
    readonly message: string;
    readonly canConfigure: boolean;
}

export interface WorkflowRunState {
    readonly isRunning: boolean;
    readonly error: string | null;
    readonly run: () => Promise<RunFeedback | null>;
    readonly stop: () => void;
}


// -----------------------------------------------------------------------------
// Prototype data
// -----------------------------------------------------------------------------
//
// IMPORTANT:
// This is the exact structure consumed by prototype-renderer.tsx.
// Keep both files synchronized.
//

export interface PrototypeData {
    readonly prototypeName: string;
    readonly version: string;

    readonly screenName: string;
    readonly screenType: string;
    readonly description: string;

    readonly layout: string;

    readonly componentType: string;
    readonly variant: string;
    readonly label: string;

    readonly navigationPosition: string;
    readonly logo: string;
    readonly menuItems: string[];
}


// -----------------------------------------------------------------------------
// Format validation messages
// -----------------------------------------------------------------------------

function formatIssues(
    list: readonly string[],
): string {

    const MAX = 3;

    if (list.length <= MAX) {
        return list.join('\n');
    }

    return [
        ...list.slice(0, MAX),
        `+${list.length - MAX} more`,
    ].join('\n');
}


// -----------------------------------------------------------------------------
// Get output configuration
// -----------------------------------------------------------------------------

function getOutputConfiguration(
    graph: Parameters<typeof getAgentPlans>[0],
    plan: AgentPlan,
): {
    prototypeName: string;
    version: string;
} {

    for (const outputId of plan.outputIds) {

        const cell =
            graph.getCell(outputId);

        if (!cell) {
            continue;
        }

        const data =
            getNodeData(cell);

        if (
            data?.kind === 'output'
        ) {

            return {
                prototypeName:
                    data.prototypeName ||
                    'Login Prototype',

                version:
                    data.version ||
                    'v1.0',
            };
        }
    }

    return {
        prototypeName: 'Login Prototype',
        version: 'v1.0',
    };
}


// -----------------------------------------------------------------------------
// Generate visual prototype data
// -----------------------------------------------------------------------------

function generatePrototype(
    graph: Parameters<typeof getAgentPlans>[0],
    plan: AgentPlan,
): string {

    const input =
        plan.input?.data;

    const skill =
        plan.skill?.data;

    const tool =
        plan.tool?.data;


    const outputConfig =
        getOutputConfiguration(
            graph,
            plan,
        );


    const prototype: PrototypeData = {

        // -------------------------------------------------------------
        // Output metadata
        // -------------------------------------------------------------

        prototypeName:
            outputConfig.prototypeName,

        version:
            outputConfig.version,


        // -------------------------------------------------------------
        // Screen
        // -------------------------------------------------------------

        screenName:
            input?.screenName ??
            'Login Screen',

        screenType:
            input?.screenType ??
            'Login',

        description:
            input?.description ??
            'User login screen',


        // -------------------------------------------------------------
        // Layout
        // -------------------------------------------------------------

        layout:
            skill?.layout ??
            'Mobile',


        // -------------------------------------------------------------
        // Component
        // -------------------------------------------------------------

        componentType:
            plan.agent.componentType,

        variant:
            plan.agent.variant,

        label:
            plan.agent.label,


        // -------------------------------------------------------------
        // Navigation
        // -------------------------------------------------------------

        navigationPosition:
            tool?.navigationPosition ??
            'Top',

        logo:
            tool?.logo ??
            'DesignFlow',

        menuItems:
            tool?.menuItems
                ? tool.menuItems
                    .split(',')
                    .map(item => item.trim())
                    .filter(Boolean)
                : [
                    'Home',
                    'Profile',
                    'Settings',
                ],
    };


    return JSON.stringify(
        prototype,
        null,
        2,
    );
}


// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useWorkflowRun(): WorkflowRunState {

    const {
        graph,
        setCellData,
    } =
        useGraph<
            WorkflowElement,
            WorkflowLink
        >();


    const announce =
        useAnnounce();


    const [
        isRunning,
        setIsRunning,
    ] =
        useState(false);


    const [
        error,
        setError,
    ] =
        useState<string | null>(null);


    const abortRef =
        useRef<AbortController | null>(null);


    // -------------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------------

    useEffect(() => {

        return () => {

            abortRef.current?.abort();

        };

    }, []);


    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------

    const TRANSIENT: Record<string, unknown> = {
        skipHistory: true,
    };


    // -------------------------------------------------------------------------
    // Set status safely
    // -------------------------------------------------------------------------

    function setStatus(
        id: string,
        status: RunStatus,
    ): void {

        setCellData(
            id,

            previous => {

                // Links do not have `kind`.
                if (
                    !('kind' in previous)
                ) {
                    return previous;
                }


                return {
                    ...previous,
                    status,
                };
            },

            TRANSIENT,
        );
    }


    // -------------------------------------------------------------------------
    // Write preview to Output node
    // -------------------------------------------------------------------------

    function writeOutputs(
        ids: readonly string[],
        preview: string,
    ): void {

        for (
            const id of ids
        ) {

            setCellData(
                id,

                previous => {

                    // Make sure this is a node.
                    if (
                        !('kind' in previous)
                    ) {
                        return previous;
                    }


                    // Only output nodes can receive preview.
                    if (
                        previous.kind !== 'output'
                    ) {
                        return previous;
                    }


                    return {
                        ...previous,

                        status:
                            'running' as const,

                        preview,
                    };
                },

                TRANSIENT,
            );
        }
    }


    // -------------------------------------------------------------------------
    // Run workflow
    // -------------------------------------------------------------------------

    async function run():
        Promise<RunFeedback | null> {

        console.log(
            '🔥 DESIGNFLOW RUN STARTED',
        );


        // -------------------------------------------------------------
        // Build plans
        // -------------------------------------------------------------

        const plans =
            getAgentPlans(graph);


        console.log(
            'FINAL RUN DATA:',
            plans.map(plan => ({
                agent:
                    plan.agent.componentType,

                input:
                    plan.input?.id,

                skill:
                    plan.skill?.id,

                tool:
                    plan.tool?.id,

                output:
                    plan.outputIds,
            })),
        );


        // -------------------------------------------------------------
        // No agent
        // -------------------------------------------------------------

        if (
            plans.length === 0
        ) {

            const message =
                'Add a Button Component and connect the workflow to Prototype Preview.';


            setError(message);


            return {
                message,
                canConfigure: false,
            };
        }


        // -------------------------------------------------------------
        // Validate plans
        // -------------------------------------------------------------

        const runnable: AgentPlan[] = [];

        const messages: string[] = [];


        for (
            const plan of plans
        ) {

            const missing: string[] = [];


            if (
                !plan.input
            ) {

                missing.push(
                    'Input Screen',
                );
            }


            if (
                plan.outputIds.length === 0
            ) {

                missing.push(
                    'Prototype Preview',
                );
            }


            if (
                missing.length === 0
            ) {

                runnable.push(
                    plan,
                );

            } else {

                messages.push(
                    `${plan.agent.componentType} needs ${missing.join(
                        ' and ',
                    )} connected.`,
                );
            }
        }


        // -------------------------------------------------------------
        // Nothing runnable
        // -------------------------------------------------------------

        if (
            runnable.length === 0
        ) {

            const message =
                formatIssues(messages);


            setError(message);


            return {
                message,
                canConfigure: false,
            };
        }


        // -------------------------------------------------------------
        // Start controller
        // -------------------------------------------------------------

        const controller =
            new AbortController();


        abortRef.current =
            controller;


        setIsRunning(true);

        setError(null);


        announce(
            'Generating prototype...',
        );


        // -------------------------------------------------------------
        // Execute
        // -------------------------------------------------------------

        try {

            // ---------------------------------------------------------
            // Running state
            // ---------------------------------------------------------

            for (
                const plan of runnable
            ) {

                const ids = [

                    ...(plan.input
                        ? [plan.input.id]
                        : []),

                    ...(plan.skill
                        ? [plan.skill.id]
                        : []),

                    ...(plan.tool
                        ? [plan.tool.id]
                        : []),

                    plan.agentId,
                ];


                for (
                    const id of ids
                ) {

                    setStatus(
                        id,
                        'running',
                    );
                }


                // Clear old preview.
                writeOutputs(
                    plan.outputIds,
                    '',
                );
            }


            // ---------------------------------------------------------
            // Generate prototype
            // ---------------------------------------------------------

            for (
                const plan of runnable
            ) {

                if (
                    controller.signal.aborted
                ) {

                    return null;
                }


                console.log(
                    '⚙️ Generating:',
                    plan.agent.componentType,
                );


                const preview =
                    generatePrototype(
                        graph,
                        plan,
                    );


                await delay(700);


                if (
                    controller.signal.aborted
                ) {

                    return null;
                }


                // Write generated data.
                writeOutputs(
                    plan.outputIds,
                    preview,
                );


                // -----------------------------------------------------
                // Success state
                // -----------------------------------------------------

                const completeIds = [

                    ...(plan.input
                        ? [plan.input.id]
                        : []),

                    ...(plan.skill
                        ? [plan.skill.id]
                        : []),

                    ...(plan.tool
                        ? [plan.tool.id]
                        : []),

                    plan.agentId,

                    ...plan.outputIds,
                ];


                for (
                    const id of completeIds
                ) {

                    setStatus(
                        id,
                        'success',
                    );


                    await delay(100);
                }
            }


            // ---------------------------------------------------------
            // Finish
            // ---------------------------------------------------------

            const message =
                messages.length > 0
                    ? formatIssues(messages)
                    : null;


            setError(message);


            announce(
                'Prototype generated successfully.',
            );


            console.log(
                '✅ DESIGNFLOW PROTOTYPE GENERATED',
            );


            return message
                ? {
                    message,
                    canConfigure: false,
                }
                : null;


        } finally {

            setIsRunning(false);


            if (
                abortRef.current ===
                controller
            ) {

                abortRef.current =
                    null;
            }
        }
    }


    // -------------------------------------------------------------------------
    // Stop
    // -------------------------------------------------------------------------

    function stop(): void {

        console.log(
            '🛑 STOPPING DESIGNFLOW',
        );


        abortRef.current?.abort();
    }


    // -------------------------------------------------------------------------
    // Return
    // -------------------------------------------------------------------------

    return {
        isRunning,
        error,
        run,
        stop,
    };
}