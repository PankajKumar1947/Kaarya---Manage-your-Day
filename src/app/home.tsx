import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
import { AppText } from '../components/app-text';
import { ScreenContainer } from '../components/screen-container';
import { AddTodoModal } from '../components/todo/add-todo-modal';
import { DateItem } from '../components/todo/date-item';
import { TodoItem } from '../components/todo/todo-item';
import { useAuth } from '../context/auth-context';
import { useTodos } from '../context/todo-context';
import { Colors } from '../theme/colors';
import { useCalendar } from '../hooks/use-calendar';

export default function HomeScreen() {
  const { todos, toggleTodo, deleteTodo, fetchTodos, addTodo, isLoading } = useTodos();
  const { user, logout } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  
  const {
    currentDate,
    selectedDateKey,
    setSelectedDateKey,
    monthDays,
    changeYear,
    setMonth,
    goToToday,
  } = useCalendar();

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);

  useEffect(() => {
    if (selectedDateKey) {
      fetchTodos(selectedDateKey);
    }
  }, [selectedDateKey, fetchTodos]);

  useEffect(() => {
    if (monthDays.length > 0) {
      const index = monthDays.findIndex(d => d.dateKey === selectedDateKey);
      if (index !== -1) {
        const timer = setTimeout(() => {
          flatListRef.current?.scrollToIndex({ 
            index, 
            animated: true, 
            viewPosition: 0.5 
          });
        }, 200);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedDateKey, monthDays.length]);

  const handleAddTodo = async (title: string) => {
    await addTodo(title, selectedDateKey);
  };

  const handleGoToToday = () => {
    goToToday();
    setIsMonthPickerVisible(false);
  };

  const isAddDisabled = !selectedDateKey;

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
          <TouchableOpacity 
            style={styles.calendarBtn}
            onPress={() => setIsMonthPickerVisible(true)}
          >
            <Ionicons name="calendar-outline" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.daySelectorContainer}>
          <FlatList
            ref={flatListRef}
            horizontal
            data={monthDays}
            renderItem={({ item }) => (
              <DateItem
                dayNum={item.dayNum}
                dayName={item.dayName}
                isSelected={selectedDateKey === item.dateKey}
                onPress={() => setSelectedDateKey(item.dateKey)}
              />
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelectorList}
            onScrollToIndexFailed={(info) => {
               flatListRef.current?.scrollToOffset({ 
                 offset: info.averageItemLength * info.index, 
                 animated: false 
               });
            }}
          />
        </View>

        <View style={styles.titleRow}>
          <AppText variant="h1" style={styles.title}>My Kaarya</AppText>
          <TouchableOpacity
            style={[styles.addBtn, isAddDisabled && styles.disabledBtn]}
            onPress={() => setIsAddModalVisible(true)}
            disabled={isAddDisabled}
          >
            <Ionicons 
              name="add" 
              size={32} 
              color={isAddDisabled ? Colors.grey : Colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <TodoItem
              item={item}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="clipboard-outline" size={64} color={Colors.grey} />
              <AppText variant="caption" style={{ marginTop: 16 }}>No Kaarya for this date!</AppText>
            </View>
          }
        />
      )}

      <AddTodoModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={handleAddTodo}
      />

      <Modal
        visible={isMonthPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMonthPickerVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsMonthPickerVisible(false)}
        >
          <View style={styles.pickerContent}>
            <View style={styles.pickerHeader}>
                <AppText bold style={styles.pickerTitle}>Select Date</AppText>
                <TouchableOpacity onPress={handleGoToToday} style={styles.todayBtn}>
                    <AppText color={Colors.primary} bold>Today</AppText>
                </TouchableOpacity>
            </View>
            
            <View style={styles.yearSelector}>
               <TouchableOpacity onPress={() => changeYear(-1)}>
                 <Ionicons name="chevron-back" size={24} color={Colors.primary} />
               </TouchableOpacity>
               <AppText bold style={styles.yearText}>{currentDate.getFullYear()}</AppText>
               <TouchableOpacity onPress={() => changeYear(1)}>
                 <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
               </TouchableOpacity>
            </View>

            <View style={styles.monthsGrid}>
              {Array.from({ length: 12 }).map((_, i) => {
                const date = new Date(currentDate.getFullYear(), i, 1);
                const monthName = date.toLocaleDateString('en-US', { month: 'short' });
                const isCurrent = currentDate.getMonth() === i;
                return (
                  <TouchableOpacity 
                    key={i} 
                    style={[styles.monthButton, isCurrent && styles.activeMonthButton]}
                    onPress={() => {
                      setMonth(i);
                      setIsMonthPickerVisible(false);
                    }}
                  >
                    <AppText color={isCurrent ? Colors.white : Colors.textPrimary}>{monthName}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    marginBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 18,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileBtn: {
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
    paddingHorizontal: 18,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 28,
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
  disabledBtn: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
    backgroundColor: Colors.inputBackground,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContent: {
    backgroundColor: Colors.white,
    width: '85%',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  pickerTitle: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  todayBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.background,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 20,
  },
  monthButton: {
    width: '30%',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: Colors.background,
  },
  activeMonthButton: {
    backgroundColor: Colors.primary,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 30,
    borderBottomWidth: 1,
    borderBottomColor: Colors.inputBorder,
    width: '100%',
    justifyContent: 'center',
  },
  yearText: {
    fontSize: 24,
    color: Colors.primary,
  }
});
