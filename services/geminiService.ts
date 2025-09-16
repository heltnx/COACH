// Implementing the Gemini service to generate a weekly program.
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WeeklyProgram, Activity, SessionType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (profile: UserProfile): string => {
  return `
    Crée un programme d'activités hebdomadaire personnalisé pour une personne âgée, en te basant sur le profil suivant.
    Le programme doit être équilibré, sûr, et motivant, avec une alternance de jours d'activité et de jours de repos.
    Il doit inclure des activités physiques adaptées et des activités ludiques pour la stimulation mentale.

    Profil de l'utilisateur :
    - Nom : ${profile.name}
    - Âge : ${profile.age} ans
    - Mobilité : ${profile.mobility}
    - Conditions particulières / Handicaps : ${profile.disabilities.join(', ') || 'Aucun'}
    - Opérations récentes : ${profile.surgeries || 'Aucune'}
    - Objectifs : ${profile.goals.join(', ')}
    - Équipement disponible : ${profile.equipment.join(', ') || 'Aucun'}
    - Loisirs préférés : ${profile.hobbies.join(', ')}

    Instructions importantes pour la structure de la réponse JSON :
    - Le programme doit couvrir 7 jours, en commençant par Lundi.
    - Pour chaque jour, spécifier le jour de la semaine ("Lundi", "Mardi", etc.).
    - Pour les jours d'activité, fournir un objet "session".
    - Pour les jours de repos, la valeur de la clé "session" DOIT être null.
    - Inclure un "motivationalMessage" général et bienveillant pour la semaine.

    Détails de l'objet "session" (quand il n'est pas null):
    - "type": "physique" ou "ludique".
    - "title": un titre court et motivant.
    - "description": une brève description de la session.
    - "activities": une liste d'activités, chacune avec :
        - "name": nom de l'activité.
        - "description": instructions détaillées et conseils de sécurité.
        - "duration" (ex: "10 minutes") OU "reps" et "sets" (ex: "10 répétitions", "3 séries").
        - "videoSearchQuery": une suggestion de terme de recherche simple pour trouver une vidéo de démonstration sur YouTube (ex: "exercices sur chaise pour seniors").

    Assure-toi que les activités proposées sont cohérentes avec le profil de l'utilisateur. Par exemple, pour une personne 'Principalement sédentaire', privilégie les exercices sur chaise.
    Le ton doit être encourageant et positif.
    Génère le programme complet en respectant scrupuleusement le format JSON demandé.
  `;
};

const weeklyProgramSchema = {
    type: Type.OBJECT,
    properties: {
        weeklySchedule: {
            type: Type.ARRAY,
            description: "Programme de la semaine du Lundi au Dimanche.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "Jour de la semaine (ex: Lundi)" },
                    session: {
                        type: Type.OBJECT,
                        description: "Détails de la session pour la journée, ou null si c'est un jour de repos.",
                        properties: {
                            type: { type: Type.STRING, enum: ['physique', 'ludique'], description: "Type de session" },
                            title: { type: Type.STRING, description: "Titre de la session" },
                            description: { type: Type.STRING, description: "Description courte de la session" },
                            activities: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        duration: { type: Type.STRING, description: "Durée de l'activité (optionnel)" },
                                        reps: { type: Type.STRING, description: "Nombre de répétitions (optionnel)" },
                                        sets: { type: Type.STRING, description: "Nombre de séries (optionnel)" },
                                        videoSearchQuery: { type: Type.STRING, description: "Suggestion de recherche vidéo" },
                                    },
                                    required: ['name', 'description']
                                }
                            }
                        },
                        required: ['type', 'title', 'description', 'activities']
                    }
                },
                required: ['day', 'session']
            }
        },
        motivationalMessage: {
            type: Type.STRING,
            description: "Un message de motivation pour la semaine."
        }
    },
    required: ['weeklySchedule', 'motivationalMessage']
};

export const generateWeeklyProgram = async (profile: UserProfile): Promise<WeeklyProgram> => {
  const prompt = generatePrompt(profile);
  
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: weeklyProgramSchema,
        },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as WeeklyProgram;

  } catch (error) {
    console.error("Error calling Gemini API for weekly program:", error);
    throw new Error("Failed to generate weekly program from Gemini API.");
  }
};

const singleActivitySchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        duration: { type: Type.STRING, description: "Durée de l'activité (optionnel)" },
        reps: { type: Type.STRING, description: "Nombre de répétitions (optionnel)" },
        sets: { type: Type.STRING, description: "Nombre de séries (optionnel)" },
        videoSearchQuery: { type: Type.STRING, description: "Suggestion de recherche vidéo" },
    },
    required: ['name', 'description']
};


export const generateReplacementActivity = async (profile: UserProfile, activityToReplace: Activity, sessionType: SessionType): Promise<Omit<Activity, 'id'>> => {
    const prompt = `
        Génère une seule activité de remplacement pour un senior dont le profil est le suivant:
        - Âge: ${profile.age}
        - Mobilité: ${profile.mobility}
        - Conditions: ${profile.disabilities.join(', ') || 'Aucune'}
        - Objectifs: ${profile.goals.join(', ')}

        L'activité à remplacer est:
        - Nom: ${activityToReplace.name}
        - Description: ${activityToReplace.description}

        La nouvelle activité doit être de type "${sessionType}". Elle doit être une alternative pertinente mais différente de l'originale.
        Assure-toi que la nouvelle suggestion est sûre et adaptée au profil de l'utilisateur.
        Ne fournis qu'une seule suggestion d'activité, en respectant scrupuleusement le format JSON demandé.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: singleActivitySchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Omit<Activity, 'id'>;

    } catch (error) {
        console.error("Error calling Gemini API for replacement activity:", error);
        throw new Error("Failed to generate replacement activity from Gemini API.");
    }
};