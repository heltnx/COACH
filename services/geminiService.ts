
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WeeklyProgram } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const programSchema = {
  type: Type.OBJECT,
  properties: {
    motivationalMessage: {
      type: Type.STRING,
      description: "Un message de motivation court et positif pour la semaine."
    },
    weeklySchedule: {
      type: Type.ARRAY,
      description: "Le programme d'activités pour les 7 jours de la semaine, commençant par Lundi.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: {
            type: Type.STRING,
            description: "Le jour de la semaine (ex: 'Lundi', 'Mardi').",
          },
          session: {
            type: Type.OBJECT,
            nullable: true,
            description: "La session d'activité prévue pour ce jour. Null si c'est un jour de repos.",
            properties: {
              type: {
                type: Type.STRING,
                enum: ['physique', 'ludique'],
                description: "Le type de session: 'physique' ou 'ludique'.",
              },
              title: {
                type: Type.STRING,
                description: "Un titre court et motivant pour la session.",
              },
              description: {
                type: Type.STRING,
                description: "Une brève description de l'objectif de la session.",
              },
              activities: {
                type: Type.ARRAY,
                description: "La liste des activités ou exercices à faire.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: {
                      type: Type.STRING,
                      description: "Le nom de l'activité ou de l'exercice.",
                    },
                    description: {
                      type: Type.STRING,
                      description: "Les instructions claires et détaillées pour réaliser l'activité. Pour les exercices physiques, inclure des conseils de sécurité.",
                    },
                    duration: {
                      type: Type.STRING,
                      description: "La durée de l'activité (ex: '15 minutes'). Optionnel."
                    },
                    reps: {
                      type: Type.STRING,
                      description: "Le nombre de répétitions. (ex: '10-12 répétitions'). Optionnel."
                    },
                    sets: {
                      type: Type.STRING,
                      description: "Le nombre de séries. (ex: '3 séries'). Optionnel."
                    },
                  },
                  required: ["name", "description"]
                },
              },
            },
            required: ["type", "title", "description", "activities"]
          },
        },
        required: ["day", "session"]
      },
    },
  },
  required: ["motivationalMessage", "weeklySchedule"]
};


const createPrompt = (profile: UserProfile): string => {
  return `
    Crée un programme de bien-être hebdomadaire personnalisé pour un senior.
    Voici les informations de l'utilisateur :
    - Nom : ${profile.name}
    - Âge : ${profile.age} ans
    - Niveau de mobilité : ${profile.mobility}
    - Handicaps/Conditions spécifiques : ${profile.disabilities.join(', ') || 'Aucun'}
    - Opérations passées pertinentes : ${profile.surgeries || 'Aucune'}
    - Objectifs principaux : ${profile.goals.join(', ')}
    - Équipement disponible : ${profile.equipment.join(', ') || 'Aucun équipement spécifique'}
    - Loisirs préférés : ${profile.hobbies.join(', ')}

    Instructions pour la génération du programme :
    1.  Le programme doit couvrir 7 jours, de Lundi à Dimanche.
    2.  Crée 3 jours de session au total. Les autres jours sont des jours de repos (session: null).
    3.  Alternez entre les jours d'activité et les jours de repos. Par exemple : Lundi (activité), Mardi (repos), Mercredi (activité), etc.
    4.  Incluez un mélange de séances 'physique' et 'ludique' (au moins une de chaque).
    5.  Les exercices physiques doivent être sûrs, adaptés à l'âge, à la mobilité, et aux conditions de l'utilisateur. Privilégiez des exercices à faible impact. Si l'utilisateur a du matériel, proposez des exercices qui l'utilisent.
    6.  Les instructions pour chaque exercice doivent être très claires, simples et détaillées, avec des conseils de sécurité.
    7.  Les activités ludiques doivent être basées sur les loisirs de l'utilisateur.
    8.  Le ton doit être encourageant, positif et bienveillant.
    9.  Génère un message de motivation unique pour la semaine.
    10. La réponse DOIT être uniquement au format JSON et respecter le schéma fourni. Ne pas inclure de texte avant ou après le JSON.
  `;
};

export const generateWeeklyProgram = async (profile: UserProfile): Promise<WeeklyProgram> => {
  const prompt = createPrompt(profile);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: programSchema,
      },
    });

    const jsonText = response.text.trim();
    const programData = JSON.parse(jsonText);

    if (!programData.weeklySchedule || programData.weeklySchedule.length !== 7) {
        throw new Error("Le programme généré n'est pas valide ou ne contient pas 7 jours.");
    }
    
    return programData as WeeklyProgram;

  } catch (error) {
    console.error("Error generating program with Gemini:", error);
    throw new Error("Failed to generate a valid weekly program from the AI.");
  }
};
