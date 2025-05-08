import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Share,
  Platform
} from 'react-native';
import { useIdeas } from '@/context/IdeaContext';
import StickyNote from '@/components/StickyNote';
import CategorySelector from '@/components/CategorySelector';
import { theme } from '@/styles/theme';
import { Idea } from '@/context/IdeaContext';
import { Sparkles, RefreshCw } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function GenerateScreen() {
  const { ideas, addIdea, toggleFavorite, removeIdea, loading } = useIdeas();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  
  // Animation values
  const buttonScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  
  // Generate a new idea
  const handleGenerateIdea = () => {
    // Button press animation
    buttonScale.value = withSpring(0.95, {}, () => {
      buttonScale.value = withSpring(1);
    });
    
    // If loading, animate rotation
    if (!loading) {
      addIdea(selectedCategory);
    }
  };

  // Start rotation animation when loading
  React.useEffect(() => {
    if (loading) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1, // -1 for infinite
        false
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
  }, [loading]);
  
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
  
  // Button animation style
  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });
  
  // Icon rotation animation style
  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });
  
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Generate random business ideas and save your favorites.
            Choose a category or go with a random selection.
          </Text>
        </View>
        
        {/* Category selector */}
        <CategorySelector 
          onSelectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        
        {/* Generate button */}
        <AnimatedTouchable
          style={[styles.generateButton, animatedButtonStyle]}
          onPress={handleGenerateIdea}
          activeOpacity={0.8}
        >
          <Text style={styles.generateButtonText}>
            Generate Business Idea
          </Text>
          <Animated.View style={rotationStyle}>
            {loading ? (
              <RefreshCw color="white" size={20} />
            ) : (
              <Sparkles color="white" size={20} />
            )}
          </Animated.View>
        </AnimatedTouchable>
        
        {/* Recent ideas */}
        {ideas.length > 0 && (
          <View style={styles.recentIdeasContainer}>
            <Text style={styles.sectionTitle}>Recent Ideas</Text>
            {ideas.slice(0, 5).map((idea, index) => (
              <StickyNote
                key={idea.id}
                idea={idea}
                onToggleFavorite={toggleFavorite}
                onRemove={removeIdea}
                onShare={Platform.OS !== 'web' ? handleShareIdea : undefined}
                index={index}
              />
            ))}
          </View>
        )}
        
        {/* Empty state */}
        {ideas.length === 0 && !loading && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No ideas generated yet. Tap the button above to create your first idea!
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
  instructionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.sm,
  },
  instructionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
  },
  generateButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    flexDirection: 'row',
    ...theme.shadows.md,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginRight: 8,
  },
  recentIdeasContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});