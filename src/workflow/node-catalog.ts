// Catalog of node kinds — single source of truth for each block's title, size, ports and
// default data.

import type {
    AccentKey,
    NodeData,
    NodeIconName,
    NodeKind,
    PortDescriptor,
} from './workflow-types';

/** Every kind except `note` (notes have no ports and aren't in the stencil). */
export type ConfigKind = Exclude<NodeKind, 'note'>;

export interface NodeConfig {
    readonly kind: ConfigKind;
    readonly title: string;
    readonly description: string;
    readonly icon: NodeIconName;
    readonly accent: AccentKey;
    readonly width: number;
    readonly height: number;
    readonly ports: readonly PortDescriptor[];
    readonly createData: () => NodeData;
}

export const NODE_CATALOG: Record<ConfigKind, NodeConfig> = {
    input: {
        kind: 'input',
        title: 'Login Screen',
        description: 'Starting screen of the application.',
        icon: 'type',
        accent: 'text',
        width: 256,
        height: 188,
        ports: [
            {
                id: 'out',
                direction: 'out',
                type: 'text',
                label: 'text',
                side: 'right',
            },
        ],
        createData: () => ({
            kind: 'input',
            status: 'idle',
            screenName: 'Login Screen',
            screenType: 'Login',
            description: 'User login screen',
        }),
    },

    skill: {
        kind: 'skill',
        title: 'Home Screen',
        description: 'Main dashboard after login.',
        icon: 'file-code',
        accent: 'skill',
        width: 256,
        height: 168,
        ports: [
            {
                id: 'out',
                direction: 'out',
                type: 'skill',
                label: 'skill',
                side: 'right',
            },
        ],
        createData: () => ({
            kind: 'skill',
            status: 'idle',
            screenName: 'Home Screen',
            layout: 'Mobile',
            description: 'Main dashboard after login',
        }),
    },

    agent: {
        kind: 'agent',
        title: 'Button Component',
        description: 'Reusable button component.',
        icon: 'bot',
        accent: 'brand',
        width: 272,
        height: 226,
        ports: [
            {
                id: 'prompt',
                direction: 'in',
                type: 'text',
                label: 'prompt',
                side: 'left',
                at: 0.816,
            },
            {
                id: 'skill',
                direction: 'in',
                type: 'skill',
                label: 'skill',
                side: 'left',
                at: 0.913,
            },
            {
                id: 'result',
                direction: 'out',
                type: 'result',
                label: 'result',
                side: 'right',
                at: 0.816,
            },
            {
                id: 'tool',
                direction: 'out',
                type: 'tool',
                label: 'tool',
                side: 'bottom',
                at: 0.5,
            },
        ],
        createData: () => ({
            kind: 'agent',
            status: 'idle',
            componentType: 'Button',
            variant: 'Primary',
            label: 'Login',
        }),
    },

    tool: {
        kind: 'tool',
        title: 'Navigation Bar',
        description: 'Top navigation component.',
        icon: 'reddit',
        accent: 'tool',
        width: 256,
        height: 200,
        ports: [
            {
                id: 'tool',
                direction: 'in',
                type: 'tool',
                label: 'tool',
                side: 'top',
            },
        ],
        createData: () => ({
            kind: 'tool',
            status: 'idle',
            navigationPosition: 'Top',
            logo: 'DesignFlow',
            menuItems: 'Home, Profile, Settings',
        }),
    },

    output: {
        kind: 'output',
        title: 'Prototype Preview',
        description: 'Final UI prototype.',
        icon: 'file-text',
        accent: 'result',
        width: 288,
        height: 224,
        ports: [
            {
                id: 'result',
                direction: 'in',
                type: 'result',
                label: 'result',
                side: 'left',
            },
        ],
        createData: () => ({
            kind: 'output',
            status: 'idle',
            prototypeName: 'Login Prototype',
            version: 'v1.0',
            preview: '',
        }),
    },
};

/** Stencil order */
export const STENCIL_KINDS: readonly ConfigKind[] = [
    'input',
    'skill',
    'agent',
    'tool',
    'output',
];

function getNodeConfig(kind: NodeKind | 'unknown'): NodeConfig | null {
    return kind === 'note' || kind === 'unknown'
        ? null
        : NODE_CATALOG[kind];
}

export function getPortConfig(
    kind: NodeKind | 'unknown',
    portId: string,
): PortDescriptor | null {
    return (
        getNodeConfig(kind)?.ports.find((port) => port.id === portId) ??
        null
    );
}