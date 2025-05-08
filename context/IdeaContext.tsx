import React, { createContext, useContext, useState, useEffect } from "react";
import { generateRandomIdea } from "@/utils/ideaGenerator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { http } from "@/utils/http";

export type IdeaColor = "yellow" | "blue" | "green" | "pink";

export interface Idea {
  id: string;
  text: string;
  color: IdeaColor;
  date: string;
  isFavorite: boolean;
  category: string;
}

interface IdeaContextType {
  ideas: Idea[];
  favoriteIdeas: Idea[];
  addIdea: (category?: string) => void;
  toggleFavorite: (id: string) => void;
  removeIdea: (id: string) => void;
  loading: boolean;
}

const IdeaContext = createContext<IdeaContextType | undefined>(undefined);

// Mock AsyncStorage for web platform
const mockAsyncStorage = {
  getItem: async (key: string) => null,
  setItem: async (key: string, value: string) => {},
};

// Use real AsyncStorage when available, otherwise use mock
const storage =
  typeof AsyncStorage !== "undefined" ? AsyncStorage : mockAsyncStorage;

export const IdeaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [favoriteIdeas, setFavoriteIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);

  // Load saved ideas from storage on initial load
  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const savedIdeas = await storage.getItem("ideas");

        const savedFavorites = await storage.getItem("favoriteIdeas");

        if (savedIdeas) {
          setIdeas(JSON.parse(savedIdeas));
        }

        if (savedFavorites) {
          setFavoriteIdeas(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error("Failed to load ideas:", error);
      }
    };

    loadIdeas();
  }, []);

  // Save ideas to storage whenever they change
  useEffect(() => {
    const saveIdeas = async () => {
      try {
        await storage.setItem("ideas", JSON.stringify(ideas));
        await storage.setItem("favoriteIdeas", JSON.stringify(favoriteIdeas));
      } catch (error) {
        console.error("Failed to save ideas:", error);
      }
    };

    saveIdeas();
  }, [ideas, favoriteIdeas]);

  const addIdeaToHandle = async (
    title: string,
    description: string,
    category: string
  ) => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        console.warn("No auth token found");
        return;
      }

      const response = await http.post(
        "/employee/notes",
        {
          title,
          description,
          category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Idea added successfully", response.data);
    } catch (error) {
      console.error("Failed to add idea", error);
    }
  };

  const addIdea = (category?: string) => {
    setLoading(true);

    setTimeout(() => {
      const newIdea = generateRandomIdea(category);
      addIdeaToHandle(newIdea.category, newIdea.text, newIdea.category);

      setIdeas((currentIdeas) => [newIdea, ...currentIdeas]); // ← correct usage

      setLoading(false);
    }, 600);
  };

  const toggleFavorite = (id: string) => {
    setIdeas((currentIdeas) =>
      currentIdeas.map((idea) =>
        idea.id === id ? { ...idea, isFavorite: !idea.isFavorite } : idea
      )
    );

    // Update favorites list
    const updatedIdea = ideas.find((idea) => idea.id === id);
    if (updatedIdea) {
      const newIsFavorite = !updatedIdea.isFavorite;
      if (newIsFavorite) {
        setFavoriteIdeas((current) => [
          ...current,
          { ...updatedIdea, isFavorite: true },
        ]);
      } else {
        setFavoriteIdeas((current) => current.filter((idea) => idea.id !== id));
      }
    }
  };

  const removeIdea = (id: string) => {
    setIdeas((currentIdeas) => currentIdeas.filter((idea) => idea.id !== id));
    setFavoriteIdeas((currentFavorites) =>
      currentFavorites.filter((idea) => idea.id !== id)
    );
  };

  return (
    <IdeaContext.Provider
      value={{
        ideas,
        favoriteIdeas,
        addIdea,
        toggleFavorite,
        removeIdea,
        loading,
      }}
    >
      {children}
    </IdeaContext.Provider>
  );
};

export const useIdeas = () => {
  const context = useContext(IdeaContext);
  if (!context) {
    throw new Error("useIdeas must be used within an IdeaProvider");
  }
  return context;
};
