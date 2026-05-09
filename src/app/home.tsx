import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from '../components/app-text';
import { ScreenContainer } from '../components/screen-container';
import { useAuth } from '../context/auth-context';
import { Todo, useTodos } from '../context/todo-context';
import { Colors } from '../theme/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { todos, toggleTodo } = useTodos();
  const { user, logout } = useAuth();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  // Generate 14 days starting from today for a better horizontal scroll experience
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      days.push({
        id: i.toString(),
        dayNum: date.getDate().toString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0,
        fullDate: date.toDateString()
      });
    }
    return days;
  }, []);

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onPress={() => toggleTodo(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
        {item.completed && <Ionicons name="checkmark" size={16} color={Colors.white} />}
      </View>
      <AppText style={[styles.todoTitle, item.completed && styles.completedText]}>
        {item.title}
      </AppText>
    </TouchableOpacity>
  );

  const renderDateItem = ({ item, index }: { item: typeof weekDays[0], index: number }) => {
    const isSelected = selectedDateIndex === index;
    return (
      <TouchableOpacity
        style={[
          styles.dayCircle,
          isSelected ? styles.activeDay : styles.inactiveDay
        ]}
        onPress={() => setSelectedDateIndex(index)}
        activeOpacity={0.8}
      >
        <AppText
          bold
          style={styles.dayNumText}
          color={isSelected ? Colors.white : Colors.textPrimary}
        >
          {item.dayNum}
        </AppText>
        <AppText
          variant="caption"
          style={styles.dayNameText}
          color={isSelected ? 'rgba(255,255,255,0.8)' : Colors.textSecondary}
        >
          {item.dayName}
        </AppText>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.profileBtn} onPress={logout}>
            <Ionicons name="person-circle-outline" size={40} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <AppText variant="caption">Welcome back,</AppText>
            <AppText bold style={{ fontSize: 18 }}>{user?.name || 'User'}</AppText>
          </View>
          <TouchableOpacity style={styles.calendarBtn}>
            <Ionicons name="calendar-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.daySelectorContainer}>
          <FlatList
            horizontal
            data={weekDays}
            renderItem={renderDateItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelectorList}
            snapToInterval={86} // dayCircle width (70) + marginRight (16)
            decelerationRate="fast"
          />
        </View>

        <View style={styles.titleRow}>
          <AppText variant="h1" style={styles.title}>My Todos</AppText>
          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add" size={32} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={64} color={Colors.grey} />
            <AppText variant="caption" style={{ marginTop: 16 }}>No todos for today!</AppText>
          </View>
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    // Horizontal padding removed here so list can go to edges
  },
  header: {
    paddingTop: 20,
    marginBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileBtn: {
    // Styling for profile
  },
  calendarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  daySelectorContainer: {
    marginBottom: 20,
  },
  daySelectorList: {
    paddingHorizontal: 24,
    paddingBottom: 8, // For shadow visibility
  },
  dayCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginRight: 16,
  },
  activeDay: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inactiveDay: {
    backgroundColor: Colors.white,
    borderColor: Colors.inputBorder,
  },
  dayNameText: {
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  dayNumText: {
    fontSize: 20,
    lineHeight: 22,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginBottom: 0,
    fontSize: 32,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  listContent: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  todoTitle: {
    fontSize: 16,
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    opacity: 0.5,
  }
});
