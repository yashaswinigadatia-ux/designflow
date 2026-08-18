import type { dia } from '@joint/plus';

import { getNodeData, getNodeKind } from './node-model';

import type {
    AgentNodeData,
    NodeData,
    NodeKind,
} from './workflow-types';



type DataOfKind<K extends NodeKind> =
    Extract<NodeData, { readonly kind: K }>;



export interface WiredNode<K extends NodeKind> {

    readonly id: string;

    readonly data: DataOfKind<K>;

}



export interface AgentPlan {

    readonly agentId: string;

    readonly agent: AgentNodeData;

    readonly input: WiredNode<'input'> | null;

    readonly skill: WiredNode<'skill'> | null;

    readonly tool: WiredNode<'tool'> | null;

    readonly outputIds: readonly string[];

}



/**
 * Finds a connected node of a specific type.
 */
function getWiredNode<K extends NodeKind>(
    graph: dia.Graph,
    agent: dia.Element,
    expectedKind: K,
): WiredNode<K> | null {


    const links =
        graph.getConnectedLinks(agent);



    console.log(
        `🔎 Searching ${expectedKind} for agent`,
        agent.id
    );



    for (const link of links) {


        const source =
            link.getSourceCell();


        const target =
            link.getTargetCell();



        if (
            !source ||
            !target
        ) {
            continue;
        }



        // only incoming connections
        if (
            String(target.id)
            !==
            String(agent.id)
        ) {
            continue;
        }



        const sourceData =
            getNodeData(source);



        console.log(
            "➡️ Incoming connection:",
            {
                source: source.id,
                kind: sourceData?.kind,
                lookingFor: expectedKind,
            }
        );



        if (
            sourceData?.kind === expectedKind
        ) {

            console.log(
                "✅ MATCH FOUND:",
                source.id
            );


            return {

                id:
                    String(source.id),

                data:
                    sourceData as DataOfKind<K>,

            };

        }

    }



    console.log(
        "❌ No match found:",
        expectedKind
    );



    return null;

}





/**
 * Finds output nodes connected from Agent.
 */
function getOutputIds(
    graph: dia.Graph,
    agent: dia.Element,
): string[] {


    const ids:string[] = [];



    const links =
        graph.getConnectedLinks(agent);



    for (const link of links) {


        const source =
            link.getSourceCell();


        const target =
            link.getTargetCell();



        if (
            !source ||
            !target
        ) {
            continue;
        }



        if (
            String(source.id)
            !==
            String(agent.id)
        ) {
            continue;
        }



        if (
            getNodeKind(target)
            ===
            'output'
        ) {


            ids.push(
                String(target.id)
            );


        }

    }



    console.log(
        "📤 OUTPUT IDS:",
        ids
    );



    return ids;

}





export function getAgentPlans(
    graph: dia.Graph,
): AgentPlan[] {



    console.log(
        "🔥 getAgentPlans called"
    );



    console.log(
        "🔗 ALL LINKS:",
        graph.getLinks().map(link => ({
            source: link.get('source'),
            target: link.get('target'),
        }))
    );



    const plans:AgentPlan[] = [];




    for(
        const element of graph.getElements()
    ) {


        const data =
            getNodeData(element);



        console.log(
            "🧩 ELEMENT:",
            element.id,
            data?.kind
        );



        if(
            data?.kind !== 'agent'
        ){
            continue;
        }



        const plan:AgentPlan = {


            agentId:
                String(element.id),



            agent:
                data,



            input:
                getWiredNode(
                    graph,
                    element,
                    'input',
                ),



            skill:
                getWiredNode(
                    graph,
                    element,
                    'skill',
                ),



            tool:
                getWiredNode(
                    graph,
                    element,
                    'tool',
                ),



            outputIds:
                getOutputIds(
                    graph,
                    element,
                ),

        };



        console.log(
            "🚀 CREATED PLAN:",
            plan
        );



        plans.push(plan);

    }



    console.log(
        "🏁 FINAL PLANS:",
        plans 
    );



    return plans;

}