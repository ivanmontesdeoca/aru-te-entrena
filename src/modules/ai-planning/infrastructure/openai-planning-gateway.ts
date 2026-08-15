import "server-only";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { AiPlanningError } from "../application/errors";
import type { AiPlanningGateway } from "../application/ai-planning-service";
import { aiModelOutputSchema } from "../domain/schemas";
export const AI_PLANNING_MODEL="gpt-5.4-mini";
export class OpenAiPlanningGateway implements AiPlanningGateway { private readonly client:OpenAI;constructor(apiKey=process.env.OPENAI_API_KEY){if(!apiKey)throw new AiPlanningError("OPENAI_NOT_CONFIGURED",503);this.client=new OpenAI({apiKey,timeout:30_000,maxRetries:0});}async generate(context:unknown){try{const response=await this.client.responses.parse({model:AI_PLANNING_MODEL,reasoning:{effort:"low"},input:[{role:"system",content:"Generá planificación deportiva prudente y auditable en español. Usá sólo Catalogo_ID del contexto. Carga queda vacía salvo instrucción explícita. Si falta una decisión profesional relevante y aclaracion_ya_realizada es false, devolvé NEEDS_CLARIFICATION con una sola pregunta y 2 a 5 opciones. Si ya hubo aclaración, devolvé READY con propuesta o motivo_insuficiente, nunca otra pregunta. No diagnostiques ni prescribas tratamientos."},{role:"user",content:JSON.stringify(context)}],text:{format:zodTextFormat(aiModelOutputSchema,"routine_planning")}});if(!response.output_parsed)throw new AiPlanningError("INVALID_MODEL_RESPONSE",500);return{output:response.output_parsed,model:response.model,inputTokens:response.usage?.input_tokens,outputTokens:response.usage?.output_tokens};}catch(error){if(error instanceof AiPlanningError)throw error;if(error instanceof OpenAI.RateLimitError)throw new AiPlanningError("OPENAI_RATE_LIMIT",429,{cause:error});throw new AiPlanningError("OPENAI_UNAVAILABLE",503,{cause:error});}}
}
