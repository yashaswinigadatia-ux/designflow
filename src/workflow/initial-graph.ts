// Initial DesignFlow canvas.
// Shows the default UI design workflow when the app opens.

import {
    createLink,
    createNode,
    createNote,
} from './build-node';

import type {
    WorkflowCell,
} from './workflow-types';


const ONBOARDING_NOTE = `# 🎨 DesignFlow Setup

1. **Create your screens**
2. **Add UI components**
3. **Configure layouts**
4. **Connect design flow**
5. **Preview your prototype**

> 💡 Tip: Build your interface structure visually and generate a prototype flow.`;



const NODES = {

    note: createNote(
        { x: 430, y: -85 },
        {
            id: 'note-onboarding',
            text: ONBOARDING_NOTE,
            color: 'blue',
            size: {
                width: 340,
                height: 420,
            },
        },
    ),


    input: createNode(
        'input',
        { x: 80, y: 100 },
        {
            id: 'input-1',
        },
    ),


    skill: createNode(
        'skill',
        { x: 80, y: 350 },
        {
            id: 'skill-1',
        },
    ),


    agent: createNode(
        'agent',
        { x: 460, y: 220 },
        {
            id: 'agent-1',
        },
    ),


    tool: createNode(
        'tool',
        { x: 470, y: 500 },
        {
            id: 'tool-1',
        },
    ),


    output: createNode(
        'output',
        { x: 850, y: 260 },
        {
            id: 'output-1',
        },
    ),

};




/*
 * IMPORTANT:
 *
 * The Agent has these ports:
 *
 * INPUT:
 *   prompt -> Input Screen
 *   skill  -> Skill
 *
 * OUTPUT:
 *   result -> Prototype Preview
 *   tool   -> Navigation Tool
 *
 *
 * Therefore the graph must be:
 *
 *
 *       Input Screen
 *             |
 *             v
 *          prompt
 *             |
 *       +-----------+
 * Skill ->|  Button  |-----> Prototype Preview
 *         +-----------+
 *              |
 *              v
 *        Navigation Bar
 *
 */



const LINKS = [

    /*
     * Input Screen → Button
     *
     * Input node has:
     *     out
     *
     * Button has:
     *     prompt (input)
     */
    createLink(
        {
            id: 'input-1',
            port: 'out',
        },
        {
            id: 'agent-1',
            port: 'prompt',
        },
        {
            id: 'link-input-agent',
            label: 'Prompt',
        },
    ),



    /*
     * Home Screen / Skill → Button
     *
     * Skill node has:
     *     out
     *
     * Button has:
     *     skill (input)
     */
    createLink(
        {
            id: 'skill-1',
            port: 'out',
        },
        {
            id: 'agent-1',
            port: 'skill',
        },
        {
            id: 'link-skill-agent',
            label: 'Skill',
        },
    ),



    /*
     * Button → Navigation Bar
     *
     * Button has:
     *     tool (output)
     *
     * Navigation Bar has:
     *     tool (input)
     */
    createLink(
        {
            id: 'agent-1',
            port: 'tool',
        },
        {
            id: 'tool-1',
            port: 'tool',
        },
        {
            id: 'link-agent-tool',
            label: 'Tool',
        },
    ),



    /*
     * Button → Prototype Preview
     *
     * Button has:
     *     result (output)
     *
     * Prototype Preview has:
     *     result (input)
     *
     * THIS IS THE CONNECTION YOUR OLD GRAPH WAS MISSING.
     */
    createLink(
        {
            id: 'agent-1',
            port: 'result',
        },
        {
            id: 'output-1',
            port: 'result',
        },
        {
            id: 'link-agent-output',
            label: 'Result',
        },
    ),

];




export const INITIAL_CELLS:
    readonly WorkflowCell[] = [
        ...Object.values(NODES),
        ...LINKS,
    ];