import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Platform
} from 'react-native';
import { BUSINESS_CATEGORIES } from '@/utils/ideaGenerator';
import { theme } from '@/styles/theme';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

interface CategorySelectorProps {
  onSelectCategory: (category: string | undefined) => void;
  selectedCategory: string | undefined;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function CategorySelector({ 
  onSelectCategory, 
  selectedCategory 
}: CategorySelectorProps) {
  const [expanded, setExpanded] = useState(false);
  const containerHeight = useSharedValue(56);
  const rotateArrow = useSharedValue(0);

  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
    containerHeight.value = withTiming(
      expanded ? 56 : 200,
      { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
    );
    rotateArrow.value = withTiming(
      expanded ? 0 : 1,
      { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
    );
  };

  // Select a category
  const handleSelectCategory = (category: string | undefined) => {
    onSelectCategory(category);
    toggleExpanded();
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => {
    return {
      height: containerHeight.value,
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotateArrow.value * 180}deg` }
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <Text style={styles.headerText}>
          {selectedCategory || 'Select a category (optional)'}
        </Text>
        <Animated.Text style={[styles.arrow, arrowStyle]}>↓</Animated.Text>
      </TouchableOpacity>
      
      {expanded && (
        <ScrollView style={styles.categoryList}>
          <TouchableOpacity 
            style={[
              styles.categoryItem, 
              selectedCategory === undefined && styles.selectedCategory
            ]} 
            onPress={() => handleSelectCategory(undefined)}
          >
            <Text style={styles.categoryText}>Random (All Categories)</Text>
          </TouchableOpacity>
          
          {BUSINESS_CATEGORIES.map((category) => (
            <TouchableOpacity 
              key={category}
              style={[
                styles.categoryItem, 
                selectedCategory === category && styles.selectedCategory
              ]} 
              onPress={() => handleSelectCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: theme.colors.text,
  },
  arrow: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedCategory: {
    backgroundColor: theme.colors.primary + '20', // 20% opacity
  },
  categoryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: theme.colors.text,
  },
});