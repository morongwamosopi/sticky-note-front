import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
  Dimensions,
} from 'react-native';
import { useIdeas } from '@/context/IdeaContext';
import { theme } from '@/styles/theme';
import { Idea } from '@/context/IdeaContext';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

export default function BoardScreen() {
  const { ideas, toggleFavorite, removeIdea } = useIdeas();
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const windowWidth = Dimensions.get('window').width;

  // Check if there are ideas to display
  const hasIdeas = ideas.length > 0;

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

  // Navigate to next idea
  const goToNext = () => {
    if (currentIndex < ideas.length - 1) {
      translateX.value = withTiming(-windowWidth, { duration: 300 }, () => {
        translateX.value = windowWidth;
        runOnJS(setCurrentIndex)(currentIndex + 1);
        translateX.value = withTiming(0, { duration: 300 });
      });
    }
  };

  // Navigate to previous idea
  const goToPrevious = () => {
    if (currentIndex > 0) {
      translateX.value = withTiming(windowWidth, { duration: 300 }, () => {
        translateX.value = -windowWidth;
        runOnJS(setCurrentIndex)(currentIndex - 1);
        translateX.value = withTiming(0, { duration: 300 });
      });
    }
  };

  // Handle gesture
  const onGestureEvent = (event: any) => {
    translateX.value = event.translationX;
  };

  const onGestureEnd = (event: any) => {
    if (event.translationX < -100 && currentIndex < ideas.length - 1) {
      // Swipe left, go to next
      translateX.value = withTiming(-windowWidth, { duration: 300 }, () => {
        translateX.value = windowWidth;
        runOnJS(setCurrentIndex)(currentIndex + 1);
        translateX.value = withTiming(0, { duration: 300 });
      });
    } else if (event.translationX > 100 && currentIndex > 0) {
      // Swipe right, go to previous
      translateX.value = withTiming(windowWidth, { duration: 300 }, () => {
        translateX.value = -windowWidth;
        runOnJS(setCurrentIndex)(currentIndex - 1);
        translateX.value = withTiming(0, { duration: 300 });
      });
    } else {
      // Reset position
      translateX.value = withSpring(0);
    }
  };

  // Animated style for card
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Current idea being viewed
  const currentIdea = hasIdeas ? ideas[currentIndex] : null;

  // Group ideas by category for the board view
  const groupedIdeas = ideas.reduce((acc: any, idea: any) => {
    if (!acc[idea.category]) {
      acc[idea.category] = [];
    }
    acc[idea.category].push(idea);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {hasIdeas ? (
        <>
          {/* Fullscreen view */}
          <View style={styles.fullscreenContainer}>
            <Animated.View style={[styles.noteContainer, animatedStyle]}>
              {currentIdea && (
                <View style={styles.fullNoteWrapper}>
                  <View
                    style={[
                      styles.fullNote,
                      {
                        backgroundColor:
                          theme.colors.sticky[currentIdea.color].background,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: theme.colors.sticky[currentIdea.color].text },
                      ]}
                    >
                      {currentIdea.category}
                    </Text>

                    <Text
                      style={[
                        styles.ideaText,
                        { color: theme.colors.sticky[currentIdea.color].text },
                      ]}
                    >
                      {currentIdea.text}
                    </Text>

                    <Text
                      style={[
                        styles.dateText,
                        { color: theme.colors.sticky[currentIdea.color].text },
                      ]}
                    >
                      {new Date(currentIdea.date).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </Text>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => toggleFavorite(currentIdea.id)}
                      >
                        <Text style={styles.actionButtonText}>
                          {currentIdea.isFavorite
                            ? 'Remove from Favorites'
                            : 'Add to Favorites'}
                        </Text>
                      </TouchableOpacity>

                      {Platform.OS !== 'web' && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleShareIdea(currentIdea)}
                        >
                          <Text style={styles.actionButtonText}>Share</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </Animated.View>

            {/* Navigation buttons */}
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentIndex === 0 && styles.disabledButton,
                ]}
                onPress={goToPrevious}
                disabled={currentIndex === 0}
              >
                <ArrowLeft
                  size={24}
                  color={currentIndex === 0 ? '#ccc' : theme.colors.primary}
                />
              </TouchableOpacity>

              <Text style={styles.navigationText}>
                {currentIndex + 1} of {ideas.length}
              </Text>

              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentIndex === ideas.length - 1 && styles.disabledButton,
                ]}
                onPress={goToNext}
                disabled={currentIndex === ideas.length - 1}
              >
                <ArrowRight
                  size={24}
                  color={
                    currentIndex === ideas.length - 1
                      ? '#ccc'
                      : theme.colors.primary
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Board view */}
          <ScrollView
            style={styles.boardContainer}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.boardTitle}>All Ideas by Category</Text>

            {Object.entries(groupedIdeas).map(([category, categoryIdeas]) => (
              <View key={category} style={styles.categorySection}>
                <Text style={styles.categorySectionTitle}>{category}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryItems}
                >
                  {(categoryIdeas as Idea[]).map((idea, index) => (
                    <TouchableOpacity
                      key={idea.id}
                      style={[
                        styles.miniNote,
                        {
                          backgroundColor:
                            theme.colors.sticky[idea.color].background,
                        },
                      ]}
                      onPress={() =>
                        setCurrentIndex(
                          ideas.findIndex((i) => i.id === idea.id)
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.miniNoteText,
                          { color: theme.colors.sticky[idea.color].text },
                        ]}
                        numberOfLines={3}
                      >
                        {idea.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}

            <View style={styles.spacer} />
          </ScrollView>
        </>
      ) : (
        // Empty state
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No Ideas Yet</Text>
          <Text style={styles.emptyStateText}>
            Generate some business ideas to see them on your board.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  fullscreenContainer: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    position: 'relative',
  },
  noteContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullNoteWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  fullNote: {
    width: '100%',
    padding: 24,
    borderRadius: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '2px 4px 10px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  categoryText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  ideaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 16,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  navButton: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    ...theme.shadows.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navigationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginHorizontal: 16,
    color: theme.colors.text,
  },
  boardContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  boardTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: theme.colors.text,
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categorySectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 12,
  },
  categoryItems: {
    paddingBottom: 8,
  },
  miniNote: {
    width: 160,
    height: 160,
    padding: 16,
    marginRight: 12,
    borderRadius: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  miniNoteText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: theme.colors.text,
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
