import { GoogleGenAI, Type } from '@google/genai';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface CustomerData {
  nombre: string;
  deuda: number;
  diasAtraso: number;
  esNuevo: boolean;
  telefono: string;
  prioridad?: string;
}

export interface OcrResult {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  curp: string;
  folioIne: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  delegacion: string;
}

export type EventType = 'BIENVENIDA' | 'COBRANZA_MOROSO' | 'FALLA_TECNICA' | 'RECUPERACION_CHURN' | 'ATENCION_GENERAL';

export class CRM_AI_Agent {
  private getGoalByEvent(evento: EventType): string {
    const goals: Record<EventType, string> = {
      'BIENVENIDA': "Dar la bienvenida y confirmar activación de cuenta.",
      'COBRANZA_MOROSO': "Lograr compromiso de pago y ofrecer domiciliación bancaria.",
      'FALLA_TECNICA': "Dar soporte, calmar al cliente y escalar el ticket.",
      'RECUPERACION_CHURN': "Evitar la cancelación indagando el motivo y ofreciendo opciones.",
      'ATENCION_GENERAL': "Atención al cliente general"
    };
    return goals[evento] || goals['ATENCION_GENERAL'];
  }

  public async generateResponse(cliente: CustomerData, evento: EventType, mensajeUsuario: string = ""): Promise<string> {
    const systemPrompt = `
Eres un Agente de Éxito y Cobranza de la empresa de telecomunicaciones ADHDreams (Telmex). 
Tu objetivo actual es: ${this.getGoalByEvent(evento)}.
Datos del cliente:
- Nombre: ${cliente.nombre}
- Estado Pago: ${cliente.deuda > 0 ? 'MOROSO' : 'AL DÍA'}
- Saldo: $${cliente.deuda}
- Días de atraso: ${cliente.diasAtraso}
${cliente.prioridad ? `- Prioridad del Ticket: ${cliente.prioridad}` : ''}

REGLAS:
- Si es MOROSO: Sé empático pero persuasivo. Sugiere domiciliar el pago para evitar cortes.
- Si es NUEVO: Da una bienvenida cálida y explica los primeros pasos.
- Si quiere CANCELAR: Haz labor de recuperación ofreciendo una solución técnica o descuento.
- Si la PRIORIDAD es ALTA: Muestra extrema urgencia, discúlpate por los inconvenientes y asegura que el equipo técnico o especializado lo está atendiendo de inmediato.
- Usa emojis y lenguaje de WhatsApp (breve, directo, amigable).
- No uses formato markdown complejo, solo texto plano con emojis, ya que es para WhatsApp.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { role: 'user', parts: [{ text: mensajeUsuario || `Inicia conversación por evento: ${evento}` }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      return response.text || "No se pudo generar una respuesta.";
    } catch (error) {
      console.error("Error en IA:", error);
      return "Hubo un error al conectar con el agente de IA. Por favor, intenta de nuevo.";
    }
  }

  public async analyzeDocument(base64Image: string, mimeType: string): Promise<OcrResult | null> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              {
                inlineData: {
                  data: base64Image.split(',')[1] || base64Image,
                  mimeType: mimeType
                }
              },
              {
                text: "Extract all possible information from this Mexican ID (INE/IFE) or CURP document. Return only a JSON object with the following fields: nombres, apellidoPaterno, apellidoMaterno, curp, folioIne, calle, numeroExterior, numeroInterior, colonia, codigoPostal, ciudad, delegacion. If a field is not found, return an empty string. The field 'folioIne' is the 13-digit number on the back of the INE."
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nombres: { type: Type.STRING },
              apellidoPaterno: { type: Type.STRING },
              apellidoMaterno: { type: Type.STRING },
              curp: { type: Type.STRING },
              folioIne: { type: Type.STRING },
              calle: { type: Type.STRING },
              numeroExterior: { type: Type.STRING },
              numeroInterior: { type: Type.STRING },
              colonia: { type: Type.STRING },
              codigoPostal: { type: Type.STRING },
              ciudad: { type: Type.STRING },
              delegacion: { type: Type.STRING }
            },
            required: ["nombres", "apellidoPaterno", "apellidoMaterno", "curp"]
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text) as OcrResult;
      }
      return null;
    } catch (error) {
      console.error("Error in OCR analysis:", error);
      return null;
    }
  }
}

export const aiAgent = new CRM_AI_Agent();
