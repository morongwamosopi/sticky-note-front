import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from 'react-native';
import { BookmarkPlus, BookmarkCheck, X, Share2 } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
  withTiming,
  Easing,
  withDelay
} from 'react-native-reanimated';
import { Platform } from 'react-native';
import { theme } from '@/styles/theme';
import { Idea } from '@/context/IdeaContext';

interface StickyNoteProps {
  idea: Idea;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onShare?: (idea: Idea) => void;
  index?: number;
  fullView?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function StickyNote({ 
  idea, 
  onToggleFavorite, 
  onRemove, 
  onShare,
  index = 0,
  fullView = false
}: StickyNoteProps) {
  // Animation values
  const scale = useSharedValue(0.8);
  const rotate = useSharedValue(index % 2 === 0 ? -2 : 2);
  const opacity = useSharedValue(0);
  
  // Note styles based on color
  const noteColor = theme.colors.sticky[idea.color];
  
  // Format date
  const formattedDate = new Date(idea.date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  // Animate in on mount
  React.useEffect(() => {
    opacity.value = withDelay(
      index * 100, 
      withTiming(1, { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    );
    scale.value = withDelay(
      index * 100, 
      withSpring(1, { damping: 12, stiffness: 100 })
    );
  }, []);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  // Handle press animation
  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  // Handle remove animation
  const handleRemove = () => {
    opacity.value = withTiming(0, { duration: 300 });
    scale.value = withTiming(0.5, { duration: 300 }, () => {
      onRemove(idea.id);
    });
  };

  // Handle share
  const handleShare = () => {
    if (onShare) {
      onShare(idea);
    }
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        animatedStyle,
        { backgroundColor: noteColor.background },
        fullView ? styles.fullView : {}
      ]}
    >
      {/* Note content */}
      <View style={styles.contentContainer}>
        <Text style={[styles.categoryText, { color: noteColor.text }]}>
          {idea.category}
        </Text>
        
        <Text 
          style={[
            styles.ideaText, 
            { color: noteColor.text },
            fullView ? styles.fullViewText : {}
          ]}
          numberOfLines={fullView ? undefined : 4}
        >
          {idea.text}
        </Text>
        
        <Text style={[styles.dateText, { color: noteColor.text }]}>
          {formattedDate}
        </Text>
      </View>
      
      {/* Controls */}
      <View style={styles.controls}>
        {/* Favorite button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => onToggleFavorite(idea.id)}
          activeOpacity={0.7}
        >
          {idea.isFavorite ? (
            <BookmarkCheck size={22} color={noteColor.text} />
          ) : (
            <BookmarkPlus size={22} color={noteColor.text} />
          )}
        </TouchableOpacity>
        
        {/* Share button */}
        {onShare && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleShare}
            activeOpacity={0.7}
          >
            <Share2 size={20} color={noteColor.text} />
          </TouchableOpacity>
        )}
        
        {/* Remove button */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleRemove}
          activeOpacity={0.7}
        >
          <X size={22} color={noteColor.text} />
        </TouchableOpacity>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 2,
    marginHorizontal: 8,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '2px 3px 8px rgba(0, 0, 0, 0.15)',
      },
    }),
    width: '100%',
    maxWidth: 340,
    minHeight: 180,
    alignSelf: 'center',
  },
  fullView: {
    minHeight: 250,
    maxWidth: 500,
  },
  contentContainer: {
    flex: 1,
  },
  categoryText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginBottom: 8,
  },
  ideaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 16,
    flex: 1,
  },
  fullViewText: {
    fontSize: 20,
    lineHeight: 28,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
  },
});