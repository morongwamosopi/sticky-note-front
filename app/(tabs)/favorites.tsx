import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Share,
  Platform
} from 'react-native';
import { useIdeas } from '@/context/IdeaContext';
import StickyNote from '@/components/StickyNote';
import { theme } from '@/styles/theme';
import { Idea } from '@/context/IdeaContext';
import { BookmarkX } from 'lucide-react-native';

export default function FavoritesScreen() {
  const { favoriteIdeas, toggleFavorite, removeIdea } = useIdeas();
  
  // Handle sharing an idea
  const handleShareIdea = async (idea: Idea) => {
    try {
      await Share.share({
        message: `Business Idea: ${idea.text} (Category: ${idea.category}) - Generated with IdeaSticky`,
        title: 'Check out this business idea!',
      });
    } catch (error) {
      console.error('Error sharing idea:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {favoriteIdeas.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Your Favorite Ideas</Text>
            {favoriteIdeas.map((idea, index) => (
              <StickyNote
                key={idea.id}
                idea={idea}
                onToggleFavorite={toggleFavorite}
                onRemove={removeIdea}
                onShare={Platform.OS !== 'web' ? handleShareIdea : undefined}
                index={index}
                fullView
              />
            ))}
            <View style={styles.spacer} />
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <BookmarkX size={48} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyStateText}>
              Your favorite business ideas will appear here. Tap the bookmark icon on any idea to add it to your favorites.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 80,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  spacer: {
    height: 100,
  },
});